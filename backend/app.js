
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const multer = require('multer')
const compression = require('compression')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product')
const supplierRouter = require('./routes/supplier')
const productLazadaRouter = require('./routes/product_lazada')

const descriptionRouter = require('./routes/description')
const tagRouter = require('./routes/tag')
const typeRouter = require('./routes/type')

const authRouter = require('./routes/auth')
const authLazadaRouter = require('./routes/auth_lazada')
const shopeeRouter = require('./routes/shopee')
const boostShopeeRouter = require('./routes/boost_shopee')
const orderRouter = require('./routes/order')
const orderLazadaRouter = require('./routes/order_lazada')
const activityRouter = require('./routes/activity')
const shopRouter = require('./routes/shop')
const taskRouter = require('./routes/task')
const purchaseNoteRouter = require('./routes/purchase_note')
const coupangRouter = require('./routes/coupang')
const dataRouter = require('./routes/data')
const tiktokAuthRouter = require('./routes/tiktok/auth')
const tiktokProductRouter = require('./routes/tiktok/product')

const {autoPublish, autoSyncUnlist, autoBoost} = require('./handlers/shopee')
const {autoAuth} = require('./utils/auth')
const {autoAuthLazada} = require('./utils/auth_lazada')

const app = express();

app.use(cors())
app.use(compression())
app.use(multer({dest: './tmp/'}).any())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/supplier', supplierRouter);

app.use('/api/description', descriptionRouter);
app.use('/api/tag', tagRouter);
app.use('/api/type', typeRouter);

app.use('/api/auth', authRouter);
app.use('/api/shopee', shopeeRouter);

app.use('/api/auth_lazada', authLazadaRouter);
app.use('/api/product_lazada', productLazadaRouter);
app.use('/api/boost_shopee', boostShopeeRouter)
app.use('/api/order', orderRouter)
app.use('/api/order_lazada', orderLazadaRouter)
app.use('/api/activity', activityRouter)
app.use('/api/shop', shopRouter)
app.use('/api/task', taskRouter)
app.use('/api/purchase', purchaseNoteRouter)
app.use('/api/coupang', coupangRouter);
app.use('/api/data', dataRouter);
app.use('/api/tiktok/auth', tiktokAuthRouter);
app.use('/api/tiktok/product', tiktokProductRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const crypto = require('crypto');
const request = require('superagent')

const datetime = new Date().toISOString().substr(2,17).replace(/:/gi, '').replace(/-/gi, '') + "Z";
const method ='GET';
const path2 ='/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/77723';
const query = '';

const message = datetime + method + path2 + query;
const urlpath = path2 + '?' + query;

const {ACCESS_KEY} = require('./configs/coupang');
//input your secretKey
const {SECRET_KEY} = require('./configs/coupang');
const algorithm = 'sha256';

const signature = crypto.createHmac(algorithm, SECRET_KEY).update(message).digest('hex');

const authorization = 'CEA algorithm=HmacSHA256, access-key=' + ACCESS_KEY + ', signed-date=' + datetime + ', signature=' + signature;

request
.get(`https://api-gateway.coupang.com${urlpath}`)
.set('Content-Type', 'application/json;charset=utf-8')
.set('Authorization', authorization)
// .set('Content-Length', Buffer.byteLength(req.body, 'utf8'))
.set('X-EXTENDED-TIMEOUT', 90000)
.query({
})
// .send(req.body)
.then(result => {
    console.log(result)
    // res.send({
    //     code: 0,
    //     data: {
    //         text: 'test'
    //     }
    // })
})
.catch(err => {
    console.log(err)
})

autoAuth()
autoAuthLazada()
autoPublish()
autoSyncUnlist()
autoBoost()

module.exports = app;
