const express = require('express');
const request = require('superagent')
const xml2js = require('xml2js')
const mongo = require('../lib/model.auth.lazada.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {getSignLazada} = require('../utils/crypto.js')
const {shopDominInLazada} = require('../constants/lazada.js')
const {
    prefix,
    category_tree_get,
    category_attributes_get,
    product_global_create,
    product_create,
    product_item_get,
    product_stock_sellable_adjust,
    product_deactivate,
    images_migrate,
    image_migrate
} = require('../constants/path.lazada.js')
const {updateAuth, queryAuth, updateAuthSub} = require('../db/auth.js')
const {updateProductItemIdInLazada} = require('../db/product.js')

const router = express.Router();

router.get('/categoryTreeGet', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token

        const params = {
            access_token: accessToken
        }
    
        const {sign, timestamp, app_key, sign_method} = getSignLazada('/category/tree/get', params)
    
        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${category_tree_get}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken
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

router.get('/categoryAttributesGet', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        const categoryId = req.query.primary_category_id
        const params = {
            access_token: accessToken,
            primary_category_id: categoryId
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(category_attributes_get, params)

        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${category_attributes_get}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                primary_category_id: categoryId
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

router.post('/createProduct', function(req, res, next) {
    console.log('req.body: ', req.body)
    var builder = new xml2js.Builder()
    var xml = builder.buildObject(req.body.payload)

    var payload = JSON.stringify(req.body.payload)
    var globalId = req.body.payload.Request.Product.SPUId

    console.log('xml: ', xml)

    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        // const categoryId = req.query.primary_category_id
        const params = {
            access_token: accessToken,
            payload: payload
            // primary_category_id: categoryId
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(product_create, params)

        request
            .post(`${shopDominInLazada[req.body.country]}${prefix}${product_create}`)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            // .query({
            // })
            .send({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                payload: payload
            })
            .then(result => {
                const resultText = JSON.parse(result.text)

                if (resultText.code === '0') {
                    const item_id = resultText.data.item_id
                    updateProductItemIdInLazada({
                        id: globalId,
                        region: req.body.country,
                        item_id: item_id
                    }).then(data => {
                        console.log(data)
                        res.send({
                            code: 0,
                            data: {
                                text: 'published',
                                result: resultText
                            }
                        })

                    }).catch(err => {
                        console.log('err', err)
                        res.send({
                            code: 1,
                            data: {
                                text: 'publish err',
                                result: resultText
                            }
                        })
                    })
                } else {
                    res.send({
                        code: 1,
                        data: {
                            text: 'publish err',
                            result: resultText
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.send({
                    code: 1,
                    data: {
                        text: 'publish err'
                    }
                })
            })
    })
});

router.get('/productItemGet', function(req, res, next) {
    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token

        const params = {
            access_token: accessToken,
            item_id: req.query.item_id
        }
    
        const {sign, timestamp, app_key, sign_method} = getSignLazada(product_item_get, params)
    
        request
            .get(`${shopDominInLazada[req.query.country]}${prefix}${product_item_get}`)
            .set('Content-Type', 'application/json')
            .query({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                item_id: req.query.item_id
            })
            .then(result => {
                // console.log(result)
                res.send(result.body)
            })
            .catch(err => {
                // console.log(err)
            })
    })


});

router.post('/imagesMigrate', function(req, res, next) {
    console.log('req.body: ', req.body)
    var builder = new xml2js.Builder()
    var xml = builder.buildObject(req.body.payload)

    // console.log('xml: ', xml)

    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        // const categoryId = req.query.primary_category_id
        const params = {
            access_token: accessToken,
            payload: xml
            // primary_category_id: categoryId
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(images_migrate, params)

        request
            .post(`${shopDominInLazada[req.body.country]}${prefix}${images_migrate}`)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            // .query({
            // })
            .send({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                payload: xml
            })
            .then(result => {
                // console.log(result.text)
                res.send({
                    code: 0,
                    data: {
                        text: 'success',
                        result: result
                    }
                })
            })
            .catch(err => {
                // console.log(err)
            })
    })
});

router.post('/imageMigrate', function(req, res, next) {
    console.log('req.body: ', req.body)
    var builder = new xml2js.Builder()
    var xml = builder.buildObject(req.body.payload)

    // console.log('xml: ', xml)

    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        // const categoryId = req.query.primary_category_id
        const params = {
            access_token: accessToken,
            payload: xml
            // primary_category_id: categoryId
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(image_migrate, params)

        request
            .post(`${shopDominInLazada[req.body.country]}${prefix}${image_migrate}`)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            // .query({
            // })
            .send({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                payload: xml
            })
            .then(result => {
                // console.log(result.text)
                res.send({
                    code: 0,
                    data: {
                        text: 'success',
                        result: JSON.parse(result.text)
                    }
                })
            })
            .catch(err => {
                // console.log(err)
            })
    })
});

router.post('/adjustSellableQuantity', function(req, res, next) {
    console.log('req.body: ', req.body)
    var builder = new xml2js.Builder()
    var xml = builder.buildObject(req.body.payload)

    // console.log('xml: ', xml)

    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        // const categoryId = req.query.primary_category_id
        const params = {
            access_token: accessToken,
            payload: xml
            // primary_category_id: categoryId
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(product_stock_sellable_adjust, params)

        request
            .post(`${shopDominInLazada[req.body.country]}${prefix}${product_stock_sellable_adjust}`)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            // .query({
            // })
            .send({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                payload: xml
            })
            .then(result => {
                // console.log(result.text)
                res.send({
                    code: 0,
                    data: {
                        text: 'success',
                        result: result
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    })
});

router.post('/deactivateProduct', function(req, res, next) {
    console.log('req.body: ', req.body)
    var builder = new xml2js.Builder()
    var xml = builder.buildObject(req.body.apiRequestBody)

    // console.log('xml: ', xml)

    mongo.find({region: 'cb'}).then(data => {
        const accessToken = data[0].access_token
        // const categoryId = req.query.primary_category_id
        const params = {
            access_token: accessToken,
            apiRequestBody: xml
            // primary_category_id: categoryId
        }

        const {sign, timestamp, app_key, sign_method} = getSignLazada(product_deactivate, params)

        request
            .post(`${shopDominInLazada[req.body.country]}${prefix}${product_deactivate}`)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            // .query({
            // })
            .send({
                timestamp,
                sign,
                app_key,
                sign_method,
                access_token: accessToken,
                apiRequestBody: xml
            })
            .then(result => {
                console.log(result.text)
                res.send(result)
            })
            .catch(err => {
                console.log(err)
            })
    })
});

module.exports = router;
