const mongo = require('../lib/model.globalProduct.js')

function insertProduct (list) {
    return new Promise((resolve) => {
        mongo.insertMany(list).then(data => {
            resolve(data)
        })
    })
}

function dropProducts () {
    mongo.deleteMany({}).then(data => {

    }).catch(err => {
        console.log(err)
    })
}

function queryAllProduct (id) {
    return new Promise(resolve => {
        mongo.find().then(data => {
            resolve(data)
        })
    })
}

function queryProduct (id) {
    return new Promise(resolve => {
        mongo.find({_id: id}).then(data => {
            resolve(data)
        })
    })
}

function updateProductPublishedInfo (params) {
    mongo.updateOne({
        global_item_id: params.global_item_id,
    }, {
        $set: {
            published_info: params.published_info
        }
    }).then(data => {
        console.log(data)
    }).catch(err => {
        console.log('err', err)
    })
}

function updateProductProductInfo (params) {
    mongo.updateOne({
        global_item_id: params.global_item_id,
    }, {
        $set: {
            product_info: params.product_info
        }
    }).then(data => {
        console.log(data)
    }).catch(err => {
        console.log('err', err)
    })
}

module.exports = {
    insertProduct,
    dropProducts,
    queryAllProduct,
    queryProduct,
    updateProductPublishedInfo,
    updateProductProductInfo
}
