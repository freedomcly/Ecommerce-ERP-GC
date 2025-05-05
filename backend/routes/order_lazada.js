const express = require('express');
const request = require('superagent')
const xml2js = require('xml2js')
const mongo = require('../lib/model.auth.lazada.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {getSignLazada} = require('../utils/crypto.js')
const {shopDominInLazada} = require('../constants/lazada.js')
const {
    prefix,
    order_get,
    orders_get,
    order_items_get,
    orders_items_get,
    finance_transaction_details_get
} = require('../constants/path.lazada.js')
const {updateAuth, queryAuth, updateAuthSub} = require('../db/auth.js')
const {updateProductItemIdInLazada} = require('../db/product.js')

const router = express.Router();

router.get('/getOrder', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        const path = order_get
        const order_id = req.query.order_id

        const params = {
            access_token: accessToken,
            order_id
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(path, params)
    
        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                order_id
            })
            .then(result => {
                res.send(result.body)
            })
            .catch(err => {
                console.log(err)
            })
    })
});

router.get('/getOrders', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        const path = orders_get
        const status = req.query.status
        const limit = 100
        const created_before = req.query.created_before
        const created_after = req.query.created_after

        const params = {
            access_token: accessToken,
            status,
            limit,
            created_before,
            created_after
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(path, params)
    
        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                limit,
                status,
                created_before,
                created_after
            })
            .then(result => {
                // console.log(result)
                res.send({
                    code: 0,
                    data: {
                        text: 'success',
                        result: result.body
                    }
                })
            })
            .catch(err => {
                // console.log(err)
            })
    })


});

router.get('/getOrderItems', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        const path = order_items_get
        const order_id = req.query.order_id

        const params = {
            access_token: accessToken,
            order_id
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(path, params)
    
        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                order_id
            })
            .then(result => {
                console.log(result)
                res.send({
                    code: 0,
                    data: {
                        text: 'success',
                        result: result.body
                    }
                })
            })
            .catch(err => {
                // console.log(err)
            })
    })


});

router.get('/getOrdersItems', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        const path = orders_items_get
        const order_ids = req.query.order_ids

        const params = {
            access_token: accessToken,
            order_ids
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(path, params)

        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                order_ids
            })
            .then(result => {
                res.send({
                    code: 0,
                    data: {
                        text: 'success',
                        result: result.body
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    })


});

router.get('/getTransactionDetails', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        const path = finance_transaction_details_get
        const trade_order_id = req.query.trade_order_id
        const start_time = req.query.start_time
        const end_time = req.query.end_time

        const params = {
            access_token: accessToken,
            trade_order_id,
            start_time,
            end_time
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(path, params)
    
        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                trade_order_id,
                start_time,
                end_time
            })
            .then(result => {
                res.send(result.body)
            })
            .catch(err => {
                console.log(err, path)
            })
    })
});

module.exports = router;
