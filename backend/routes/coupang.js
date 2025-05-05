const crypto = require('crypto');
const express = require('express');
const request = require('superagent')
const xml2js = require('xml2js')
const mongo = require('../lib/model.auth.lazada.js')

const {partner_id, main_account_id, merchant_id, domain} = require('../configs/shopee.test.js')
const {getSignLazada} = require('../utils/crypto.js')
const {ACCESS_KEY, SECRET_KEY, algorithm} = require('../configs/coupang.js')
const {
    prefix,
    category_tree_get,
    category_attributes_get,
    product_global_create,
    product_create,
    product_item_get,
    product_stock_sellable_adjust,
    product_deactivate,
    images_migrate,
    image_migrate
} = require('../constants/path.lazada.js')
const {updateAuth, queryAuth, updateAuthSub} = require('../db/auth.js')
const {updateProductItemIdInCoupang} = require('../db/product.js')

const router = express.Router();

router.post('/addProductCP', function(req, res, next) {
    console.log('req.body: ', req.body)
    const datetime = new Date().toISOString().substr(2,17).replace(/:/gi, '').replace(/-/gi, '') + "Z";
    const method ='POST';
    const path ='/v2/providers/seller_api/apis/api/v1/marketplace/seller-products';

    const query = '';
    const message = datetime + method + path + query;
    const urlpath = path + '?' + query;
  
    const signature = crypto.createHmac(algorithm, SECRET_KEY).update(message).digest('hex');
    
    const authorization = 'CEA algorithm=HmacSHA256, access-key=' + ACCESS_KEY + ', signed-date=' + datetime + ', signature=' + signature;
    console.log(authorization);  
    request
        .post(`https://api-gateway.coupang.com${path}`)
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', authorization)
        .set('Content-Length', Buffer.byteLength(JSON.stringify(req.body), 'utf8'))
        .set('X-EXTENDED-TIMEOUT', 90000)
        // .query({
        // })
        .send(req.body)
        .then(result => {
            console.log(result)
            const realResult = result.text && JSON.parse(result.text)
            if (realResult && realResult.code === 'SUCCESS') {
                updateProductItemIdInCoupang({
                    id: req.body.items[0].externalVendorSku.split('-')[0],
                    item_id: realResult.data
                })
            }

            res.send({
                code: 0,
                data: result
            })
        })
        .catch(err => {
            console.log(err)
        })
});

router.get('/searchProduct', function(req, res, next) {
  console.log('req.query: ', req.query)
  const datetime = new Date().toISOString().substr(2,17).replace(/:/gi, '').replace(/-/gi, '') + "Z";
  const method ='GET';
  const url = '/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/' + req.query.product_id;

  const query = '';
  const message = datetime + method + url + query;
  const urlpath = url + '?' + query;

  const signature = crypto.createHmac(algorithm, SECRET_KEY).update(message).digest('hex');
  
  const authorization = 'CEA algorithm=HmacSHA256, access-key=' + ACCESS_KEY + ', signed-date=' + datetime + ', signature=' + signature;
  console.log(authorization);  

  request
      .get(`https://api-gateway.coupang.com${url}`)
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', authorization)
      // .query({
      // })
      .query(req.query.payload)
      .then(result => {
          console.log(result)
          res.send({
            code: 0,
            data: result
        })
      })
      .catch(err => {
          console.log(err)
      })
});

router.get('/searchCategory', function(req, res, next) {
  console.log('req.query: ', req.query)
  const datetime = new Date().toISOString().substr(2,17).replace(/:/gi, '').replace(/-/gi, '') + "Z";
  const method ='GET';
  const path2 ='/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/77723';
  const query = '';
  const message = datetime + method + path2 + query;
  const urlpath = path2 + '?' + query;

  const signature = crypto.createHmac(algorithm, SECRET_KEY).update(message).digest('hex');
  
  const authorization = 'CEA algorithm=HmacSHA256, access-key=' + ACCESS_KEY + ', signed-date=' + datetime + ', signature=' + signature;
  console.log(authorization);
  const url = '/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/77723'
  
  request
      .get(`https://api-gateway.coupang.com${url}`)
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', authorization)
      .set('X-EXTENDED-TIMEOUT', 90000)
      // .query({
      // })
      .query(req.query.payload)
      .then(result => {
          console.log(result)
          res.send({
              code: 0,
              data: result
          })
      })
      .catch(err => {
          console.log(err)
      })
});

module.exports = router;
