const _ = require('lodash')
const express = require('express');
const router = express.Router();
const mongoProductOnline = require('../lib/model.shopee.shop.products.js')

router.get('/search', function(req, res, next) {
    console.log(req.query)
    let query = JSON.parse(req.query.query)

    mongoProductOnline.find(query).then(data => {
        console.log('查询成功')
        res.send({code: 0, data})
    }).catch(err => {
        console.log(err)
        console.log('查询失败')
        res.send({code: 1})
    })
});

module.exports = router;
