const _ = require('lodash')
const request = require('superagent')
const express = require('express');
const router = express.Router();
const mongo = require('../lib/model.order.js')
const {
    queryAllShopeeShop
} = require('../db/shop.js')
const {queryAuthByShopId} = require('../db/auth.js')
const {getSign} = require('../utils/crypto.js')
const {partner_id, domain} = require('../configs/shopee.test.js')

const {
    order_get_order_list,
    logistics_ship_order,
    logistics_get_shipping_parameter,
    logistics_get_tracking_number
} = require('../constants/path.shopee.js')
const {
    shopIdInShopeeMap
} = require('../constants/shopee.js')

router.post('/add', function(req, res, next) {
    mongo.insertMany(req.body).then(data => {
        // console.log(data)
        console.log('插入成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('插入失败')
        res.send({code: 1})
    })
});

router.post('/edit', function(req, res, next) {
    const orderContent = _.omit(req.body, ['_id']);
    mongo.updateOne({
        _id: req.body._id,
    }, orderContent, {upsert: true}).then(data => {
        console.log(data)
        console.log('编辑成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('编辑失败')
        res.send({code: 1})
    })
});

router.post('/editBatch', function(req, res, next) {
    const orderList = req.body.order_list;
    const editItemPromises = orderList.map(order => {
        return new Promise(resolve => {
            mongo.updateOne({
                _id: order._id,
            }, {
                $set: _.omit(order, ['_id'])
            }).then(data => {
                resolve(data)
            })
        })
    })
    Promise.all([
        ...editItemPromises
    ]).then(data => {
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('编辑失败')
        res.send({code: 1})
    })
});

router.post('/remove', function(req, res, next) {
    mongo.remove({
        _id: {
            $in: req.body.order_list
        }
    }).then(data => {
        console.log(data)
        console.log('删除成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('删除失败')
        res.send({code: 1})
    })
});

router.get('/search', function(req, res, next) {
    let status
    let cutoff
    let query
    if (req.query.status) {
        status = req.query.status
    } else {
        status = {$ne: 5}
    }

    if (req.query.cutoff === '') {
        cutoff = {$exists: false}
    } else if (req.query.cutoff) {
        cutoff = req.query.cutoff
    }

    query = req.query
    query.status = status

    if (cutoff) {
        query.cutoff = cutoff
    }

    if (req.query.generate_date && req.query.generate_date.length) {
        query['info_from_platform.create_time'] = {$gte: Number(req.query.generate_date[0]), $lte: Number(req.query.generate_date[1])}
    }

    if (req.query.delivery_date_timestamp && req.query.delivery_date_timestamp.length) {
        query.delivery_date_timestamp = {$gte: Number(req.query.delivery_date_timestamp[0]), $lte: Number(req.query.delivery_date_timestamp[1])}
    }

    if (req.query.productId) {
        query.items = {$elemMatch: {item_sku: {$regex: req.query.productId}}}
    }

    mongo.find(query).then(data => {
        console.log('查询成功')
        res.send({code: 0, data})
    }).catch(err => {
        console.log(err)
        console.log('查询失败')
        res.send({code: 1})
    })
});

router.get('/autoImport', async function(req, res, next) {
    const shops = await queryAllShopeeShop()
    const now = new Date().getTime()
    const sevenDaysAgo = now - 86400 * 7 * 1000
    let importPromises = []

    shops.forEach(shop => {
        let promise = new Promise(resolve => {
            getOrderList({
                shop_id: shop.shop_id,
                order_status: req.query.order_status,
                time_from: Math.floor(sevenDaysAgo / 1000),
                time_to: Math.floor(now / 1000)
            }).then(data => {
                resolve({
                    shop_id: shop.shop_id,
                    data
                })
            })
        })
          
        importPromises.push(promise)
    })

    Promise.all(importPromises).then(data => {
        Promise.all(importOrders(data)).then(promiseResult => {
            res.send({code: 0, shops, data, importResult: promiseResult})
        })
    })
});

function importOrders (data) {
    let promises = []
    data.forEach(item => {
        if (item.data.order_list.length) {
            item.data.order_list.forEach(subItem => {
                let job = new Promise((resolve, reject) => {
                    mongo.insertMany({
                        _id: subItem.order_sn,
                        platform: 'shopee',
                        region: shopIdInShopeeMap[item.shop_id],
                        shop_id: item.shop_id,
                        delivery_date: ''
                    }).then(async data => {
                        // 申请出货
                        shipOrder({
                            order_sn: subItem.order_sn,
                            shop_id: item.shop_id,
                            dropoff: {
                                // tracking_number: trackingno
                            }
                        }).then(shopOrderResult => {
                            console.log(shopOrderResult)
                        })
                        resolve({
                            _id: subItem.order_sn,
                            shop_id: item.shop_id
                        })
                        // getShippingParameter({
                        //     order_sn: subItem.order_sn,
                        //     shop_id: item.shop_id
                        // }).then(shoppingParameter => {
                        //     console.log(shoppingParameter, 'shoppingParameter')

                        //     getTrackingNumber({
                        //         order_sn: subItem.order_sn,
                        //         shop_id: item.shop_id
                        //     }).then(trackingno => {
                        //         console.log(trackingno)
                        //         // 申请出货
                        //         shipOrder({
                        //             order_sn: subItem.order_sn,
                        //             shop_id: item.shop_id,
                        //             dropoff: {
                        //                 // tracking_number: trackingno
                        //             }
                        //         }).then(shopOrderResult => {
                        //             console.log(shopOrderResult)
                        //         })

                        //     })
                        // })
                    })
                })
                promises.push(job)
            })
        }
    })
    return promises
}

router.post('/shipOrder', function(req, res, next) {
    shipOrder(req.body).then(data => {
        res.send({code: 0, data})
    })
});

function getOrderList (query) {
    const path = order_get_order_list
    const shopId = query.shop_id

    return new Promise((resolve, reject) => {
        queryAuthByShopId({shop_id: shopId}).then(data => {
            if (!data[0]) return
            const accessToken = data[0].access_token
            const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)
            request
                .get(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    access_token: accessToken,
                    shop_id: shopId,
                    sign,
                    time_range_field: 'create_time',
                    page_size: 100, // TODO
                    order_status: query.order_status,
                    time_from: query.time_from,
                    time_to: query.time_to
                })
                .then(result => {
                    const res = JSON.parse(result.text)
                    console.log(res)
                    if (!res.error) {
                        resolve(res.response)
                    } else {
                        console.log(res.message)
                    }
                })
                .catch(err => {
                    if (err.status === 403) {
                        console.log({
                            code: 403,
                            data: err
                        })
                        return             
                    }
                    console.log({
                        code: 1,
                        data: err
                    })
                })
        })
    })
}

function shipOrder (query) {
    const path = logistics_ship_order
    const shopId = query.shop_id

    return new Promise((resolve, reject) => {
        queryAuthByShopId({shop_id: shopId}).then(data => {
            if (!data[0]) return
            const accessToken = data[0].access_token
            const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)
            request
                .post(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    access_token: accessToken,
                    shop_id: shopId,
                    sign
                })
                .send({
                    order_sn: query.order_sn,
                    dropoff: query.dropoff
                })
                .then(result => {
                    const res = JSON.parse(result.text)
                    console.log(res)
                    if (!res.error) {
                        resolve(res.response)
                    } else {
                        reject(res.message)
                    }
                })
                .catch(err => {
                    if (err.status === 403) {
                        reject({
                            code: 1,
                            data: err
                        })
                        return             
                    }
                    reject({
                        code: 1,
                        data: err
                    })
                })
        })
    })
}

function getShippingParameter (query) {
    const path = logistics_get_shipping_parameter
    const shopId = query.shop_id

    return new Promise((resolve, reject) => {
        queryAuthByShopId({shop_id: shopId}).then(data => {
            if (!data[0]) return
            const accessToken = data[0].access_token
            const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)
            request
                .get(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    access_token: accessToken,
                    shop_id: shopId,
                    sign,
                    order_sn: query.order_sn
                })
                .then(result => {
                    const res = JSON.parse(result.text)
                    console.log(res)
                    if (!res.error) {
                        resolve(res.response)
                    } else {
                        reject(res.message)
                    }
                })
                .catch(err => {
                    if (err.status === 403) {
                        reject({
                            code: 1,
                            data: err
                        })
                        return             
                    }
                    reject({
                        code: 1,
                        data: err
                    })
                })
        })
    })
}

function getTrackingNumber (query) {
    const path = logistics_get_tracking_number
    const shopId = query.shop_id

    return new Promise((resolve, reject) => {
        queryAuthByShopId({shop_id: shopId}).then(data => {
            if (!data[0]) return
            const accessToken = data[0].access_token
            const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)
            request
                .get(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    access_token: accessToken,
                    shop_id: shopId,
                    sign,
                    order_sn: query.order_sn
                })
                .then(result => {
                    resolve(JSON.parse(result.text).response)
                })
                .catch(err => {
                    if (err.status === 403) {
                        // console.log(err)
                        console.log({
                            code: 1,
                            data: err
                        })       
                        return             
                    }
                    console.log({
                        code: 1,
                        data: err
                    })
                })
        })
    })
}

module.exports = router;
