const mongo = require('../lib/model.product.js')

function bulk () {
    mongo.find({})
    .then(data => {
        // console.log(data)
        data.forEach(item => {
            console.log(item._id)
            
            mongo.updateOne({_id: Number(item._id)}, {
                $set: {
                    product_id: String(item._id).slice(-3)
                }
            }).then(data => {
                console.log('添加 product_id 成功')
            }).catch(err => {
            })
        })
    })
}

module.exports = {
    bulk
}
