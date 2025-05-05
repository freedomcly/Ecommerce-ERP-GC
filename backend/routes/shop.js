const express = require('express');
const mongo = require('../lib/model.shop.js')

const router = express.Router();

router.get('/search', function(req, res, next) {
    mongo.find().then(data => {
        console.log('查询成功')
        res.send(data)
    }).catch(err => {
        console.log('查询失败')
    })
});

router.post('/edit', function(req, res, next) {
    const shop_id = req.body.shop_id
    mongo.updateOne({shop_id}, {$set: {
      theme_id: req.body.theme_id
    }}).then(data => {
        console.log('编辑成功')
        res.send(data)
    }).catch(err => {
        console.log('编辑失败')
    })
});

router.post('/insert', function(req, res, next) {
    mongo.insertMany({
      shop_id: req.body.shop_id,
      platform: req.body.platform,
      region: req.body.region,
      theme_id: req.body.theme_id
    }).then(data => {
        console.log('插入成功')
        res.send(data)
    }).catch(err => {
        console.log('插入失败')
    })
});

router.post('/delete', function(req, res, next) {
    mongo.remove({
        shop_id: req.body.shop_id
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

module.exports = router;
