const request = require('superagent')
const schedule = require('node-schedule')

const {partner_id, merchant_id, domain} = require('../configs/shopee.test')
const {getSign} = require('./crypto')
const {auth_access_token_get} = require('../constants/path.shopee')
const {queryAuth, updateAuthSub, queryAuthByShopId} = require('../db/auth')
const {queryAllShopeeShop} = require('../db/shop')

function requestGetAccessToken (region, shopId) {
    return new Promise((resolve, reject) => {
        queryAuthByShopId({shop_id: shopId}).then(data => {
            const path = auth_access_token_get
            const refreshToken = data[0].refresh_token
            const {sign, timestamp} = getSign(path)

            const sendData = {
                refresh_token: refreshToken,
                partner_id
            }
        
            if (shopId) {
                sendData.shop_id = Number(shopId)
            } else {
                sendData.merchant_id = Number(merchant_id)
            }

            request
                .post(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    sign
                })
                .send(sendData)
                .then(result => {
                    const tokens = JSON.parse(result.text)

                    updateAuthSub(tokens, region, shopId).then(() => {
                        resolve(tokens)
                        // res.cookie('accessToken', tokens.access_token, {maxAge: 900000})
                        // res.cookie('refreshToken', tokens.refresh_token, {maxAge: 900000})
                        // res.send({
                        //     code: 0,
                        //     data: {
                        //         text: 'refresh access token success',
                        //         ids: tokens
                        //     }
                        // })
                    }).catch(err => {
                        // console.log(err)
                        reject(err)
                        // res.send({code: 1})
                    })
                })
                .catch(err => {
                    reject(err)
                    // if (err.status === 403) {
                    //     res.send({
                    //         code: 1,
                    //         data: 'refresh access token 失败，请重新授权'
                    //     })       
                    //     return             
                    // }
                    // res.send({
                    //     code: 1,
                    //     data: err
                    // })
                })

        })
    })
}

async function authAll () {
    const shops = await queryAllShopeeShop()
    requestGetAccessToken('merchant').then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err)
    })

    shops.forEach(shop => {
        requestGetAccessToken(shop.region, shop.shop_id).then(data => {
            console.log(data)
        }).catch(err => {
            console.log(err)
        })
    })
}

function autoAuth () {
    const scheduleCorn = () => {
        schedule.scheduleJob('0 */235 * * * ?', () => {
            authAll()
        })
    }
    scheduleCorn()
}

module.exports = {
    requestGetAccessToken,
    authAll,
    autoAuth
}