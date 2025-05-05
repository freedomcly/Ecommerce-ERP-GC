var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const user = new schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true,
      set (val) {
        return require('bcrypt').hashSync(val, 10)
      }
    },
    role: {type: Number}
})

module.exports = user
