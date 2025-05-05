<template>
  <div class="page-content">
    <el-tabs v-model="platform" type="border-card">
        <el-tab-pane label="shopee" name="shopee">
          <el-card>
            <div slot="header">
              <span>Shopee</span>
            </div>
            <el-row>
              <div class="gc-block">
                <el-button @click="auth">授权跳转</el-button>
                <el-button @click="testGetToken">测试getToken接口</el-button>
                <el-button @click="testGetAuthList">测试getAuthList接口</el-button>
                <!-- <el-button @click="testInsertAuthRegion">测试insertAuthRegion接口</el-button> -->
              </div>
              <el-divider></el-divider>
              <div class="gc-block">
                <el-row>
                  <el-button class="gc-button-item" type="primary" plain @click="refreshTokenAll">refreshToken all</el-button>
                </el-row>
                <el-row>
                  <el-button class="gc-button-item" @click="testRefreshTokenMerchant">refreshToken merchant</el-button>
                </el-row>
                <el-row>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('MY')">refreshToken MY</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('SG')">refreshToken SG</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('TH')">refreshToken TH</el-button>
                </el-row>
                <el-row>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('TW')">refreshToken TW</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('VN')">refreshToken VN</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('PH')">refreshToken PH</el-button>
                </el-row>
                <el-row>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('BR')">refreshToken BR</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('MX')">refreshToken MX</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('CO')">refreshToken CO</el-button>
                </el-row>
                <el-row>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('PL')">refreshToken PL</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('CL')">refreshToken CL</el-button>
                </el-row>
                <el-row>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('SG_1')">refreshToken SG_1</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('PH_1')">refreshToken PH_1</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('BR_2')">refreshToken BR_2</el-button>
                  <el-button class="gc-button-item" @click="testRefreshTokenShop('MX_2')">refreshToken MX_2</el-button>
                </el-row>
              </div>
              <el-divider></el-divider>
              <div class="gc-block gc-block-bottom">
                <el-button @click="testShopee">测试shopee接口1</el-button>
                <el-button @click="testShopeeGetAttributes">测试shopee接口2</el-button>
                <el-button @click="testShopeeGetShopCategoryList">测试shopee接口3</el-button>
                <el-button @click="testShopeeGetChannelList">测试shopee接口物流</el-button>
              </div>
            </el-row>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="lazada" name="lazada">
          <el-card>
            <div slot="header">
              <span>Lazada</span>
            </div>
            <el-row>
              <el-button @click="authLazada">lazada授权跳转</el-button>
              <el-button @click="createTokenLazada">get token</el-button>
              <el-button @click="refreshTokenLazada">refresh token</el-button>
              <el-button @click="getCurrentToken">查询当前token</el-button>
            </el-row>
            <el-divider></el-divider>
            <el-row>
              <el-row>
                <el-button class="gc-button-item" @click="testCategoryTreeGet('SG')">测试 get category SG</el-button>
                <el-button class="gc-button-item" @click="testCategoryTreeGet('MY')">测试 get category MY</el-button>
                <el-button class="gc-button-item" @click="testCategoryTreeGet('TH')">测试 get category TH</el-button>
              </el-row>
              <el-row>
                <el-button class="gc-button-item" @click="testCategoryTreeGet('VN')">测试 get category VN</el-button>
                <el-button class="gc-button-item" @click="testCategoryTreeGet('PH')">测试 get category PH</el-button>
                <el-button class="gc-button-item" @click="testCategoryTreeGet('ID')">测试 get category ID</el-button>
              </el-row>
            </el-row>
            <el-divider></el-divider>
            <el-row>
              <el-button @click="testCategoryAttributesGet('SG', 42020602)">测试 get category attribute - SG</el-button>
              <el-button @click="testCategoryAttributesGet('TH', 6888)">测试 get category attribute - TH</el-button>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="tiktok" name="tiktok">
          <el-card>
            <div slot="header">
              <span>TikTok</span>
            </div>
            <el-row>
              <el-button @click="authTiktok">tiktok授权跳转</el-button>
              <el-button @click="getTokenTiktok">get token</el-button>
            </el-row>
            <el-divider></el-divider>
            <el-row>
              <el-row>
                <el-button @click="getCategoryTiktok">tiktok类目ID测试</el-button>
                <el-button @click="getAuthorizedShops">tiktok已授权店铺测试</el-button>
              </el-row>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-button @click="testCategoryAttributesGet">测试 get category attribute</el-button>
            </el-row>
          </el-card>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getAuthUrl, getToken, getAccessToken, getAuthList, insertAuthRegion} from '@/apis/auth.js'
import {createToken, refreshToken, getCurrentTokenData} from '@/apis/authLazada.js'
import {
  categoryTreeGet,
  categoryAttributesGet
} from '@/apis/productLazada.js'
import {
  getAccessTokenTiktok,
  getAuthorizedShops
} from '@/apis/tiktok/auth.js'
import {
  searchCategoryTiktok
} from '@/apis/tiktok/product'

import {getCategory, getAttributes, getShopCategoryList, getChannelList} from '@/apis/shopee.js'
import {getParam} from '@/utils/index'
import {shopIdInShopee} from '@/constants/shopee.js'

export default {
  name: 'Index',
  data () {
    return {
      platform: 'shopee'
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  methods: {
    auth () {
      getAuthUrl({
        origin: location.origin
      }).then(data => {
        const url = data.data.url
        if (url) {
          window.open(url)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    authLazada () {
      window.open('https://auth.lazada.com/oauth/authorize?client_id=&redirect_uri=&response_type=code')
    },
    testGetToken () {
      const code = getParam('code')
      if (code) {
        getToken({code}).then(data => {
          console.log(data)
        })
      }
    },
    refreshTokenAll () {
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
    },
    testShopee () {
      getCategory().then(data => {
        console.log(data)
      })
    },
    testShopeeGetAttributes () {
      getAttributes({
        category_id: 100490
      }).then(data => {
        console.log(data.data.attribute_list.filter(item => {
          return item.is_mandatory
        }))
      })
    },
    testShopeeGetChannelList () {
      getChannelList({shop_id: '', region: 'MY'}).then(data => {
        console.log(data)
      })
    },
    createTokenLazada () {
      const codeLazada = getParam('code')
      createToken({code: codeLazada}).then(data => {
        if (data.code !== 0) {
          this.$message.error('授权错误')
          return
        }
        if (data.data.result.type === 'ISV') {
          this.$message.error(data.data.result.message)
        } else if (data.data.result.code === '0' && data.data.result.access_token) {
          this.$message.success('授权成功')
        }
      })
    },
    refreshTokenLazada () {
      refreshToken().then(data => {
        console.log(data)
      })
    },
    getCurrentToken () {
      getCurrentTokenData().then(data => {
        console.log(data)
      })
    },
    testCategoryTreeGet (country) {
      categoryTreeGet({country}).then(data => {
        console.log(data)
      })
    },
    testCategoryAttributesGet (country, categoryId) {
      categoryAttributesGet({
        country,
        primary_category_id: categoryId
      }).then(data => {
        console.log(data)
      })
    },
    testShopeeGetShopCategoryList () {
      getShopCategoryList({
        shop_id: 567953615,
        region: 'SG'
      }).then(data => {
        console.log(data)
      })
    },
    testGetAuthList () {
      getAuthList().then(data => {
        console.log(data)
      })
    },
    testInsertAuthRegion () {
      insertAuthRegion({
        region: 'VN_3',
        shop_id: '924877381'
      }).then(data => {
        console.log(data)
      })
    },
    authTiktok () {
      window.open('https://services.tiktokshop.com/open/authorize?service_id=')
    },
    getTokenTiktok () {
      const codeTiktok = getParam('code')
      const appKeyTiktok = getParam('app_key')
      getAccessTokenTiktok({
        app_key: appKeyTiktok,
        code: codeTiktok
      }).then(data => {
        console.log(data)
      })
    },
    getCategoryTiktok () {
      searchCategoryTiktok().then(data => {
        console.log(data)
      })
    },
    getAuthorizedShops () {
      getAuthorizedShops()
    }
  }
}
</script>

<style scoped>
.gc-block {
  overflow: hidden;
}

.gc-block-top {
  margin-bottom: 20px;
}

.gc-block-top {
  margin-top: 20px;
}

.gc-button-item {
  margin-bottom: 20px;
}

</style>
