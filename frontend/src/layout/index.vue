<template>
  <div class="app-wrapper">
    <div class="gc-header">
      <div @click="toHome" class="gc-title">
        <span>GC运营平台</span>
        <span>
           <el-tag v-if="authStatus === 4" size="mini" type="success">Shopee 已授权</el-tag>
           <el-tag v-else-if="authStatus === 3" size="mini" type="warning">授权即将过期</el-tag>
           <el-tag v-else size="mini" type="danger" @click="reAuth">点击重新授权</el-tag>
        </span>
        <span>
           <el-tag v-if="authLazadaStatus === 4" size="mini" type="success">Lazada 已授权</el-tag>
           <el-tag v-else-if="authLazadaStatus === 3" size="mini" type="warning">授权即将过期</el-tag>
           <!-- <el-tag v-else size="mini" type="danger" @click="reAuth">点击重新授权</el-tag> -->
        </span>
      </div>
      <div class="gc-user">
        <span class="gc-rate">
          <el-tooltip class="item" effect="dark" placement="bottom-start">
            <div slot="content">
              <div v-for="(item, key) in region" :key="key">{{item}}: {{exchange[item]}}</div>
            </div>
            <el-button type="text">今日汇率</el-button>
          </el-tooltip>
        </span>
        <span>{{username}}</span>
        <span @click="logout" class="gc-logout">退出登录</span>
      </div>
    </div>
    <sidebar :username="username" :role="role" class="sidebar-container" />
    <router-view :username="username" :role="role" :exchangeRate="exchange" />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import {region} from '@/constants/normal.js'
import {shopIdInShopee} from '@/constants/shopee.js'
import {info} from '@/apis/user.js'
import {getExchangeRate} from '@/apis/exchange.js'
import {getAuthList, getAccessToken} from '@/apis/auth.js'
import {getCurrentTokenData} from '@/apis/authLazada.js'

export default {
  name: 'Layout',
  components: {
    Sidebar
  },
  computed: {
  },
  data () {
    return {
      region,
      username: '',
      role: 0,
      exchange: {},
      authStatus: undefined,
      authLazadaStatus: undefined
    }
  },
  created () {
    this.getUserInfo()

    getExchangeRate().then(data => {
      this.exchange = {
        SG: data.rates.SGD,
        MY: data.rates.MYR,
        TH: data.rates.THB,
        VN: data.rates.VND,
        PH: data.rates.PHP,
        TW: data.rates.TWD,
        BR: data.rates.BRL,
        MX: data.rates.MXN,
        CO: data.rates.COP,
        CL: data.rates.CLP,
        PL: data.rates.PLN,
        US: data.rates.USD
      }
    })

    getAuthList().then(data => {
      const timestamp = data.data[0].updated
      const margin = (Date.now() - timestamp) / 1000
      let status
      if (margin > 14400) {
        status = 2 // 请重新授权
        this.reAuth()
      } else if (margin > (14400 - 60 * 5)) {
        status = 3 // 授权即将过期
        this.reAuth()
      } else {
        status = 4 // 授权成功
      }
      this.authStatus = status
    })

    getCurrentTokenData().then(data => {
      const tokenData = data.data[0]
      console.log(Date.now() - tokenData.updated)
      const margin = (Date.now() - tokenData.updated) / 1000
      console.log(margin)
      const sevenDays = 60 * 60 * 24 * 7
      let status
      if (margin > sevenDays) {
        status = 2
      } else if (margin > sevenDays - 60 * 5) {
        status = 3
      } else {
        status = 4
      }
      this.authLazadaStatus = status
    })
  },
  methods: {
    getUserInfo () {
      const token = localStorage.getItem('token')

      if (!token) {
        this.$router.push({ name: 'login' })
        return
      }

      info({token}).then(data => {
        if (data.message === 'error') {
          this.$router.push({ name: 'login' })
          return
        }
        this.username = data.username
        this.role = data.role
      })
    },
    logout () {
      localStorage.removeItem('token')
      this.$router.push({ name: 'login' })
    },
    toHome () {
      this.$router.push({ name: 'index' })
    },
    reAuth () {
      this.testRefreshTokenMerchant()
      Object.keys(shopIdInShopee).forEach(item => {
        this.testRefreshTokenShop(item)
      })
    },
    testRefreshTokenMerchant () {
      getAccessToken({
        region: 'merchant'
      }).then(data => {
        // const result = JSON.parse(data.data.data.text)
        console.log(data)
      })
    },
    testRefreshTokenShop (region) {
      getAccessToken({
        shop_id: shopIdInShopee[region],
        region
      }).then(data => {
        // const result = JSON.parse(data.data.data.text)
        console.log(data)
      })
    }
  }
}
</script>

<style scoped>
.app-wrapper {
    height: 100%;
}

.gc-header {
  height: 50px;
  line-height: 50px;
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  justify-content: space-between;
}

.gc-title {
  font-size: 18px;
  margin-left: 20px;
  cursor: pointer;
}

.gc-user {
  font-size: 14px;
  margin-right: 20px;
}

.gc-logout {
  cursor: pointer;
  margin-left: 10px;
}

.gc-rate {
  margin-right: 10px;
}
</style>
