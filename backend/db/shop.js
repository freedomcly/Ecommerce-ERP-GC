const mongoShop = require('../lib/model.shop.js')

function queryAllShopeeShop () {
    return new Promise((resolve, reject) => {
        mongoShop.find({
            platform: 'shopee'
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = {
    queryAllShopeeShop
}
