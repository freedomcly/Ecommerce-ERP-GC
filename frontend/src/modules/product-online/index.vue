<template>
  <div class="page-content">
    <el-tabs v-model="platform" type="border-card">
        <el-tab-pane label="shopee" name="shopee">
            <div>
                <el-select v-model="selectedShopeeShop" placeholder="请选择店铺" clearable size="mini">
                    <el-option
                        v-for="item in shopeeShops"
                        :key="shopIdInShopee[item]"
                        :label="item"
                        :value="item"
                        size="mini">
                    </el-option>
                </el-select>
                <el-button @click="handleSyncProductsList('online')" type="primary" :disabled="!selectedShopeeShop" size="mini">同步线上商品</el-button>
                <el-button @click="handleSyncProductsList('all')" type="primary" :disabled="!selectedShopeeShop" size="mini">同步全部商品(包含未上架)</el-button>
                <el-button @click="handleBatchUnlist" :disabled="!selectedShopeeShop" size="mini">批量下架所有符合条件的商品</el-button>
            </div>
            <div style="margin-top: 10px;">
              <el-select v-model="hasStockSelector" placeholder="是否有库存" size="mini" clearable>
                <el-option
                  v-for="item in hasStockMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini">
                </el-option>
              </el-select>
              <el-select v-model="hasDiscountSelector" placeholder="是否已设置折扣" size="mini" clearable>
                <el-option
                  v-for="item in hasDiscountMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini">
                </el-option>
              </el-select>
              <el-select v-model="needCheckSelector" placeholder="是否需要盘点" size="mini" clearable>
                <el-option
                  v-for="(item, key) in needCheckMap"
                  :key="key"
                  :label="item"
                  :value="Number(key)"
                  size="mini">
                </el-option>
              </el-select>
              <el-select v-model="onlineDaysSelector" placeholder="上线天数" size="mini" clearable>
                <el-option
                  v-for="item in onlineDaysMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini">
                </el-option>
              </el-select>
              <!-- <el-select v-model="checkTimeSelector" placeholder="盘点时效" size="mini" clearable>
                <el-option
                  v-for="item in checkStatusMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini">
                </el-option>
              </el-select> -->
              <el-date-picker
                v-model="checkTimeSelector"
                type="datetime"
                placeholder="选择盘点时效"
                size="mini"
                value-format="timestamp">
              </el-date-picker>
              <el-select v-model="supplierSelector" filterable placeholder="请选择供应商" size="mini" clearable>
                <el-option v-for="item in supplierList" :key="item.serial" :label="item.name" :value="item.serial" size="mini"></el-option>
              </el-select>
              <el-select v-model="typeSelector" filterable placeholder="请选择型号" size="mini" clearable>
                <el-option v-for="(item, index) in types" :key="index" :label="item" :value="item" size="mini"></el-option>
              </el-select>
              <el-select v-model="hasModelSkuSelector" placeholder="是否已更新 Model Sku" size="mini" clearable>
                <el-option
                  v-for="item in hasModelSkuMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini">
                </el-option>
              </el-select>
              <el-select v-model="statusSelector" filterable placeholder="请选择商品本地状态" size="mini" clearable>
                <el-option v-for="(item, index) in status" :key="index" :label="item" :value="index" size="mini"></el-option>
              </el-select>
              <el-select v-model="suggestSelector" filterable placeholder="请选择商品建议" size="mini" clearable>
                <el-option v-for="(item, index) in suggestMap" :key="index" :label="item" :value="index" size="mini"></el-option>
              </el-select>
              <el-select v-model="listStatusSelector" filterable placeholder="请选择商品上架状态" size="mini" clearable>
                <el-option v-for="(item, index) in listStatusMap" :key="index" :label="item" :value="item" size="mini"></el-option>
              </el-select>
              <el-select v-model="priceOrientationSelector" placeholder="价格定位" clearable size="mini">
                <el-option v-for="(item, key) in priceOrientationMap" :key="key" :label="item.name" :value="Number(key)"></el-option>
              </el-select>
              <el-select v-model="daysShipSelector" placeholder="出货天数" clearable size="mini">
                <el-option v-for="item in daysShipMap" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
            <div>
              <span>销量</span>
              <el-select v-model="salesCompareSelector" placeholder="比较" size="mini" clearable class="gc-compare">
                <el-option
                  v-for="(item, key) in compareMap"
                  :key="key"
                  :label="item"
                  :value="Number(key)"
                  size="mini">
                </el-option>
              </el-select>
              <el-input-number v-model="salesVolume" @change="changeSalesVolume" :min="0" :max="5000" label="销量不低于" size="mini"></el-input-number>
              <span>评分</span>
              <el-select v-model="rateCompareSelector" placeholder="比较" size="mini" clearable class="gc-compare">
                <el-option
                  v-for="(item, key) in compareMap"
                  :key="key"
                  :label="item"
                  :value="Number(key)"
                  size="mini">
                </el-option>
              </el-select>
              <el-input-number v-model="rateVolume" @change="changeRateVolume" :min="0" :max="5" label="评分" size="mini"></el-input-number>
              <span>浏览量</span>
              <el-input-number v-model="viewsVolume" @change="changeViewsVolume" :min="0" :max="5000000" label="浏览量" size="mini"></el-input-number>
              <span>点赞量</span>
              <el-input-number v-model="likesVolume" @change="changeLikesVolume" :min="0" :max="5000000" label="点赞量" size="mini"></el-input-number>
              <span>全网销量</span>
              <el-input-number v-model="allSalesVolume" @change="changeAllSalesVolume" :min="0" :max="5000000" label="全网销量" size="mini"></el-input-number>
            </div>
<!--             <div>
              <span>最近</span>
              <el-input-number v-model="days" @change="" :min="0" :max="5000000" label="" size="mini"></el-input-number>
              <span>天全网未出单</span>
            </div> -->
            <div style="margin-top: 10px;">
              <el-button @click="selectRule1" size="mini">规则一</el-button>
              <el-button @click="selectRule2" size="mini">规则二</el-button>
              <el-button @click="selectRule3" size="mini">规则三</el-button>
              <el-button @click="selectRule4" size="mini">规则四</el-button>
            </div>
            <div style="margin-top: 10px;">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入数据查询语句"
                v-model="query">
              </el-input>
            </div>
            <div style="margin-top: 10px;">
              <el-button @click="searchShopProducts" type="primary" :disabled="!selectedShopeeShop" size="mini">查询</el-button>
            </div>

            <div class="gc-filter-line">
              <el-button @click="exportProductsImages" size="mini">导出商品图片集</el-button>
              <el-button @click="unlist" size="mini">下架</el-button>
            </div>
            <div>共{{page.totalItem}}条</div>
            <el-pagination background layout="prev, pager, next" :total="page.totalItem" :current-page.sync="currentPage" :page-size="page.pageSize" @current-change="currentChange" small>
            </el-pagination>
            <el-table
                :data="itemList"
                style="width: 100%"
                @sort-change="sortChange"
                @selection-change="select">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <div><el-button @click="viewShopItemDetail(scope.row)" type="text" size="small">查看</el-button></div>
                        <div><el-button @click="unlistOneItem(scope.row)" type="text" size="small">下架</el-button></div>
                        <div><el-button @click="removePromotion(scope.row)" type="text" size="small">解绑折扣</el-button></div>
                        <div><el-button @click="toProductEdit(scope.row)" type="text" size="small">编辑全球商品</el-button></div>
                        <div><el-button @click="completeInventory(scope.row)" type="text" size="small">完成盘点</el-button></div>
                        <div v-if="scope.row.productData && scope.row.productData.inventory.timestamp">
                          <el-tag size="mini" :type="getTagType(scope.row.productData)">盘点日期:{{scope.row.productData && getTimer(new Date(scope.row.productData.inventory.timestamp))}}</el-tag>
                        </div>
                        <div v-else><el-tag size="mini" type="warning">无盘点信息</el-tag></div>
                        <div>
                          <el-tag size="mini">上线天数:{{scope.row.data_base && scope.row.data_base.create_time && getCreatedDays(scope.row.data_base.create_time)}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="主图预览"
                    width="180">
                  <template slot-scope="scope">
                    <img v-lazy="getSGImageUrl(scope.row.data_base.image.image_url_list[0])" class="c-thumbnail">
                  </template>
                </el-table-column>
                <el-table-column
                    prop="item_id"
                    label="商品ID"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="data_base.item_sku"
                    label="全球商品货号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="全球商品规格"
                    width="130">
                    <template slot-scope="scope">
                      {{scope.row.modelList.model[0].model_sku}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    sortable="custom"
                    label="价格"
                    width="130">
                    <template slot-scope="scope">
                      {{adoptPrice(scope.row.modelList)}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="data_extra.views"
                    sortable="custom"
                    label="浏览"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="data_extra.likes"
                    sortable="custom"
                    label="点赞"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="data_extra.sale"
                    sortable="custom"
                    label="销量"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="orders.length"
                    sortable="custom"
                    label="全网销量"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="data_extra.rating_star"
                    sortable="custom"
                    label="评分"
                    width="260">
                    <template slot-scope="scope">
                      <el-rate
                        v-model="scope.row.data_extra.rating_star"
                        disabled
                        show-score
                        allow-half
                        text-color="#ff9900">
                      </el-rate>
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    sortable=""
                    label="颜色"
                    width="180">
                  <template slot-scope="scope">
                    <div v-if="scope.row.modelList && scope.row.modelList.tier_variation && scope.row.modelList.tier_variation.length && scope.row.modelList.tier_variation[0]" v-html="scope.row.modelList.tier_variation[0].option_list.map(item => item.option).join('<br>')"></div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    sortable=""
                    label="型号"
                    width="180">
                  <template slot-scope="scope">
                    <div v-if="scope.row.modelList && scope.row.modelList.tier_variation && scope.row.modelList.tier_variation.length && scope.row.modelList.tier_variation[1]" v-html="scope.row.modelList.tier_variation[1].option_list.map(item => item.option).join('<br>')"></div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    sortable=""
                    label="状态"
                    width="180">
                  <template slot-scope="scope">
                    <div>{{scope.row.item_status}}</div>
                  </template>
                </el-table-column>
            </el-table>
            <div>共{{page.totalItem}}条</div>
            <el-pagination background layout="prev, pager, next" :total="page.totalItem" :current-page.sync="currentPage" :page-size="page.pageSize" @current-change="currentChange" small>
            </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="lazada" name="lazada">
            <!-- <div>
                <el-select v-model="selectedLazadaShop" placeholder="请选择店铺" clearable>
                    <el-option
                        v-for="item in lazadaShops"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="selectedLazadaOrderStatus" placeholder="请选择订单状态" clearable>
                    <el-option
                        v-for="item in orderStatusLazada"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-button @click="searchOrderLazada" type="primary">搜索</el-button>
            </div> -->
        </el-tab-pane>
    </el-tabs>
    <ShopItemDetail
      :show="dialogShopItemDetailVisible"
      :shopItem="shopItem"
      :currentShopeeItemDetail="currentShopeeItemDetail"
      @close="closeDialogShopItemDetail"
    ></ShopItemDetail>
    <Images
      :show="dialogVisibleImages"
      :multiple="selectedItems.map(item => item.data_base.image.image_url_list[0])"
      @close="closeDialogImages"
    ></Images>
  </div>
</template>

<script>
import moment from 'moment'
import ShopItemDetail from '@/components/ShopItemDetail.vue'
import Images from '@/components/Images.vue'
import {
  iPhoneType
} from '@/constants/brandCompatibility.js'
import {
    shopIdInShopee
} from '@/constants/shopee.js'
import {
    checkStatus,
    compareMap,
    priceOrientationMap
} from '@/constants/normal.js'
import {
  suggestMap,
  listStatusMap
} from '@/constants/product.js'
import {
    shopInLazada
} from '@/constants/lazada.js'
import status from '@/constants/status.js'
import {
    syncProductsList,
    unlistItems,
    deleteDiscountItem,
    batchUnlist
} from '@/apis/shopee.js'
import {getSupplier} from '@/apis/supplier.js'
import {
    getShopeeShopProducts,
    updateInventory
} from '@/apis/product.js'
export default {
  name: 'ProductOnline',
  components: {
    ShopItemDetail,
    Images
  },
  data () {
    return {
      priceOrientationMap,
      query: '',
      listStatusMap,
      suggestMap,
      suggestSelector: undefined,
      listStatusSelector: undefined,
      status,
      compareMap,
      iPhoneType,
      platform: 'shopee',
      shopIdInShopee,
      selectedShopeeShop: undefined,
      needCheckSelector: undefined,
      needCheckMap: checkStatus,
      checkTimeSelector: undefined,
      statusSelector: undefined,
      hasModelSkuSelector: undefined,
      priceOrientationSelector: undefined,
      // checkStatusMap: [{
      //   label: '已盘点',
      //   value: 'checked'
      // }, {
      //   label: '未盘点',
      //   value: 'notchecked'
      // }],
      hasStockSelector: 1,
      hasStockMap: [{
        label: '有库存',
        value: 1
      }, {
        label: '无库存',
        value: 0
      }],
      hasDiscountSelector: undefined,
      hasDiscountMap: [{
        label: '有折扣',
        value: 1
      }, {
        label: '无折扣',
        value: 0
      }],
      onlineDaysSelector: undefined,
      onlineDaysMap: [{
        label: '大于7天',
        value: 7
      }, {
        label: '大于14天',
        value: 14
      }, {
        label: '大于30天',
        value: 30
      }, {
        label: '大于60天',
        value: 60
      }, {
        label: '大于90天',
        value: 90
      }, {
        label: '大于120天',
        value: 120
      }, {
        label: '大于180天',
        value: 180
      }],
      hasModelSkuMap: [{
        label: '未更新 model sku',
        value: '0'
      }, {
        label: '已更新 model sku',
        value: '1'
      }],
      salesVolume: undefined,
      viewsVolume: undefined,
      rateVolume: undefined,
      likesVolume: undefined,
      allSalesVolume: undefined,
      salesCompareSelector: 2,
      rateCompareSelector: 2,
      itemList: [],
      page: {},
      currentPage: 1,
      selectedItems: [],
      dialogShopItemDetailVisible: false,
      shopItem: {},
      currentShopeeItemDetail: {},
      supplierSelector: '',
      supplierList: [],
      dialogVisibleImages: false,
      typeSelector: '',
      types: [...iPhoneType, 'Z Flip 4', 'Z Flip 3'],
      days: 0,
      daysShipSelector: undefined,
      daysShipMap: [2, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  computed: {
    shopeeShops () {
        return Object.keys(shopIdInShopee)
    },
    lazadaShops () {
        return shopInLazada
    }
  },
  methods: {
    getSGImageUrl (url) {
      return `https://cf.shopee.sg/file/${url.split('/')[4]}`
    },
    handleSyncProductsList (type) {
      if (!this.selectedShopeeShop) {
        this.$message.error('请选择店铺')
        return
      }
      let itemStatus = ['NORMAL']
      if (type === 'all') {
        itemStatus.push('UNLIST')
      }
      syncProductsList({
        shop_id: shopIdInShopee[this.selectedShopeeShop],
        region: this.selectedShopeeShop,
        item_status: itemStatus
      }).then(data => {
        console.log(data)
      })
    },
    searchShopProducts (page, sort) {
      let params = {
        data: {},
        filter: {}
      }
      if (page) {
        params.page = page
      }
      if (sort) {
        params.sort = sort
      }
      if (this.selectedShopeeShop) {
        params.data.shop_id = shopIdInShopee[this.selectedShopeeShop]
      }
      if (this.checkTimeSelector) {
        params.filter.checkTime = this.checkTimeSelector
      }
      if (this.onlineDaysSelector) {
        params.filter.onlineDays = this.onlineDaysSelector
      }
      if (this.supplierSelector) {
        params.filter.supplierId = this.supplierSelector
      }
      if (this.needCheckSelector) {
        params.filter.needCheck = Number(this.needCheckSelector)
      }
      if (this.statusSelector) {
        params.filter.status = this.statusSelector
      }
      if (this.salesVolume || this.salesVolume === 0) {
        params.filter.salesVolume = this.salesVolume
        params.filter.salesCompareSelector = this.salesCompareSelector
      }
      if (this.allSalesVolume || this.allSalesVolume === 0) {
        params.filter.allSalesVolume = this.allSalesVolume
      }
      if (this.rateVolume || this.rateVolume === 0) {
        params.filter.rateVolume = this.rateVolume
        params.filter.rateCompareSelector = this.rateCompareSelector
      }
      if (this.likesVolume || this.likesVolume === 0) {
        params.filter.likesVolume = this.likesVolume
      }
      if (this.viewsVolume || this.viewsVolume === 0) {
        params.filter.viewsVolume = this.viewsVolume
      }
      if (this.typeSelector) {
        params.filter.typeSelector = this.typeSelector
      }
      if (this.hasModelSkuSelector) {
        params.filter.hasModelSkuSelector = this.hasModelSkuSelector
      }
      if (this.suggestSelector || this.suggestSelector === 0) {
        params.filter.suggest = Number(this.suggestSelector)
      }
      if (this.listStatusSelector) {
        params.filter.item_status = this.listStatusSelector
      }
      if (this.priceOrientationSelector || this.priceOrientationSelector === 0) {
        params.filter.price_orientation = this.priceOrientationSelector
      }
      if (this.daysShipSelector) {
        params.filter.daysShipSelector = this.daysShipSelector
      }
      params.filter.hasDiscount = this.hasDiscountSelector
      params.filter.hasStock = this.hasStockSelector
      if (this.query) {
        params.filter.query = this.query
      }
      this.doSearch(params)
    },
    doSearch (params) {
      this.itemList = []
      getShopeeShopProducts(params).then(data => {
        this.itemList = data.data
        this.page = data.page
        this.currentPage = data.page.current
      })
    },
    currentChange () {
      this.searchShopProducts({current: this.currentPage})
    },
    select (data) {
      this.selectedItems = data
    },
    changeSalesVolume (data) {
      console.log(data)
    },
    changeRateVolume (data) {
      console.log(data)
    },
    changeViewsVolume (data) {
      console.log(data)
    },
    changeLikesVolume (data) {
      console.log(data)
    },
    changeAllSalesVolume (data) {
      console.log(data)
    },
    closeDialogImages () {
      this.dialogVisibleImages = false
    },
    closeDialogShopItemDetail () {
      this.dialogShopItemDetailVisible = false
      this.shopItem = {}
      this.currentShopeeItemDetail = {}
    },
    viewShopItemDetail (data) {
      this.shopItem = {}
      this.currentShopeeItemDetail = {}
      this.shopItem = data.data_base

      this.currentShopeeItemDetail = {
        region: this.selectedShopeeShop,
        shopId: shopIdInShopee[this.selectedShopeeShop]
      }
      this.dialogShopItemDetailVisible = true
    },
    toProductEdit (data) {
      let url = this.$router.resolve({
        name: 'edit',
        query: {id: data.data_base.item_sku.split('-')[0]}
      })
      window.open(url.href, '_blank')
    },
    completeInventory (data) {
      const timestamp = new Date().getTime()
      updateInventory({
        id: Number(data.data_base.item_sku),
        timestamp
      }).then(data => {
        console.log(data)
        this.$message.success(`完成盘点 ${this.getTimer(timestamp)}`)
      })
    },
    getTimer (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD')
    },
    initSupplier () {
      getSupplier().then(data => {
        this.supplierList = data
      })
    },
    getTagType (data) {
      if (!data.inventory.timestamp) return ''
      const now = Date.now()
      const interval = now - data.inventory.timestamp
      const intervalDay = interval / 1000 / 60 / 60 / 24
      // 红色：两周未盘点；橙色：无盘点信息；蓝色：两周内盘点过
      return intervalDay > 14 ? 'danger' : ''
    },
    getCreatedDays (timer) {
      const now = Date.now() / 1000
      return Math.floor((now - timer) / 60 / 60 / 24)
    },
    sortChange (data) {
      let order
      if (data.order === 'descending') {
        order = -1
      } else if (data.order === 'ascending') {
        order = 1
      }
      this.page.current = 1
      this.searchShopProducts({current: 1}, {prop: data.prop, order})
    },
    exportProductsImages () {
      this.dialogVisibleImages = true
    },
    unlist () {
      const selectedItems = this.selectedItems
      const params = selectedItems.map(item => {
        return {
          item_id: item.item_id,
          unlist: true
        }
      })

      unlistItems({
        item_list: params,
        shop_id: shopIdInShopee[this.selectedShopeeShop],
        region: this.selectedShopeeShop
      }).then(data => {
        console.log(data)
      }).catch(error => {
        console.log(error)
      })
    },
    unlistOneItem (data) {
      unlistItems({
        item_list: [{item_id: data.item_id, unlist: true}],
        shop_id: data.shop_id,
        region: data.region
      }).then(data => {
        if (data.failure_list.length) {
          this.$message.error(data.failure_list[0].failed_reason)
        }
        if (data.success_list.length) {
          this.$message.success('下架成功')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    adoptPrice (list) {
      let price = []
      list.model.forEach(item => {
        const modelPrice = item.price_info[0].inflated_price_of_current_price
        if (!price.length) {
          price.push(modelPrice)
        } else if (price.indexOf(modelPrice) < 0) {
          price.push(modelPrice)
        }
      })
      return price.join(',')
    },
    removePromotion (data) {
      this.removeDiscount(data)
    },
    removeDiscount (data) {
      const promotionId = data.modelList.model[0].promotion_id || data.modelList.model[1].promotion_id
      deleteDiscountItem({
        region: data.region,
        shop_id: data.shop_id,
        item_id: data.item_id,
        discount_id: promotionId,
        global_item_sku: data.productData._id
      }).then(data => {
        if (!data.error_list || !data.error_list.length) {
          this.$message.success('解绑成功')
        }
      })
    },
    selectRule1 () {
      this.resetSelector()

      this.hasStockSelector = 1
      this.hasDiscountSelector = 1
      this.onlineDaysSelector = 60
      this.salesVolume = 0
      this.salesCompareSelector = 2
      this.likesVolume = 0
      // this.needCheckSelector = 1
    },
    selectRule2 () {
      this.resetSelector()
      this.hasStockSelector = 1
      this.hasDiscountSelector = 1
      this.onlineDaysSelector = 90
      this.salesVolume = 1 // 小于等于1，且评价低于5星
      this.salesCompareSelector = 5
      this.rateVolume = 5
      this.rateCompareSelector = 3
      // this.needCheckSelector = 1
    },
    selectRule3 () {
      this.resetSelector()
      this.hasStockSelector = 1
      this.hasDiscountSelector = 1
      this.onlineDaysSelector = 120
      this.salesVolume = 3 // 小于等于3
      this.salesCompareSelector = 5
      // this.needCheckSelector = 1
    },
    selectRule4 () {
      this.resetSelector()
      this.onlineDaysSelector = 180
      this.salesVolume = 5 // 小于等于5
      this.salesCompareSelector = 5
      // this.needCheckSelector = 1
    },
    resetSelector () {
      this.needCheckSelector = undefined
      this.checkTimeSelector = undefined
      this.supplierSelector = ''
      this.typeSelector = ''
      this.hasModelSkuSelector = undefined
      this.rateVolume = undefined
      this.viewsVolume = undefined

      this.hasStockSelector = 1
      this.hasDiscountSelector = undefined
      this.onlineDaysSelector = undefined
      this.salesVolume = undefined
      this.likesVolume = undefined

      this.salesCompareSelector = 2
      this.rateCompareSelector = 2
    },
    handleBatchUnlist () {
      batchUnlist({shop_id: shopIdInShopee[this.selectedShopeeShop]}).then(data => {
        console.log(data)
      })
    }
  },
  created () {
    this.initSupplier()
  }
}
</script>

<style scoped>
  .c-thumbnail {
    width: 160px;
    height: auto;
  }
  .gc-filter-line {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .gc-compare {
    width: 80px;
  }
</style>
