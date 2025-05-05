const express = require('express');
const request = require('superagent')
const _ = require('lodash')
const OSS = require('ali-oss')
const config = require('../../configs/aliyun.js')
const {app_secret, app_key} = require('../../configs/tiktok.js')
const mongoAuthTiktok = require('../../lib/model.auth.tiktok.js')
const mongoProduct = require('../../lib/model.product.js')

const {getSignTikTok} = require('../../utils/crypto.js')

const router = express.Router();

function addGlobalProduct(req) {
    return new Promise((resolve, reject) => {
        mongoAuthTiktok.find({}).then(data => {
            const accessToken = data[0].access_token
            const path = '/product/202309/global_products'
            const query = {
                app_key,
                timestamp: Math.round(Date.now()/1000)
            }
            const sign = getSignTikTok(path, query, app_secret, req.body)

            request
              .post(`https://open-api.tiktokglobalshop.com${path}`)
              .set('Content-Type', 'application/json')
              .set('x-tts-access-token', accessToken)
              .query({...query, sign})
              .send({
                ...req.body
              })
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })

        }).catch(err => {
            reject(err)
        })
    })
}

function getGlobalCategories() {
    return new Promise((resolve, reject) => {
        mongoAuthTiktok.find({}).then(data => {
            const accessToken = data[0].access_token
            const path = '/product/202309/global_categories'
            const query = {
                app_key,
                timestamp: Math.round(Date.now()/1000)
            }
            const sign = getSignTikTok(path, query, app_secret)

            request
              .get(`https://open-api.tiktokglobalshop.com${path}`)
              .set('Content-Type', 'application/json')
              .set('x-tts-access-token', accessToken)
              .query({...query, sign})
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })

        }).catch(err => {
            reject(err)
        })
    })
}

function getGlobalProduct(global_product_id) {
    return new Promise((resolve, reject) => {
        mongoAuthTiktok.find({}).then(data => {
            const accessToken = data[0].access_token
            const path = `/product/202309/global_products/${global_product_id}`
            const query = {
                app_key,
                timestamp: Math.round(Date.now()/1000)
            }
            const sign = getSignTikTok(path, query, app_secret)

            request
              .get(`https://open-api.tiktokglobalshop.com${path}`)
              .set('Content-Type', 'application/json')
              .set('x-tts-access-token', accessToken)
              .query({...query, sign})
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })

        }).catch(err => {
            reject(err)
        })
    })
}

function publishProduct(req) {
    return new Promise((resolve, reject) => {
        mongoAuthTiktok.find({}).then(data => {
            const accessToken = data[0].access_token
            const path = `/product/202309/global_products/${req.body.global_product_id}/publish`
            const query = {
                app_key,
                timestamp: Math.round(Date.now()/1000)
            }
            const body = _.omit(req.body, ['global_product_id'])
            const sign = getSignTikTok(path, query, app_secret, body)

            console.log(body, 'body-body')

            request
              .post(`https://open-api.tiktokglobalshop.com${path}`)
              .set('Content-Type', 'application/json')
              .set('x-tts-access-token', accessToken)
              .query({...query, sign})
              .send({
                ...body
              })
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })

        }).catch(err => {
            reject(err)
        })
    })
}

function uploadImage(req, tmpPath) {
    return new Promise((resolve, reject) => {
        mongoAuthTiktok.find({}).then(data => {
            const accessToken = data[0].access_token
            const path = '/product/202309/images/upload'
            const query = {
                app_key,
                timestamp: Math.round(Date.now()/1000)
            }
            const sign = getSignTikTok(path, query, app_secret)

            request
              .post(`https://open-api.tiktokglobalshop.com${path}`)
              .set('Content-Type', 'multipart/form-data')
              .set('x-tts-access-token', accessToken)
              .query({...query, sign})
                .accept('application/json')
                .attach('data', tmpPath)
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })

        }).catch(err => {
            reject(err)
        })
    })
}

router.get('/searchCategoryTiktok', function(req, res, next) {

  getGlobalCategories().then(data => {
    console.log(data)

    res.send({
        code: 0,
        data: JSON.parse(data.text).data
    })  
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});

router.get('/getGlobalProduct', function(req, res, next) {

  getGlobalProduct(req.query.global_product_id).then(data => {
    console.log(data)

    res.send({
        code: 0,
        data: JSON.parse(data.text).data
    })  
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});


router.post('/createProduct', function(req, res, next) {
  addGlobalProduct(req).then(data => {
    console.log(data)
    const result = JSON.parse(data.text)
    if (result.code) {
      res.send({
          code: result.code,
          data: result.message
      })
    } else {
      mongoProduct.updateOne({
        _id: Number(req.body._id),
      }, {
        $set: {
          global_item_id_in_tiktok: JSON.parse(data.text).data.global_product_id
        }
      }).then(mdData => {
        console.log('添加Tiktok全球商品ID成功')
        res.send({
            code: 0,
            data: result.data
        })
      }).catch(err => {
        console.log(err)
        console.log('添加Tiktok全球商品ID失败')
        res.send({ code: 1, data: err })
      })
    }
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});

router.post('/publishProduct', function(req, res, next) {
  publishProduct(req).then(data => {
    console.log(data)
    // mongoProduct.updateOne({
    //   _id: Number(req.body._id),
    // }, {
    //   $set: {
    //     global_item_id_in_tiktok: JSON.parse(data.text).data.global_product_id
    //   }
    // }).then(mdData => {
    //   console.log('添加Tiktok全球商品ID成功')
      res.send({
          code: 0,
          data: JSON.parse(data.text).data
      })
    // }).catch(err => {
    //   console.log(err)
    //   console.log('添加Tiktok全球商品ID失败')
      // res.send({ code: 1, data: err })
    // })
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});


router.post('/uploadImageTikTok', async function(req, res, next) {
  const supplierId = req.body.supplierId
  const productId = req.body.productId
  const waterPrint = req.body.water
  const name = req.body.name
  const tmpPath = `./tmp/${name}`
    const client = new OSS(config)
  await client.get(`${supplierId}/${productId}/${name}`, tmpPath, { process: `style/${waterPrint}` })

  uploadImage(req, tmpPath).then(data => {
    res.send({
        code: 0,
        data: JSON.parse(data.text).data
    })
  }).catch(err => {
    res.send({
        code: 1,
        data: err
    })
  })
});

module.exports = router;
