const fs = require('fs')
const path = require('path')
var express = require('express');
var OSS = require('ali-oss')
const request = require('superagent')

var router = express.Router();
var _ = require('lodash')
var mongo = require('../lib/model.supplier.js')
var station = require('../constants/station.js')
const {getSign} = require('../utils/crypto.js')

const {
    global_product_get_category,
    global_product_add_global_item,
    media_space_upload_image
} = require('../constants/path.shopee.js')
const config = require('../configs/aliyun.js')
const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {findProduct} = require('../db/product.js')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const client = new OSS(config)

let pageLastId = {}

router.post('/add', function(req, res, next) {
    mongo.insertMany({
        name: req.body.name,
        serial: req.body.serial,
        series: req.body.series,
        address: req.body.address,
        QQGroup: req.body.QQGroup,
        wechat: req.body.wechat,
        tags: req.body.tags
    }).then(data => {
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
    mongo.updateOne({
        serial: Number(req.body.serial),
    }, {$set: {
        series: req.body.series,
        address: req.body.address,
        QQGroup: req.body.QQGroup,
        wechat: req.body.wechat,
        tags: req.body.tags
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
        _id: req.body._id,
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
    if (req.query['address.buildingFloor']) {
        console.log(typeof req.query['address.buildingFloor'])
        req.query['address.buildingFloor'] = Number(req.query['address.buildingFloor'] )
    }
    if (req.query.serial) {
        mongo.find({serial: req.query.serial}).then(data => {
            console.log('查询成功')
            res.send(data)
        }).catch(err => {
            console.log('查询失败')
        })
    } else if (req.query.tag) {
        mongo.find({...req.query, tags: {$elemMatch: {$eq: Number(req.query.tag)}}}).then(data => {
            console.log('查询成功')
            res.send(data)
        }).catch(err => {
            console.log('查询失败')
        })
    // TODO 供应商地址筛选
    } else {
        mongo.find(req.query).then(data => {
            console.log('查询成功')
            res.send(data)
        }).catch(err => {
            console.log('查询失败')
        })
    }
});

router.post('/upload', async function(req, res, next) {
    const file = req.files[0]

    // console.log('file:', file)
    // console.log(__dirname)
    // const fileType = file.mimetype.split('/')[0]
    // if (fileType === 'video') {
    //     const fileNameTmp = file.originalname.split('.')
    //     const fileSuffix = fileNameTmp[fileNameTmp.length - 1]

    //     if (fileSuffix.toUpperCase() !== 'MP4') {
    //         // 转换成MP4
    //         const pathToSourceFile = path.resolve(__dirname + '/../' + file.path)
    //         const readStream = fs.createReadStream(pathToSourceFile)
    //         const whiteStream = fs.createWriteStream('./tmp/' + file.originalname + '.mp4')

    //         ffmpeg(readStream)
    //             // .input(readStream)
    //             // .inputFormat('fileSuffix')
    //             .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
    //             .format('mp4')
    //             .pipe(whiteStream)

    //         const targetUrl = req.body.supplierId + '/' + req.body.productId + '/' + file.originalname + '.mp4'
    //         const result = await client.put(targetUrl, file.path); // 不一定要上传到阿里云

    //         console.log(result)
    //     }

    //     return
    // }

    const targetUrl = req.body.supplierId + '/' + req.body.productId + '/' + file.originalname
    const result = await client.put(targetUrl, file.path);

    if (result.res.statusCode === 200) {
        res.send({
            code: 0,
            data: {
                result
            }
        })
    } else {
        res.send({code: 1})
    }
})

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

        res.send({
            code: 0,
            data: {
                newId: formattedNewId
            }
        })
    }).catch(err => {
        console.log('查询失败')
    })
});

module.exports = router;
