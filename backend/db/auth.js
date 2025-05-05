const mongo = require('../lib/model.auth.js')
const shopIdInShopee = require('../constants/shopee.js').shopIdInShopee

function insertAuthRegion (params) {
    return new Promise((resolve, reject) => {
        mongo.insertMany(params).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function queryAuth (params) {
    return new Promise((resolve, reject) => {
        mongo.find({region: params.region}).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function queryAllAuth (params) {
    return new Promise((resolve, reject) => {
        mongo.find({}).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function queryAuthByShopId (params) {
    return new Promise((resolve, reject) => {
        mongo.find({shop_id: params.shop_id}).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function updateAuth(tokens) {
    return new Promise((resolve, reject) => {
        mongo.updateMany({}, {
            $set: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                'updated': Date.now()
            }
        }, {
            upsert: true
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

function updateAuthSub(tokens, region, shop_id) {
    return new Promise((resolve, reject) => {
        mongo.updateOne({
            shop_id
        }, {
            $set: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                'updated': Date.now()
            }
        }, {
            upsert: true
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

module.exports = {
    insertAuthRegion,
    queryAuth,
    queryAllAuth,
    queryAuthByShopId,
    updateAuth,
    updateAuthSub
}
