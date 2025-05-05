<template>
  <div class="page-content">
    <div>
      <el-button @click="checkShops" type="text">巡店</el-button>
    </div>
    <div>
      <el-button @click="openAddShop()">创建新店铺</el-button>
      <el-button @click="handleSyncAllShop">同步全部站点商品</el-button>
      <el-button @click="handleBatchUnlistAllShop">同步后下架全部站点符合条件的商品</el-button>
    </div>
    <el-table
      :data="shops"
      style="width: 100%"
      :default-sort = "{prop: 'theme_id', order: 'ascending'}"
      default-expand-all>
      <el-table-column type="expand">
        <template slot-scope="props">
          <ShopState v-if="checking" :shop="props.row"></ShopState>
        </template>
      </el-table-column>
      <el-table-column
        prop="shop_id"
        label="店铺ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="region"
        label="地区"
        width="180">
      </el-table-column>
      <el-table-column
        prop="theme_id"
        label="主题"
        width="180"
        sortable>
        <template slot-scope="scope">
          <span>{{ themeShops[scope.row.theme_id] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="changeShop(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="removeShop(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="checkShop(scope.row)" type="text" size="small">检查</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑店铺" :visible.sync="dialogShopVisible">
      <el-form :model="item" label-position="right" label-width="60px">
        <el-form-item label="平台">
            <el-select v-model="item.platform" placeholder="请选择平台">
                <el-option
                    v-for="(item, key) in platform"
                    :key="key"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="地区">
            <el-select v-model="item.region">
                <el-option
                    v-for="(item, key) in region"
                    :key="key"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主题">
            <el-select v-model="item.theme_id">
                <el-option
                    v-for="(item, key) in themeShops"
                    :key="key"
                    :label="item"
                    :value="key">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="店铺ID">
          <el-input v-model="item.shop_id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShopVisible = false">取 消</el-button>
        <el-button @click="removeShop(item)">删 除</el-button>
        <el-button type="primary" @click="confirmShop">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`检查店铺${currentShop.region}-${currentShop.shop_id}`" @closed="closeCheck" :visible.sync="dialogCheckShopVisible">
      <ShopState v-if="dialogCheckShopVisible" :shop="currentShop"></ShopState>
    </el-dialog>
  </div>
</template>

<script>
import {platform, region, themeShops} from '@/constants/normal'
import {getShops, addShop, editShop, deleteShop} from '@/apis/shop.js'
import ShopState from '@/components/ShopState.vue'

import {
  syncAllShop,
  batchUnlistAllShop
} from '@/apis/shopee.js'

export default {
  name: 'Shop',
  components: {
    ShopState
  },
  data () {
    return {
        platform,
        region,
        themeShops,
        dialogShopVisible: false,
        dialogCheckShopVisible: false,
        item: {},
        shops: [],
        currentShop: {},
        checking: false
    }
  },
  computed: {
  },
  created () {
    getShops().then(data => {
      this.shops = data
    })
  },
  methods: {
    openAddShop () {
      this.item = {}
      this.dialogShopVisible = true
    },
    confirmShop () {
      if (this.item._id) {
        editShop(this.item).then(data => {
          console.log(data)
        })
      } else {
        addShop(this.item).then(data => {
          console.log(data)
        }).catch(error => {
          console.log(error)
        })
      }
    },
    removeShop (data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteShop({shop_id: data.shop_id}).then(result => {
          console.log(result)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changeShop (data) {
      this.item = data
      this.dialogShopVisible = true
    },
    checkShop (data) {
      this.dialogCheckShopVisible = true
      this.currentShop = data
    },
    closeCheck () {
      this.dialogCheckShopVisible = false
    },
    handleSyncAllShop () {
      syncAllShop().then(data => {
        console.log(data)
      })
    },
    handleBatchUnlistAllShop () {
      batchUnlistAllShop().then(data => {
        console.log(data)
      })
    },
    checkShops () {
      this.checking = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
