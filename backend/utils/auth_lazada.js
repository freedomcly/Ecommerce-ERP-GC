const request = require('superagent')
const schedule = require('node-schedule')

const {getSignLazada} = require('./crypto.js')
const {auth_token_refresh} = require('../constants/path.lazada.js')
const mongo = require('../lib/model.auth.lazada.js')

function refreshToken () {
  return new Promise((resolve, reject) => {
    mongo.find({}).then(data => {
      console.log(data)
      const path = auth_token_refresh
      const refresh_token = data[0].refresh_token
      const access_token = data[0].access_token

      const params = {
        access_token,
        refresh_token
      }

      const {sign, timestamp, app_key, sign_method} = getSignLazada(path, params)

      request
        .get(`https://api.lazada.com/rest${path}`)
        .set('Content-Type', 'application/json')
        .query({
            timestamp,
            sign,
            access_token,
            refresh_token,
            app_key,
            sign_method
        })
        .then(result => {
          console.log(result.body)
          if (result.body.code === 'InvalidCode') {
            console.log(result.body.code)
            return
          }

          mongo.updateOne({
            region: 'cb'
          }, {
            access_token: result.body.access_token,
            refresh_token: result.body.refresh_token,
            updated: Date.now(),
            country_user_info: result.body.country_user_info,
            expires_in: result.body.expires_in,
            account_id: result.body.account_id,
            country: result.body.country,
            account_platform: result.body.account_platform,
            account: result.body.account,
            refresh_expires_in: result.body.refresh_expires_in
          }).then(data => {
            console.log(data)
            resolve(result)
          }).catch(err => {
            reject(err)
          })

        })
        .catch(err => {
          reject(err)
        })


    }).catch(err => {
      reject(err)
    })
  })
}

function autoAuthLazada () {
    const scheduleCorn = () => {
        schedule.scheduleJob('0 0 0 */6 * ?', () => {
            refreshToken()
        })
    }
    scheduleCorn()
}

module.exports = {
  refreshToken,
  autoAuthLazada
}