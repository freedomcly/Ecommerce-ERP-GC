const _ = require('lodash')
const express = require('express');
const router = express.Router();
const mongo = require('../lib/model.task.js')

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

router.get('/search', function(req, res, next) {
    let query = _.omit(req.query, ['publish_time'])
    const publish_time = req.query.publish_time
    if (publish_time && publish_time.length) {
        query.publish_time = {
            $gte: publish_time[0],
            $lte: publish_time[1]
        }
    }
    if (req.query.shop_id && req.query.shop_id.length) {
        const ids = req.query.shop_id.map(item => Number(item))
        query.shop_id = {$in: ids}
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

router.post('/remove', function(req, res, next) {
    mongo.remove({
        _id: {
            $in: req.body.id_list
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

router.post('/removeAll', function(req, res, next) {
    mongo.remove({}).then(data => {
        console.log(data)
        console.log('全部删除成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('删除失败')
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

module.exports = router;
