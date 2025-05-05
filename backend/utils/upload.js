const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
var OSS = require('ali-oss')
const images = require('images')
const config = require('../configs/aliyun')
const client = new OSS(config)

async function uploadImage (product, file) {
    const hmac = crypto.createHmac('sha256', '123')
    const sign = hmac.update(file.originalname.replace(/\s*/g, '')).digest('hex')
    const targetUrl = product.supplierId + '/' + product.productId + '/' + sign

    if (file.size > 1000000) {
        const nameWords = file.originalname.split('.')
        const filePath = path.resolve(__dirname + '/../' + file.path)
        const target = `${filePath}.${nameWords[nameWords.length - 1]}`

        fs.renameSync(filePath, target)
        images(target).save(target, {quality: 80})

        const result = await client.put(targetUrl, `${file.path}.${nameWords[nameWords.length - 1]}`, {
            timeout: 30000000
        })

        return result
    } else {
        console.log('正在上传, without compress')

        const result = await client.put(targetUrl, file.path, {
            timeout: 30000000
        })

        return result
    }
}

module.exports = {
    uploadImage
}
