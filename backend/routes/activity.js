const express = require('express');
const request = require('superagent')
const schedule = require('node-schedule')
const moment = require('moment')
var Logger = require('../lib/logger.js')
const mongo = require('../lib/model.shopee.discount.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {
    product_get_boosted_list,
    product_boost_item
} = require('../constants/path.shopee.js')
const {updateAuth, queryAuth, updateAuthSub} = require('../db/auth.js')
const {shopIdInShopee} = require('../constants/shopee.js')
const {requestGetAccessToken} = require('../utils/auth.js')

const router = express.Router();

const path = '/auth/token/create'

router.get('/getDefaultDiscount', function(req, res, next) {
    const region = req.query.region
    const shopId = req.query.shop_id
    let para

    if (shopId) {
        para = {shop_id: shopId}
    } else if (region) {
        para = {region}
    } else {
        para = null
    }
    mongo.find(para).then(data => {
        res.send({
            code: 0,
            data
        })
    }).catch(err => {
        console.log(err)
        // reject(err)
    })
});

router.post('/addDefaultDiscount', function(req, res, next) {
    const region = req.body.region
    const discount_id = req.body.discount_id
    mongo.deleteMany ({region}).then(data => {
        mongo.insertMany({region, _id: discount_id, shop_id: req.body.shop_id}).then(data => {
            res.send({
                code: 0,
                data: {
                    text: 'success'
                }
            })
        })
    })
});

// router.post('/removeDiscount', function(req, res, next) {
//     const region = req.body.region
//     const discount_id = req.body.discount_id

//     mongo.updateOne({region}, {$pull: {boost_items: item_id}}).then(data => {
//         res.send({
//             code: 0,
//             data: {
//                 text: 'success'
//             }
//         })
//     })
// });

module.exports = router;
