<template>
  <el-dialog :title="`店铺商品详情 Shopee ${currentShopeeItemDetail.region}`" :visible="show" :show-close="Boolean(false)" fullscreen>
    <div>
      <div>
        <i class="el-icon-link"></i>
        <el-button @click="toItemPage" type="text">平台前端商品详情页</el-button>
        <!-- <el-button @click="toEditGlobalItem" type="text">编辑虾皮全球商品</el-button> -->
        <el-button @click="toEditItem" type="text">编辑虾皮站点商品</el-button>
      </div>
      <el-descriptions title="" direction="vertical" :column="1" border>
        <el-descriptions-item v-if="shopItem.image" label="图片">
          <img v-for="(item, key) in shopItem.image.image_url_list" :src="item" :key="key" style="width: 100px" />
        </el-descriptions-item>
        <el-descriptions-item v-if="shopItem.video_info" label="视频">
          <div>{{ shopItem.video_info[0].video_url }}</div>
          <img :src="shopItem.video_info[0].thumbnail_url" style="width: 300px" />
        </el-descriptions-item>
        <el-descriptions-item label="商品ID" :span="2">{{shopItem.item_id}}</el-descriptions-item>
        <el-descriptions-item label="全球商品货号" :span="2">
          <el-button @click="toCGItem(shopItem.item_sku)" type="text">{{shopItem.item_sku}}</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag size="small">{{ shopItem.item_status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="时间">
          <div><span size="small">发布时间: {{ parseTime(shopItem.create_time) }}</span></div>
          <div><span size="small">修改时间: {{ parseTime(shopItem.update_time) }}</span></div>
        </el-descriptions-item>
        <el-descriptions-item label="商品名称">{{shopItem.item_name}}</el-descriptions-item>
        <el-descriptions-item label="商品描述">
          <div class="gc-description">{{ shopItem.description }}</div>
          <el-button v-if="currentDescriptionShopee" @click="syncDescription" size="mini">同步最新描述</el-button>
        </el-descriptions-item>

        <el-descriptions-item v-if="modelList && modelList.tier_variation && modelList.tier_variation.length">
          <template slot="label">
            <span>Colors_local</span>
            <!-- <span v-if="form.styles.length !== globalTierVariation[0].option_list.length">(有变更)</span> -->
          </template>
          <div>
            <div v-for="(item, index) in modelList.tier_variation[0].option_list" :key="index">
              <img :src="item.image.image_url" style="width: 100px;">
              <span>{{item.option}}</span>
              <el-input v-model="inputPrice[item.option]" placeholder="输入当地货币价格" size="mini" style="width: 150px;"></el-input>
              <!-- <el-button @click="asyncModelPrice(index)" size="mini">同步价格到model</el-button> -->
            </div>
          </div>
          <div>
            <el-button @click="bindDiscount()" size="mini">绑定折扣</el-button>
          </div>
          <div style="margin-top: 10px;">
            <el-input v-model="flashSaleId" placeholder="秒杀ID" size="mini" style="width: 150px;"></el-input>
            <el-button @click="add2FlashSale" size="mini">加入秒杀</el-button>
            <el-button @click="add2FlashSaleAll" size="mini">加入所有接下来的秒杀</el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item v-if="modelList && modelList.tier_variation && modelList.tier_variation.length">
          <template slot="label">
            <span>Type_local</span>
            <!-- <span v-if="form.types.length !== globalTierVariation[1].option_list.length">(有变更)</span> -->
          </template>
          <div>
            <div v-for="(item, index) in modelList.tier_variation[1].option_list" :key="index">
              <span>{{item.option}}</span>
            </div>
          </div>
        </el-descriptions-item>

        <el-descriptions-item v-if="modelList && modelList.model && modelList.model.length" label="SKU">
          <el-button @click="updateSku" size="mini">同步SKU层级</el-button>
          <el-table
            :data="modelList.model"
            border
            style="width: 100%">
            <!-- <el-table-column
              prop="tier_index"
              label="图片">
              <template slot-scope="scope">
                <img v-if="globalTierVariation[0].option_list[scope.row.tier_index[0]]" style="width: 100%;" :src="globalTierVariation[0].option_list[scope.row.tier_index[0]].image.image_url">
                <img v-else style="width: 100%;" :src="form.images_sku[scope.row.tier_index[0]].url">
              </template>
            </el-table-column> -->
            <el-table-column
              prop=""
              label="model name">
              <template slot-scope="scope">
                <span>{{ scope.row.model_name }}</span>
                <!-- <span>{{globalTierVariation[0].option_list[scope.row.tier_index[0]].option}}</span>
                <span v-if="globalTierVariation[1].option_list[scope.row.tier_index[1]]">{{globalTierVariation[1].option_list[scope.row.tier_index[1]].option}}</span>
                <span v-else>{{ form.types[scope.row.tier_index[1]] }}</span> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="model_id"
              label="model id"
              width="150">
            </el-table-column>
            <!-- <el-table-column
              prop="model_sku"
              type="string"
              label="model sku">
            </el-table-column> -->
            <el-table-column
              prop=""
              label="价格">
              <template slot-scope="scope">
                <div>
                  <div>卖家现价
                    <el-tag>{{scope.row.price_info[0].currency}} {{scope.row.price_info[0].current_price}}</el-tag>
                    <el-tag>CNY {{(scope.row.price_info[0].current_price / exchangeRate[currentShopeeItemDetail.region]).toFixed(2)}}</el-tag>
                    <el-input :value="inputPrice[scope.row.model_name.split(',')[0]]" size="mini" style="width: 80px;" disabled></el-input>
                    <el-input v-model="inputSinglePrice" size="mini" style="width: 80px;"></el-input>
                    <el-button @click="bindSingleDiscount(scope.row)" type="danger" size="mini">绑定折扣单SKU</el-button>
                  </div>
                  <div>税后现价
                    <el-tag>{{scope.row.price_info[0].currency}} {{scope.row.price_info[0].inflated_price_of_current_price}}</el-tag>
                    <el-tag>CNY {{(scope.row.price_info[0].inflated_price_of_current_price / exchangeRate[currentShopeeItemDetail.region]).toFixed(2)}}</el-tag>
                  </div>
                  <div>卖家原价
                    <el-tag>{{scope.row.price_info[0].currency}} {{scope.row.price_info[0].original_price}}</el-tag>
                    <el-tag>CNY {{(scope.row.price_info[0].original_price / exchangeRate[currentShopeeItemDetail.region]).toFixed(2)}}</el-tag>
                  </div>
                  <div>税后原价
                    <el-tag>{{scope.row.price_info[0].currency}} {{scope.row.price_info[0].inflated_price_of_original_price}}</el-tag>
                    <el-tag>CNY {{(scope.row.price_info[0].inflated_price_of_original_price / exchangeRate[currentShopeeItemDetail.region]).toFixed(2)}}</el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="tier_index"
              label="tier index">
              <template slot-scope="scope">
                {{scope.row.tier_index.join('-')}}
              </template>
            </el-table-column> -->
            <el-table-column
              prop=""
              label="库存"
              width="150">
              <template slot-scope="scope">
                <div v-if="scope.row.stock_info_v2">
                  <div>现有库存<el-tag>{{scope.row.stock_info_v2.summary_info.total_available_stock}}</el-tag></div>
                  <div>普通库存<el-tag>{{scope.row.stock_info_v2.seller_stock[0].stock}}</el-tag></div>
                  <div>保留库存<el-tag>{{scope.row.stock_info_v2.summary_info.total_reserved_stock}}</el-tag></div>
                </div>
                <div v-else>
                  <span>暂无</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop=""
              label="操作">
              <template slot-scope="scope">
                <div><el-button @click="changeShopeeGlobalInventory(0, scope.row)" type="danger" size="mini">库存调0</el-button></div>
                <div><el-button @click="changeShopeeGlobalInventory(100, scope.row)" type="primary" size="mini">库存调100</el-button></div>
                <div><el-button v-if="!scope.row.global_model_id" @click="addModel(scope.row)" size="mini">新增model</el-button></div>
              </template>
            </el-table-column> -->
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="danger" @click="closeDialog">确定</el-button>
      <el-button type="success" @click="addToBoostList">加入置顶任务</el-button>
      <el-button type="danger" @click="removeFromBoostList">从置顶任务删除</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { updateShopItem, addDiscountItem, getDiscountList, deleteDiscountItem, addFlashSaleItems, getFlashSaleList } from '@/apis/shopee.js'
import {addBoost, removeBoost} from '@/apis/boost.js'
export default {
  name: 'ShopItemDetail',
  props: {
    show: Boolean,
    shopItem: Object,
    currentShopeeItemDetail: Object,
    currentDescriptionShopee: String,
    modelList: Object,
    exchangeRate: Object
  },
  data () {
    return {
      inputPrice: {},
      inputSinglePrice: 0,
      discountList: [],
      flashSaleId: ''
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    parseTime (timestamp) {
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
    },
    syncDescription () {
      updateShopItem({
        region: this.currentShopeeItemDetail.region,
        shop_id: this.currentShopeeItemDetail.shopId,
        item: {
          ..._.pick(this.shopItem, ['item_id']),
          description: this.currentDescriptionShopee
        }
      }).then((data) => {
        if (data && data.description) {
          this.$message.success('同步最新描述成功')
        }
      })
    },
    closeDialog () {
      this.$emit('close')
    },
    toItemPage () {
      const regionLower = this.currentShopeeItemDetail.region.toLowerCase()
      const shopId = this.currentShopeeItemDetail.shopId
      window.open(`https://${regionLower}.xiapibuy.com/product/${shopId}/${this.shopItem.item_id}`, '_blank')
    },
    addToBoostList () {
      addBoost({
        region: this.currentShopeeItemDetail.region,
        item_id: this.shopItem.item_id,
        shop_id: this.currentShopeeItemDetail.shopId
      })
    },
    removeFromBoostList () {
      removeBoost({
        item_id: this.shopItem.item_id,
        region: this.currentShopeeItemDetail.region,
        shop_id: this.currentShopeeItemDetail.shopId
      }).then(data => {
        console.log(data)
        if (data && data.data.text === 'success') {
          this.$message.success('从置顶任务删除成功')
        }
      })
    },
    updateSku () {
      this.$emit('updata-sku', {
        shop_id: this.currentShopeeItemDetail.shopId,
        item_id: this.shopItem.item_id
      })
    },
    toCGItem (id) {
      let url = this.$router.resolve({
        name: 'edit',
        query: {id: id.split('-')[0]}
      })
      window.open(url.href, '_blank')
    },
    async bindDiscount (data) {
      await getDiscountList({
        shop_id: this.currentShopeeItemDetail.shopId,
        region: this.currentShopeeItemDetail.region
      }).then(data => {
        this.discountList = data.discount_list
      })

      let discountId
      this.discountList.forEach(item => {
        if (item.discount_name === '自定义折扣') {
          discountId = item.discount_id
        }
      })

      let promotionId = 0

      const paramsModelList = this.modelList.model.map(item => {
        let newModelPrice = Number(this.inputPrice[item.model_name.split(',')[0]])
        if (data) {
          if (data.model_id === item.model_id) {
            newModelPrice = Number(this.inputSinglePrice)
          } else {
            newModelPrice = item.price_info[0].current_price
          }
        }

        if (!promotionId && item.promotion_id) {
          promotionId = item.promotion_id
        }

        return {
          model_id: item.model_id,
          model_promotion_price: newModelPrice
        }
      })

      if (promotionId) {
        await deleteDiscountItem({
          region: this.currentShopeeItemDetail.region,
          shop_id: Number(this.currentShopeeItemDetail.shopId),
          item_id: this.shopItem.item_id,
          discount_id: promotionId,
          global_item_sku: this.shopItem.item_sku
        }).then(data => {
          if ((data.error_list && !data.error_list.length) || !data.error_list) {
            this.$message.success('解绑成功')
          }
        })
      }

      addDiscountItem({
        region: this.currentShopeeItemDetail.region,
        shop_id: this.currentShopeeItemDetail.shopId,
        item_list: [{
          item_id: this.shopItem.item_id,
          purchase_limit: 0,
          model_list: paramsModelList
        }],
        discount_id: discountId,
        global_item_sku: this.shopItem.item_sku
      }).then(data => {
        if (data.error_list && data.error_list.length) {
          this.$message.error(`折扣设置失败 ${data.error_list[0].fail_message}`)
        } else if (data.discount_id && !data.warning) {
          this.$message.success('折扣设置成功')
        } else if (data.warning) {
          this.$message.warning(`折扣设置成功 ${data.warning}`)
        } else {
          this.$message.error('折扣设置失败')
        }
      })
    },

    bindSingleDiscount (data) {
      this.bindDiscount(data)
    },
    toEditItem () {
      const shopId = this.currentShopeeItemDetail.shopId
      window.open(`https://seller.shopee.cn/portal/product/${this.shopItem.item_id}/?cnsc_shop_id=${shopId}`, '_blank')
    },
    add2FlashSale (flashSaleId) {
      if (!this.flashSaleId && !flashSaleId) {
        this.$message.error('请输入秒杀ID')
        return
      }
      const currentFlashSaleId = flashSaleId || this.flashSaleId

      const paramsModelList = this.modelList.model.map(item => {
        let newModelPrice = Number(this.inputPrice[item.model_name.split(',')[0]])

        return {
          model_id: item.model_id,
          input_promo_price: newModelPrice,
          stock: 10
        }
      })

      addFlashSaleItems({
        shop_id: this.currentShopeeItemDetail.shopId,
        payload: {
          flash_sale_id: Number(currentFlashSaleId),
          items: [{
            item_id: this.shopItem.item_id,
            purchase_limit: 5,
            models: paramsModelList
          }]
        }
      }).then(data => {
        if (data.failed_items && data.failed_items.length) {
          this.$message.error(data.failed_items[0].err_msg)
        } else {
          this.$message.success('加入秒杀成功')
        }
      })
    },
    add2FlashSaleAll () {
      const that = this
      getFlashSaleList({
        type: 1,
        shop_id: this.currentShopeeItemDetail.shopId
      }).then(data => {
        data.flash_sale_list.forEach((item, index) => {
          (function (index) {
            setTimeout(function () {
              that.add2FlashSale(item.flash_sale_id)
            }, index * 300)
          })(index)
        })
      })
    }
  }
}
</script>

<style scoped>
.gc-description {
  white-space: pre-wrap;
}
</style>
