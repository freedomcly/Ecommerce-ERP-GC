const fs = require('fs')
const path = require('path')
var express = require('express');
var OSS = require('ali-oss')
const request = require('superagent')
const crypto = require('crypto')

var router = express.Router();
var _ = require('lodash')
var mongo = require('../lib/model.product.js')
const mongoProductOnline = require('../lib/model.shopee.shop.products.js')
var station = require('../constants/station.js')
const {getSign} = require('../utils/crypto.js')
const {toMp4, compress} = require('../utils/video.js')
const {
    media_space_init_video_upload
} = require('../constants/path.shopee.js')
const config = require('../configs/aliyun.js')
const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {
    findProduct,
    findProductOnline,
    updateProductVideoIdInShopee,
    checkMyProduct
} = require('../db/product.js')
const {
    initVideoUpload,
    uploadVideoPart,
    completeVideoUpload,
    getVideoUploadResult
} = require('./video_shopee.js')

const {
    uploadImage
} = require('../utils/upload.js')

const {
    unzipSync
} = require('../utils/zip.js')

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// const command = new ffmpeg()

const client = new OSS(config)

let pageLastId = {}
let pageLastIdForOnlineProduct = {}

router.post('/add', function(req, res, next) {
    const product_id = req.body._id.split(req.body.supplier_id)[1]
    mongo.insertMany(req.body).then(data => {
        console.log(data)
        console.log('插入成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('插入失败')
        res.send({code: 1})
    })
});

router.post('/edit', function(req, res, next) {
    console.log(req.body)
    mongo.updateOne({
        _id: Number(req.body._id),
    }, {$set: req.body}).then(data => {
        console.log(data)
        console.log('编辑成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('编辑失败')
        res.send({code: 1})
    })
});

router.post('/editVideo', function(req, res, next) {
    mongo.updateOne({
        _id: Number(req.body._id),
    }, {$set: {
        video_upload_id: req.body.video_upload_id || '',
        video_url: req.body.video_url || ''
    }}).then(data => {
        console.log(data)
        console.log('编辑成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('编辑失败')
        res.send({code: 1})
    })
})

router.post('/editAttribute', function(req, res, next) {
    const attr = _.omit(req.body, ['_id'])
    mongo.updateOne({
        _id: Number(req.body._id),
    }, {$set: attr}).then(data => {
        console.log(data)
        console.log('编辑成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('编辑失败')
        res.send({code: 1})
    })
});

router.post('/editStatus', function(req, res, next) {
    console.log(req.body)
    mongo.updateOne({
        _id: Number(req.body._id),
    }, {$set: {
        status: req.body.status
    }}).then(data => {
        console.log(data)
        console.log('编辑成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('编辑失败')
        res.send({code: 1})
    })
});

router.post('/batchAddStation', function(req, res, next) {
    mongo.updateMany({
        _id: {
            $in: req.body.ids
        }
    }, {
        $push: {
            published: req.body.stationId
        }
    }).then(data => {
        console.log('批量新增站点成功')
        res.send({code: 0})
    }).catch(err => {
        res.send({code: 1})
    })
})

router.post('/remove', function(req, res, next) {
    mongo.remove({
        _id: {
            $in: req.body.ids
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

router.get('/searchMany', function(req, res, next) {
    mongo.find({
        _id: {
            $in: req.query.ids
        }
    }).then(data => {
        res.send(data)
    })
});

router.post('/updateInventory', function(req, res, next) {
    mongo.updateOne({
        _id: Number(req.body.id)
    }, {
        $set: {
            'inventory.timestamp': req.body.timestamp
        }
    }).then(data => {
        console.log(data)
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('失败')
        res.send({code: 1})
    })
});

router.get('/getNewId', function(req, res, next) {
    // TODO _id => product_id
    mongo.find({supplier_id: req.query.supplier_id}).sort({product_id: 1}).then(data => {
        console.log('查询成功')
        // console.log(data)
        let formattedNewId

        if (!data.length) {
            formattedNewId = '001'
        } else {
            const productId = data[data.length - 1].product_id
            console.log(productId)
            // const productId = lastId.toString().substring(6)
            console.log(Number(productId) + 1)
            const newId = Number(productId) + 1
            if (newId <= 9) {
                formattedNewId = '00' + newId
            } else if (newId <= 99) {
                formattedNewId = '0' + newId
            } else {
                formattedNewId = newId
            }
        }

        if (!formattedNewId) formattedNewId = '001'

        res.send({
            code: 0,
            data: {
                newId: formattedNewId
            }
        })
    }).catch(err => {
        console.log('查询失败', err)
    })
});

function pollUploadResult (videoUploadId, callback) {
    getVideoUploadResult('SG', videoUploadId).then(data => {
        if (data.response.status === 'TRANSCODING') {
            console.log('TRANSCODING')
            setTimeout(() => {
                pollUploadResult(videoUploadId, callback)
            }, 2000)
        } else if (data.response.status === 'SUCCEEDED') {
            console.log('SUCCEEDED')
            callback(data.response.video_info)
        } else {
            console.log(data.response.status)
        }
    }).catch(err => {
        console.log(err)
    })
}

module.exports = router;
