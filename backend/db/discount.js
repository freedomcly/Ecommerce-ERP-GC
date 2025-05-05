const mongoDiscount = require('../lib/model.shopee.discount.js')

function queryDiscount (para) {
    return new Promise((resolve, reject) => {
        mongoDiscount.find(para).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = {
    queryDiscount
}
