const express = require('express');
const request = require('superagent')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test')
const {getSign} = require('../utils/crypto')
const {requestGetAccessToken} = require('../utils/auth')
const {shop_auth_partner, auth_token_get, auth_access_token_get} = require('../constants/path.shopee')
const {updateAuth, queryAllAuth, insertAuthRegion} = require('../db/auth')

const router = express.Router();

router.get('/getAuthUrl', function(req, res, next) {
    const origin = req.query.origin
    res.send({
        code: 0,
        data: {
            url: getAuthUrl(origin)
        }
    })
});

function getAuthUrl(origin) {
    const path = shop_auth_partner
    const {sign, timestamp} = getSign(path)
    return `${domain}${path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}&redirect=${origin}`
}

router.get('/getToken', function(req, res, next) {
    requestGetToken(req.query.code).then(data => {
        const tokens = JSON.parse(data.text)

        updateAuth(tokens).then(() => {
            res.cookie('accessToken', tokens.access_token, {maxAge: 900000})
            res.cookie('refreshToken', tokens.refresh_token, {maxAge: 900000})
            res.send({
                code: 0,
                data: {
                    text: 'getToken success',
                }
            })
        }).catch(err => {
            res.send({code: 1})
        })
    })
});

router.get('/getAccessToken', function(req, res, next) {
    requestGetAccessToken(req.query.region, req.query.shop_id).then(tokenData => {
        res.send({
            code: 0,
            data: {
                text: 'refresh access token success',
                ids: tokenData
            }
        })
    }).catch(err => {
        res.send({code: 1})
    })
});

function requestGetToken(code) {
    const path = auth_token_get
    const {sign, timestamp} = getSign(path)

    return new Promise((resolve, reject) => {
        request
            .post(`${domain}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                partner_id,
                timestamp,
                sign,
            })
            .send({
                partner_id,
                main_account_id,
                code
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })

}

router.get('/getAuthList', function(req, res, next) {
    queryAllAuth().then(data => {
        res.send({
            code: 0,
            data
        })
    })
});

router.post('/insertAuthRegion', function(req, res, next) {
    insertAuthRegion(req.body).then(data => {
        res.send({code: 0})
    }).catch(err => {
        res.send({code: 1})
    })
});

module.exports = router;
