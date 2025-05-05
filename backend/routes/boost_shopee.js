const express = require('express');
const request = require('superagent')
const schedule = require('node-schedule')
const moment = require('moment')
var Logger = require('../lib/logger.js')
const mongo = require('../lib/model.boost.shopee.js')
const {boostItem} = require('../connecters/shopee.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {getSign, getSignLazada} = require('../utils/crypto.js')
const {
    product_get_boosted_list,
    product_boost_item
} = require('../constants/path.shopee.js')
const {updateAuth, queryAuth, queryAuthByShopId, updateAuthSub} = require('../db/auth.js')
const {shopIdInShopee} = require('../constants/shopee.js')
const {requestGetAccessToken} = require('../utils/auth.js')

const router = express.Router();

const path = '/auth/token/create'

router.get('/getBoostList', function(req, res, next) {
    mongo.find({}).then(data => {
        res.send({
            code: 0,
            data: {
                text: 'get boost list success',
                result: data
            }
        })
        // resolve(data)
    }).catch(err => {
        console.log(err)
        // reject(err)
    })
});

router.get('/getBoostCoolDownSecond', function(req, res, next) {
    queryAuthByShopId({shop_id: req.query.shop_id}).then(data => {
        const path = product_get_boosted_list
        const accessToken = data[0].access_token
        const shopId = req.query.shop_id
        const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)
    
        request
            .get(`${domain}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                partner_id,
                timestamp,
                sign,
                shop_id: shopId,
                access_token: accessToken
            })
            .then(result => {
                res.send({
                    code: 0,
                    data: {
                        text: 'get status success',
                        data: result.body.response
                    }
                })
            })
            .catch(err => {
                if (err.status === 403) {
                    res.send({
                        code: 1,
                        data: err
                    })       
                    return             
                }
                res.send({
                    code: 1,
                    data: err
                })
            })

    })
});

router.post('/boostItem', function(req, res, next) {
    const region = req.body.region
    const shopId = req.body.shop_id
    boostItem(region, req.body.item_id_list, shopId)

    const scheduleCorn = () => {
        schedule.scheduleJob('0 */65 * * * ?', () => {
            boostItem(region, req.body.item_id_list, shopId)
        })
    }
    scheduleCorn()

    res.send({
        code: 0,
        data: {
            text: 'boosted'
        }
    })
});

router.post('/addBoost', function(req, res, next) {
    const region = req.body.region
    const item_id = req.body.item_id
    const shop_id = req.body.shop_id

    mongo.updateOne({shop_id}, {$addToSet: {boost_items: item_id}, $set: {shop_id}}).then(data => {
        res.send({
            code: 0,
            data: {
                text: 'success'
            }
        })
    })
});

router.post('/removeBoost', function(req, res, next) {
    const region = req.body.region
    const item_id = req.body.item_id
    const shopId = req.body.shop_id

    mongo.updateOne({shop_id: shopId}, {$pull: {boost_items: item_id}}).then(data => {
        res.send({
            code: 0,
            data: {
                text: 'success'
            }
        })
    })
});

router.post('/removeBoostShop', function(req, res, next) {
    const region = req.body.region

    mongo.deleteOne({region}).then(data => {
        res.send({
            code: 0,
            data: {
                text: 'success'
            }
        })
    })
});

router.post('/addBoostShop', function(req, res, next) {
    const region = req.body.region
    const shopId = req.body.shopId

    mongo.insertMany({region, shop_id: shopId, boost_num: 5, boost_items: []}).then(data => {
        res.send({
            code: 0,
            data: {
                text: 'success'
            }
        })
    })
});

module.exports = router;
