const express = require('express');
const request = require('superagent')
const mongo = require('../lib/model.auth.lazada.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {getSignLazada} = require('../utils/crypto.js')
const {category_tree_get} = require('../constants/path.lazada.js')
const {updateAuth, queryAuth, updateAuthSub} = require('../db/auth.js')
const {refreshToken} = require('../utils/auth_lazada.js')
const {config} = require('../configs/lazada.js')

const router = express.Router();

const path = '/auth/token/create'

router.get('/createToken', function(req, res, next) {
    const {sign, timestamp} = getSignLazada(path, {
        code: req.query.code,
        app_key: config.app_key,
        sign_method: 'sha256'
    })

    request
        .get(`https://api.lazada.com/rest${path}`)
        .set('Content-Type', 'application/json')
        .query({
            timestamp,
            sign,
            code: req.query.code,
            app_key: config.app_key,
            sign_method: 'sha256'
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
                info: result.body.country_user_info,
                updated: Date.now(),
                country_user_info: result.body.country_user_info,
                expires_in: result.body.expires_in,
                account_id: result.body.account_id,
                country: result.body.country,
                account_platform: result.body.account_platform,
                account: result.body.account,
                refresh_expires_in: result.body.refresh_expires_in
            }).then(data => {
                res.send({
                    code: 0,
                    data: {
                        text: 'get access token success',
                        result: result.body
                    }
                })
                // resolve(data)
            }).catch(err => {
                console.log(err)
                // reject(err)
            })

        })
        .catch(err => {
        })
});

router.get('/refreshToken', function(req, res, next) {
    refreshToken().then(result => {
        res.send({
            code: 0,
            data: {
                text: 'refresh token success',
                result: result
            }
        })
    }).catch(err => {
        res.send({
            code: 1,
            data: {
                text: 'refresh token fail',
                result: err
            }
        })
    })
});

router.get('/getCurrentTokenData', function(req, res, next) {
    mongo.find({}).then(data => {
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

module.exports = router;
