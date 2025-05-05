<template>
  <div class="page-content">
    <div>
      <el-button @click="batchBoost">一键置顶</el-button>
      <el-button @click="batchRefresh">一键刷新</el-button>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          <ul>
            <li>好评多</li>
            <li>流量/加购/点赞/下单多</li>
            <li>周期长</li>
            <li>已优化</li>
          </ul>
        </div>
        <el-button type="text">置顶原则<i class="el-icon-question el-icon--right"></i></el-button>
      </el-tooltip>
    </div>
    <div class="gc-grids-boost">
      <el-card v-for="item in boostList" :key="item._id" class="gc-boost-card">
        <div slot="header" class="gc-boost-block">
          <div>
            <span>{{item.region}}</span>
            <span v-if="item.shop_id">({{item.shop_id}})</span>
          </div>
          <div>
            <el-button type="text" @click="boost(item)">随机置顶</el-button>
            <el-button type="text" @click="refresh(item.region, item.shop_id)">刷新全部</el-button>
            <!-- <el-button type="text" @click="remove(item.region)" icon="el-icon-delete"></el-button> -->
            <el-button type="text" @click="openItemListDetail(item)" icon="el-icon-warning-outline"></el-button>
            <el-button type="text" @click="addBoostItem(item)" icon="el-icon-circle-plus-outline"></el-button>
          </div>
        </div>
        <el-row>
          <el-row v-for="subitem in item.boost_items" :key="subitem">
            <el-tag closable :disable-transitions="false" @close="deleteBoostItem(subitem, item.region, item.shop_id)" @click="openProductDetail(item.region, subitem, item.shop_id)">
              {{subitem}}
            </el-tag>
            <el-button type="text" @click="boostOne(subitem, item.region, item.shop_id)">置顶</el-button>
            <span v-if="boostListStatusMap[item.shop_id]">{{boostListStatusMap[item.shop_id][subitem] ? formatSecondsToTime(boostListStatusMap[item.shop_id][subitem])  : '未获取状态'}}</span>
          </el-row>
        </el-row>
      </el-card>
    </div>
    <ShopItemDetail
      :show="dialogShopItemDetailVisible"
      :shopItem="shopItem"
      :currentShopeeItemDetail="currentShopeeItemDetail"
      @close="closeDialogShopItemDetail"
    ></ShopItemDetail>
    <el-dialog
      :title="`置顶商品列表详情${itemListDetail.region}`"
      :visible.sync="itemListDetailVisible"
      width="50%">
      <div style="">
        <el-card v-for="item in itemListResult.item_list" :key="item.item_id" style="display: inline-block;">
          <div>
            <el-tag closable :disable-transitions="false" @close="deleteBoostItem(item.item_id, itemListDetail.region, itemListDetail.shop_id)" @click="openProductDetail(itemListDetail.region, item.item_id, itemListDetail.shop_id)">
              {{item.item_id}}
            </el-tag>
          </div>
          <img :src="item.image.image_url_list[0]" class="gc-global-item-image">
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeItemListDetail" size="mini">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`填写${currentShop.region}站点商品ID`"
      :visible.sync="idInputerVisible"
      @close="closeIdInputer"
      width="50%">
      <div style="">
        <el-input v-model="productId" placeholder="请输入站点ID"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmProductId" size="mini" type="success">确定</el-button>
        <el-button @click="closeIdInputer" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ShopItemDetail from '@/components/ShopItemDetail.vue'
import { addBoost, getBoostList, getBoostCoolDownSecond, boostItem, removeBoost, removeBoostShop } from '@/apis/boost.js'

import {
  getItemBaseInfo
} from '@/apis/shopee.js'
export default {
  name: 'Index',
  components: {
    ShopItemDetail
  },
  data () {
    return {
      boostList: [],
      boostListStatusMap: {},
      inputVisible: false,
      itemListDetailVisible: false,
      dialogShopItemDetailVisible: false,
      currentShopeeItemDetail: {},
      shopItem: {},
      itemListDetail: {},
      itemListResult: [],
      idInputerVisible: false,
      productId: '',
      currentShop: {}
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    getBoostList().then(data => {
      this.boostList = data.data.result
    })
  },
  methods: {
    showInput () {
      this.inputVisible = true
    },
    boost (data) {
      boostItem({
        region: data.region,
        item_id_list: data.boost_items,
        shop_id: data.shop_id
      }).then(data => {
        console.log(data)
      })
    },
    boostOne (data, region, shopId) {
      boostItem({
        region: region,
        item_id_list: [Number(data)],
        shop_id: shopId
      }).then(data => {
        console.log(data)
      })
    },
    refresh (region, shopId) {
      getBoostCoolDownSecond({ region, shop_id: shopId }).then(data => {
        if (!data.data.data) return
        const boostListStatus = data.data.data.item_list

        if (boostListStatus.length === 0) {
          this.boostList.forEach(item => {
            if (item.region === region) {
              // TODO
            }
          })
        }

        const boostListStatusMap = {}
        boostListStatus.forEach(item => {
          boostListStatusMap[item.item_id] = item.cool_down_second
        })

        this.boostListStatusMap[shopId] = boostListStatusMap
        this.$forceUpdate()
      })
    },
    batchBoost () {
      this.boostList.forEach(item => {
        this.boost(item)
      })
    },
    batchRefresh () {
      this.boostList.forEach(item => {
        this.refresh(item.region, item.shop_id)
      })
    },
    formatSecondsToTime (seconds) {
      const hours = Math.floor(seconds / 60 / 60)
      const minus = Math.floor(seconds / 60 % 60)
      const secos = Math.floor(seconds % 60)
      return `${hours}-${minus}-${secos}`
    },
    openProductDetail (region, productId, shopId) {
      this.currentShopeeItemDetail = {}
      this.shopItem = {}
      getItemBaseInfo({
        shop_id: shopId,
        item_id_list: [productId],
        region
      }).then(result => {
        this.shopItem = result.item_list[0]
        this.dialogShopItemDetailVisible = true

        this.currentShopeeItemDetail = {
          region,
          shopId
        }
      })
    },
    openItemListDetail (data) {
      this.itemListDetailVisible = true
      this.itemListDetail = data
      getItemBaseInfo({
        shop_id: data.shop_id,
        item_id_list: data.boost_items,
        region: data.region
      }).then(result => {
        this.itemListResult = result
      })
    },
    closeDialogShopItemDetail () {
      this.dialogShopItemDetailVisible = false
    },
    closeItemListDetail () {
      this.itemListDetailVisible = false
      this.itemListDetail = {}
      this.itemListResult = []
    },
    deleteBoostItem (item, region, shopId) {
      console.log(item)
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDeleteBoostItem(item, region, shopId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    remove (region) {
      console.log(region)
      this.$confirm('是否确定删除店铺置顶?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmRemoveBoostShop(region)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmDeleteBoostItem (item, region, shopId) {
      removeBoost({
        item_id: item,
        region,
        shop_id: shopId
      }).then(() => {
        // location.reload()
      })
    },
    confirmRemoveBoostShop (region) {
      removeBoostShop({
        region
      }).then(() => {
        location.reload()
      })
    },
    addBoostItem (item) {
      this.idInputerVisible = true
      this.currentShop = item
    },
    closeIdInputer () {
      this.idInputerVisible = false
      this.currentShop = {}
      this.productId = ''
    },
    confirmProductId () {
      addBoost({
        region: this.currentShop.region,
        item_id: Number(this.productId),
        shop_id: this.currentShop.shop_id
      }).then(data => {
        if (data.code === 0 && data.data.text === 'success') {
          this.$message.success('商品加入热销池成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.gc-boost-block {
  position: relative;
}
.gc-refresh {
  position: absolute;
  right: 0;
  top: -10px;
}
.gc-grids-boost {
  display: flex;
  flex-wrap: wrap;
}

.gc-boost-card {
  width: 30%;
}
.gc-global-item-image {
  width: 160px;
  height: auto;
  margin-right: 15px;
}

</style>
