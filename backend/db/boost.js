const mongoBoost = require('../lib/model.boost.shopee.js')

function queryBoostList (param) {
    return new Promise((resolve, reject) => {
      mongoBoost.find(param).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = {
  queryBoostList
}
