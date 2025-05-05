const express = require('express');
const request = require('superagent')

const {app_secret, app_key} = require('../../configs/tiktok.js')
const mongo = require('../../lib/model.auth.tiktok.js')
const {getSignTikTok} = require('../../utils/crypto.js')

const router = express.Router();

function getAccessToken(code, app_key) {
    return new Promise((resolve, reject) => {
        request
            .get('http://auth.tiktok-shops.com/api/v2/token/get')
            .set('Content-Type', 'application/json')
            .query({
                app_secret,
                auth_code: code,
                app_key,
                grant_type: 'authorized_code',
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

function getAuthorizedShops() {
    return new Promise((resolve, reject) => {
        mongo.find({}).then(data => {
            const accessToken = data[0].access_token
            const path = '/authorization/202309/shops'
            const query = {
                app_key,
                timestamp: Math.round(Date.now()/1000)
            }
            console.log(accessToken, app_key)
            const sign = getSignTikTok(path, query, app_secret)

            request
              .get(`https://open-api.tiktokglobalshop.com${path}`)
              .set('Content-Type', 'application/json')
              .set('x-tts-access-token', accessToken)
              .query({...query, sign})
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })

        }).catch(err => {
            reject(err)
        })
    })
}

router.get('/getAuthorizedShops', function(req, res, next) {

  getAuthorizedShops().then(data => {
    console.log(data)

    res.send({
        code: 0,
        data: data
    })  
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});

router.get('/getAccessToken', function(req, res, next) {
  const code = req.query.code
  const appKey = req.query.app_key
  getAccessToken(code, appKey).then(data => {
    console.log(data)
    console.log(data.text)
    const authData = JSON.parse(data.text).data

    mongo.updateOne({
        seller_name: authData.seller_name
    }, authData, {
        upsert: true
    }).then(data => {
        res.send({
            code: 0,
            data: {
                text: 'get access token success',
                data: authData
            }
        })
    }).catch(err => {
        res.send({
            code: 1,
            data: err
        })
    })    
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});

module.exports = router;
