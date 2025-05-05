const mongoOrder = require('../lib/model.order.js')

function queryOrder (param) {
    return new Promise((resolve, reject) => {
        mongoOrder.find(param).then(data => {
            resolve(data)
        }).catch(err => {
            console.log('queryOrder err', err)
            reject(err)
        })
    })
}

module.exports = {
    queryOrder
}
