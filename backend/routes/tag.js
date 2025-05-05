const express = require('express');
const mongo = require('../lib/model.tag.js')

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
    const _id = req.body._id
    mongo.updateOne({_id}, {$set: {
      value: req.body.value,
      type: req.body.type,
      trans_en: req.body.trans_en,
      trans_tr: req.body.trans_tr,
      synonym: req.body.synonym,
      features: req.body.features
    }}).then(data => {
        console.log('插入成功')
        res.send(data)
    }).catch(err => {
        console.log('插入失败')
    })
});

router.post('/insert', function(req, res, next) {
    mongo.insertMany(req.body).then(data => {
        console.log('插入成功')
        res.send(data)
    }).catch(err => {
        console.log(err)
        console.log('插入失败')
    })
});

router.post('/delete', function(req, res, next) {
    mongo.remove({
        _id: req.body._id
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
