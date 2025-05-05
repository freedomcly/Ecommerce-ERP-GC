const _ = require('lodash')
const express = require('express');
const router = express.Router();
const mongo = require('../lib/model.purchase.note.js')

router.post('/add', function(req, res, next) {
    mongo.updateOne({cutoff: req.body.cutoff}, req.body, {upsert: true}).then(data => {
        console.log('插入成功')
        res.send({code: 0, data})
    }).catch(err => {
        console.log(err)
        console.log('插入失败')
        res.send({code: 1})
    })
});

router.post('/edit', function(req, res, next) {
    const orderContent = _.omit(req.body, ['_id', 'cutoff']);
    mongo.updateOne({
        _id: req.body._id
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

// router.post('/editBatch', function(req, res, next) {
//     const orderList = req.body.order_list;
//     const editItemPromises = orderList.map(order => {
//         return new Promise(resolve => {
//             mongo.updateOne({
//                 _id: order._id,
//             }, {
//                 $set: _.omit(order, ['_id'])
//             }).then(data => {
//                 resolve(data)
//             })
//         })
//     })
//     Promise.all([
//         ...editItemPromises
//     ]).then(data => {
//         res.send({code: 0})
//     }).catch(err => {
//         console.log(err)
//         console.log('编辑失败')
//         res.send({code: 1})
//     })
// });

// router.post('/remove', function(req, res, next) {
//     mongo.remove({
//         _id: {
//             $in: req.body.order_list
//         }
//     }).then(data => {
//         console.log(data)
//         console.log('删除成功')
//         res.send({code: 0})
//     }).catch(err => {
//         console.log(err)
//         console.log('删除失败')
//         res.send({code: 1})
//     })
// });

router.get('/search', function(req, res, next) {
    // let status
    // let cutoff
    // let query
    // if (req.query.status) {
    //     status = req.query.status
    // } else {
    //     status = {$ne: 5}
    // }

    // if (req.query.cutoff === '') {
    //     cutoff = {$exists: false}
    // } else if (req.query.cutoff) {
    //     cutoff = req.query.cutoff
    // }

    // query = req.query
    // query.status = status

    // if (cutoff) {
    //     query.cutoff = cutoff
    // }

    mongo.find(req.query).limit(35).sort({cutoff: -1}).then(data => {
        console.log('查询成功')
        res.send({code: 0, data})
    }).catch(err => {
        console.log(err)
        console.log('查询失败')
        res.send({code: 1})
    })
});

module.exports = router;
