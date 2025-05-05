<template>
  <div>
    <div>
      <el-button @click="openShop" type="text">店铺首页</el-button>
    </div>
    <el-descriptions title="" :column="1" border>
      <el-descriptions-item label="关注礼">
        <div v-if="statusFollowPrize"><i class="el-icon-success gc-success"></i>设置成功</div>
        <div v-else><i class="el-icon-error gc-error"></i>未设置或已领完</div>
      </el-descriptions-item>
      <el-descriptions-item label="优惠券">
        <div v-if="statusVoucher && (statusVoucher.low.status || statusVoucher.middle.status || statusVoucher.high.status)">
          <div v-if="statusVoucher.low.status">
            <i class="el-icon-success gc-success"></i>
            <span>低门槛优惠券设置成功</span>
            <span v-if="statusVoucher.low.remaining < 20" class="gc-warning">剩余{{ statusVoucher.low.remaining }}</span>
          </div>
          <div v-else>
            <i class="el-icon-error gc-error"></i>
            <span>低门槛优惠券未设置</span>
          </div>
          <div v-if="statusVoucher.middle.status">
            <i class="el-icon-success gc-success"></i>
            <span>中门槛优惠券设置成功</span>
            <span v-if="statusVoucher.middle.remaining < 20" class="gc-warning">剩余{{ statusVoucher.middle.remaining }}</span>
          </div>
          <div v-else>
            <i class="el-icon-error gc-error"></i>
            <span>中门槛优惠券未设置</span>
          </div>
          <div v-if="statusVoucher.high.status">
            <i class="el-icon-success gc-success"></i>
            <span>高门槛优惠券设置成功</span>
            <span v-if="statusVoucher.high.remaining < 20" class="gc-warning">剩余{{ statusVoucher.high.remaining }}</span>
          </div>
          <div v-else>
            <i class="el-icon-error gc-error"></i>
            <span>高门槛优惠券未设置</span>
          </div>
        </div>
        <div v-else><i class="el-icon-error gc-error"></i>常规优惠券未设置</div>
      </el-descriptions-item>
      <el-descriptions-item label="折扣">
        <div v-if="statusDiscountDefault"><i class="el-icon-success gc-success"></i>默认基础折扣设置成功</div>
        <div v-else><i class="el-icon-error gc-error"></i>默认基础折扣未设置成功</div>
        <!-- <div><i class="el-icon-success gc-success"></i>所有商品已设置折扣</div> -->
        <div v-if="remainDiscountAmount > 30"><i class="el-icon-success gc-success"></i>剩余折扣位置 {{ remainDiscountAmount }}</div>
        <div v-else-if="remainDiscountAmount > -1"><i class="el-icon-warning gc-warning"></i>剩余折扣位置 {{ remainDiscountAmount }}</div>
        <div v-else><i class="el-icon-success gc-success"></i>剩余位置充足</div>
        <div v-if="noDiscountItemNum">
          <div><i class="el-icon-warning gc-warning"></i>无折扣商品数量{{ noDiscountItemNum }}</div>
        </div>
      </el-descriptions-item>
      <!-- <el-descriptions-item label="优惠券">
        <div><i class="el-icon-success gc-success"></i>三档优惠券设置成功</div>
      </el-descriptions-item>
      <el-descriptions-item label="置顶">
        <div><i class="el-icon-success gc-success"></i>五个置顶商品设置成功</div>
        <div><i class="el-icon-success gc-success"></i>置顶商品已正常置顶</div>
      </el-descriptions-item>
      <el-descriptions-item label="热门精选">
        <div><i class="el-icon-success gc-success"></i>设置成功</div>
      </el-descriptions-item> -->
      <el-descriptions-item label="今日修改">
        <div v-if="todayItemAmountModified >= 20"><i class="el-icon-success gc-success"></i>{{ todayItemAmountModified }}</div>
        <div v-else><i class="el-icon-warning gc-warning"></i>{{ todayItemAmountModified }}</div>
      </el-descriptions-item>
      <!-- 实时计算 -->
      <el-descriptions-item label="剩余位置">
        <div v-if="remainItemLimit > 30"><i class="el-icon-success gc-success"></i>{{remainItemLimit}}/{{ maxItemLimit }}</div>
        <div v-else-if="remainItemLimit > 0"><i class="el-icon-warning gc-warning"></i>{{ remainItemLimit }}/{{ maxItemLimit }} 剩余位置不足</div>
        <div v-else><i class="el-icon-error gc-error"></i>无剩余位置{{ maxItemLimit }}</div>
        <div v-if="syncTime">同步时间: {{parsedSyncTime}}</div>
      </el-descriptions-item>
    </el-descriptions>
    <div>
      <!--
        <el-button @click="createBoost">创建Boost</el-button>
      -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { addBoostShop } from '@/apis/boost.js'
import {
    getDefaultDiscount
} from '@/apis/activity.js'
import {
    getShopeeShopProducts
} from '@/apis/product.js'
import {
  getFollowPrizeList,
  getItemLimit,
  getItemList,
  getDiscount,
  getVoucherList
} from '@/apis/shopee.js'

export default {
  name: 'ShopState',
  props: {
    shop: Object
  },
  data () {
    return {
      statusDiscountDefault: false,
      remainDiscountAmount: -1,
      statusVoucher: {
        low: {
          status: false,
          remaining: 0
        },
        middle: {
          status: false,
          remaining: 0
        },
        high: {
          status: false,
          remaining: 0
        }
      },
      syncTime: 0,
      noDiscountItemNum: 0,
      maxItemLimit: 0,
      onlineItemAmount: 0,
      statusFollowPrize: false,
      todayItemAmountModified: 0
    }
  },
  mounted () {
    this.checkDiscount(this.shop)
    this.checkVoucher(this.shop)
    this.checkProduct(this.shop)
    this.checkItemLimit(this.shop)
    this.checkFollowPrize(this.shop)
    this.checkItemToday(this.shop)
  },
  computed: {
    parsedSyncTime () {
      if (!this.syncTime) return '未同步'
      return moment(this.syncTime).format('YYYY-MM-DD HH:mm:ss')
    },
    remainItemLimit () {
      const result = this.maxItemLimit - this.onlineItemAmount

      return result >= 0 && result
    }
  },
  methods: {
    openShop () {
      const regionLower = this.shop.region.toLowerCase()
      const shopId = this.shop.shop_id
      let prefix = regionLower
      if (regionLower === 'tw') {
        prefix = 'xiapi'
      }

      window.open(`https://${prefix}.xiapibuy.com/shop/${shopId}`, '_blank')
    },
    createBoost () {
      addBoostShop({
        region: this.shop.region,
        shopId: this.shop.shop_id
      }).then(data => {
        console.log(data)
      })
    },
    checkDiscount (shop) {
      getDefaultDiscount({
        // region: this.currentShop.region
        shop_id: shop.shop_id
      }).then(data => {
        getDiscount({
          discount_id: data.data[0]._id,
          shop_id: shop.shop_id,
          page_size: 100,
          page_no: 1
        }).then(result => {
          if (result.status === 'ongoing') {
            this.statusDiscountDefault = true
          }
        })
        getDiscount({
          discount_id: data.data[0]._id,
          shop_id: shop.shop_id,
          page_size: 100,
          page_no: 10
        }).then(result => {
          if (result.item_list && result.item_list.length) {
            this.remainDiscountAmount = 100 - result.item_list.length
          }
        })
      })
    },
    checkVoucher (shop) {
      getVoucherList({
        shop_id: shop.shop_id,
        region: shop.region,
        status: 'ongoing'
      }).then(result => {
        if (!result.voucher_list.length) return

        result.voucher_list.forEach(item => {
          if (item.voucher_name.indexOf('1门槛') >= 0 && item.usage_quantity - item.current_usage >= 0) {
            this.statusVoucher.low.status = true
            this.statusVoucher.low.remaining = item.usage_quantity - item.current_usage
          }
          if (item.voucher_name.indexOf('2门槛') >= 0 && item.usage_quantity - item.current_usage >= 0) {
            this.statusVoucher.middle.status = true
            this.statusVoucher.middle.remaining = item.usage_quantity - item.current_usage
          }
          if (item.voucher_name.indexOf('3门槛') >= 0 && item.usage_quantity - item.current_usage >= 0) {
            this.statusVoucher.high.status = true
            this.statusVoucher.high.remaining = item.usage_quantity - item.current_usage
          }
        })
      })
    },
    checkProduct (shop) {
      getShopeeShopProducts({
        data: {
          shop_id: shop.shop_id
        },
        filter: {
          hasDiscount: 0,
          hasStock: 1
        }
      }).then(data => {
        this.noDiscountItemNum = data.page.totalItem
        if (data.data.length) {
          this.syncTime = data.data[0].sync_time
        } else {
          this.syncTime = 0
        }
      })
    },
    checkItemLimit (shop) {
      getItemLimit({
        shop_id: shop.shop_id
      }).then(data => {
        this.maxItemLimit = data.item_count_limit.max_limit
      })

      getItemList({
        shop_id: shop.shop_id,
        offset: 0,
        status: ['NORMAL']
      }).then(data => {
        this.onlineItemAmount = data.total_count
      })
    },
    checkFollowPrize (shop) {
      return new Promise(() => {
        getFollowPrizeList({
          region: shop.region,
          shop_id: shop.shop_id,
          status: 'ongoing'
        }).then(result => {
          const followPrizeList = result.follow_prize_list
          if (followPrizeList && followPrizeList.length >= 1 && (followPrizeList[0].usage_quantity - followPrizeList[0].claimed) > 10) {
            this.statusFollowPrize = true
          }
        })
      })
    },
    checkItemToday (shop) {
      let todayZero = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
      let now = Math.floor(Date.now() / 1000)

      return new Promise(() => {
        getItemList({
          shop_id: shop.shop_id,
          offset: 0,
          status: ['NORMAL', 'DELETED', 'BANNED', 'UNLIST'],
          update_time_from: todayZero,
          update_time_to: now
        }).then(result => {
          this.todayItemAmountModified = result.total_count
        })
      })
    }
  }
}
</script>

<style scoped>
.gc-success {
  color: #67C23A;
}
.gc-error {
  color: #F56C6C;
}
.gc-warning {
  color: #E6A23C;
}
</style>
