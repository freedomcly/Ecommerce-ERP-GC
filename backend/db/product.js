const mongo = require('../lib/model.product.js')
const mongoProductOnline = require('../lib/model.shopee.shop.products.js')

function findProduct (params) {
    return new Promise((resolve, reject) => {
        mongo.find(params.findQuery).limit(params.pagesize).sort(params.sort).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function findProductOnline (params) {
    let sort = {}
    if (params.sort) {
        sort[params.sort.prop] = params.sort.order
    } else {
        sort = {_id: 1}
    }

    return new Promise((resolve, reject) => {
        mongoProductOnline.find(params.findQuery).limit(params.pagesize).sort(sort).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function updateProductItemIdInLazada (params) {
    const key = `item_id_in_lazada.${params.region}`
    let obj = {}
    obj[key] = params.item_id
    
    return new Promise((resolve, reject) => {
        mongo.updateOne({
            _id: params.id,
        }, {
            $set: obj
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject('err', err)
        })
    })
}

function updateProductItemIdInCoupang (params) {
    mongo.updateOne({
        _id: params.id,
    }, {
        $set: {
            item_id_in_coupang: params.item_id
        }
    }).then(data => {
        console.log(data)
    }).catch(err => {
        console.log('err', err)
    })
}

function updateProductVideoIdInShopee (params) {
    mongo.updateOne({
        _id: params.id,
    }, {
        $set: {
            video_upload_id_in_shopee: params.video_upload_id,
            video_url: params.video_url
        }
    }).then(data => {
        console.log(data)
    }).catch(err => {
        console.log('err', err)
    })
}

function checkMyProduct (id) {
    return new Promise(resolve => {
        mongo.find({
            _id: Number(id)
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log('err', err)
        })
    })
}

module.exports = {
    findProduct,
    findProductOnline,
    updateProductItemIdInLazada,
    updateProductVideoIdInShopee,
    checkMyProduct,
    updateProductItemIdInCoupang
}
