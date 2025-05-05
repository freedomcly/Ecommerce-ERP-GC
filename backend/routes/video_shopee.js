const fs = require('fs')
const http = require('http')
const https = require('https')
const FormData = require('form-data');
const querystring = require('querystring')
const express = require('express');
const request = require('superagent')
const schedule = require('node-schedule')
const moment = require('moment')
const md5File = require('md5-file')

const mongo = require('../lib/model.boost.shopee.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {getSign, getSignLazada} = require('../utils/crypto.js')
const {
    media_space_init_video_upload,
    media_space_upload_video_part,
    media_space_complete_video_upload,
    media_space_get_video_upload_result
} = require('../constants/path.shopee.js')
const {updateAuth, queryAuth, updateAuthSub} = require('../db/auth.js')
const {shopIdInShopee} = require('../constants/shopee.js')
const {requestGetAccessToken} = require('../utils/auth.js')

function initVideoUpload (region, filePath, size) {
    return new Promise((resolve, reject) => {
        queryAuth({region}).then(data => {
            const path = media_space_init_video_upload
            const accessToken = data[0].access_token
            const shopId = shopIdInShopee[region]
            const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)

            request
                .post(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    sign,
                    shop_id: shopId,
                    access_token: accessToken
                })
                .send({
                    file_md5: md5File.sync(filePath),
                    file_size: size
                })
                .then(result => {
                    console.log(region, JSON.parse(result.text))
                    if (JSON.parse(result.text).response) {
                        resolve(JSON.parse(result.text).response.video_upload_id)

                    } else {
                        resolve(JSON.parse(result.text).response)
                    }
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    })

}

function uploadVideoPart (filePath, video_upload_id, part_seq) {
    return new Promise((resolve, reject) => {
        const path = media_space_upload_video_part
        const {sign, timestamp} = getSign(path)
        const readStream = fs.createReadStream(filePath.slice('2'))


        md5File(filePath).then((hash) => {
            const form = new FormData();
            form.append('partner_id', partner_id);
            form.append('timestamp', timestamp);
            form.append('sign', sign);
            form.append('video_upload_id', video_upload_id);
            form.append('part_seq', part_seq);
            form.append('content_md5', hash);
            form.append('part_content', readStream, filePath.split('/').pop());
    
            const req = https.request({
                host: domain.split('//').pop(),
                path: '/api/v2/media_space/upload_video_part',
                method: 'POST',
                headers: form.getHeaders()
            }, res => {
                let body = [];
                res.setEncoding('utf8');
        
                res.on("data", chunk => {
                    body.push(chunk);
                })
                res.on("end", result => {
                    // console.log(Object.keys(res))
                    console.log(body, Object.prototype.toString.call(body))
                    const body0 = body[0]
                    const data = JSON.parse(body0)
    
                    if (!data.error) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                    // console.log(res.statusMessage)
                    // console.log(Object.keys(res.req))
                    // console.log(res.req.path)
                    // if (result && result.text) {
                    //     resolve(JSON.parse(result.text))
                    // } else {
                    //     resolve(result)
                    // }
                })
                res.on('error', error => {
                    console.log(error)
                })
            })
            form.pipe(req)

        })


        // req.write(postData)
        // req.write(
        //     `--${video_upload_id}rn Content-Disposition: form-data; name="part_content"; filename="${filePath}"`
        //     // `name="part_content"; filename="${filePath}"`
        // )

        // req.end()
        // request
        //     .post(`${domain}${path}`)
        //     // .set('Content-Type', '')
        //     // .set('Content-Length', size)
        //     // .set('Content-Disposition', 'attachment; filename="')
        //     .accept('application/json')
        //     .query({
        //         partner_id,
        //         timestamp,
        //         sign
        //     })
        //     // .accept('multipart/form-data')
        //     .field('video_upload_id', video_upload_id)
        //     .field('part_seq', part_seq)
        //     .field('content_md5', md5File.sync(filePath))
        //     .attach('part_content', filePath)

        //     .then(result => {
        //         console.log(result)
        //         resolve(JSON.parse(result.text))
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         reject(err)
        //     })
    })

}

function completeVideoUpload (upload_cost, video_upload_id, sum) {
    let seqArr = []
    for (let i = 0; i < sum; i++) {
        seqArr.push(i)
    }
    return new Promise((resolve, reject) => {
        const path = media_space_complete_video_upload
        const {sign, timestamp} = getSign(path)

        request
            .post(`${domain}${path}`)
            .set('Content-Type', 'application/json')
            .query({
                partner_id,
                timestamp,
                sign
            })
            .send({
                video_upload_id,
                part_seq_list: seqArr,
                report_data: {
                    upload_cost
                }
            })
            .then(result => {
                resolve(JSON.parse(result.text))
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })

}

function getVideoUploadResult (region, video_upload_id) {
    return new Promise((resolve, reject) => {
        queryAuth({region}).then(data => {
            const path = media_space_get_video_upload_result
            const accessToken = data[0].access_token
            const shopId = shopIdInShopee[region]
            const {sign, timestamp} = getSign(path, accessToken, undefined, shopId)
    
            request
                .get(`${domain}${path}`)
                .set('Content-Type', 'application/json')
                .query({
                    partner_id,
                    timestamp,
                    sign,
                    shop_id: shopId,
                    access_token: accessToken,
                    video_upload_id
                })
                .then(result => {
                    console.log(region, JSON.parse(result.text))
                    resolve(JSON.parse(result.text))
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    })

}

module.exports = {
    initVideoUpload,
    uploadVideoPart,
    completeVideoUpload,
    getVideoUploadResult
}