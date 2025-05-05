
const crypto = require('crypto')
const hmacSHA256 = require('crypto-js/hmac-sha256')

const partner_key = require('../configs/shopee.test').partner_key
const {partner_id} = require('../configs/shopee.test')
// lazada
const {app_key, app_secret, sign_method} = require('../configs/lazada')

function getSign(path, accessToken, merchantId, shopId) {
    const hmac = crypto.createHmac('sha256', partner_key)
    const timestamp = Math.floor(new Date().getTime() / 1000)
    let baseString = `${partner_id}${path}${timestamp}`

    if (accessToken) baseString += accessToken
    if (merchantId) baseString += merchantId
    if (shopId) baseString += shopId

    const sign = hmac.update(baseString).digest('hex')
    return {
        sign,
        timestamp
    }
}

function getSignLazada(path, params) {
    const timestamp = new Date().getTime()
    let baseString = path
    let paramsLazada = params
    paramsLazada.timestamp = timestamp
    paramsLazada.app_key = app_key
    paramsLazada.sign_method = sign_method

    const keys = Object.keys(paramsLazada).sort()
    keys.forEach(item => {
        baseString += `${item}${paramsLazada[item]}`
    })

    const digest = hmacSHA256(baseString, app_secret)

    const sign = digest.toString().toUpperCase()

    return {
        sign,
        timestamp,
        app_key,
        sign_method
    }
}

function getMd5(stream) {
    const hash = crypto.createHash('md5')
    return new Promise(resolve => {
        stream.on('data', chunk => {
            hash.update(chunk, 'utf8')
        })

        stream.on('end')
    })
}

function getSignTikTok(path, params, app_secret, body) {
    let signString = ''
    let baseString = ''

    const keys = Object.keys(params).sort()
    keys.forEach(item => {
        baseString += `${item}${params[item]}`
    })

    signString = `${path}${baseString}`

    if (body) {
        signString = `${path}${baseString}${JSON.stringify(body)}`
    }
    signString = `${app_secret}${signString}${app_secret}`; 

    const hmac = crypto.createHmac("sha256", app_secret);  
    hmac.update(signString);  
    const sign = hmac.digest("hex");  

    return sign;
}

module.exports = {
    getSign,
    getSignLazada,
    getSignTikTok
}