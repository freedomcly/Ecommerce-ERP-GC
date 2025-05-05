var mongoose = require('mongoose')
let config = require('../configs/mongodb')

mongoose.connect(`mongodb://${config.user}:${config.password}@${config.ip}:${config.port}/products?authSource=${config.user}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(error) {
    if(error) {
        console.log(error)
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
    }
})

module.exports = mongoose;