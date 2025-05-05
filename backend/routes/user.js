var express = require('express');
var router = express.Router();
var mongo = require('../lib/model.user.js')
const jwt = require('jsonwebtoken')
const secret = 'secret'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res) => {
  mongo.insertMany({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  }).then(data => {
    console.log(data)
    res.send('register ok')
  }).catch(error => {
    console.log(error)
  })
})

router.post('/login', async (req, res) => {
  // 用户是否存在
  const users = await mongo.find({
    username: req.body.username
  })
  if (!users.length) {
    res.send({
      message: '用户名不存在'
    })
  }
  const user = users[0]

  // 密码对不对
  const isPasswordValid = require('bcrypt').compareSync(
    req.body.password,
    user.password
  )

  if (!isPasswordValid) {
    res.send({
      message: '密码错误'
    })
  }

  // 生成token
  const token = jwt.sign({
    id: String(user._id),
  }, secret)

  res.send({
    user,
    token
  })
})

router.post('/logout', (req, res) => {
  res.send('logout ok')
})

const auth = async (req, res, next) => {
  // const raw = String(req.headers.authorization).split(' ').pop()
  const raw = req.query.token
  const {id} = jwt.verify(raw, secret)
  req.user = await mongo.findById(id)
  next()
}

router.get('/info', auth, (req, res) => {
  if (!req || !req.user || !req.user.username) {
    res.send({
      message: 'error'
    })
  } else {
    res.send({
      message: 'ok',
      username: req.user.username,
      role: req.user.role
    })
  }
})

router.get('/list', async (req, res) => {
  const users = await mongo.find()
  if (!users.length) {
    res.send({
      message: '用户名不存在'
    })
  }

  res.send({
    message: 'ok',
    data: users
  })
})

router.post('/remove', function(req, res, next) {
    mongo.remove({
        _id: req.body._id
    }).then(data => {
        console.log(data)
        console.log('删除成功')
        res.send({code: 0})
    }).catch(err => {
        console.log(err)
        console.log('删除失败')
        res.send({code: 1})
    })
})

module.exports = router;
