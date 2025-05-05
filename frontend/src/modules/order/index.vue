<template>
  <div class="page-content">
    <div class="gc-everyday">
        <el-button @click="manageOrderDelivery" type="primary">发货日订单管理</el-button>
    </div>
    <el-tabs v-model="platform" type="border-card">
        <el-tab-pane label="shopee" name="shopee">
            <div>
                <el-select v-model="selectedShopeeShop" placeholder="请选择店铺" clearable>
                    <el-option
                        v-for="item in shopeeShops"
                        :key="shopIdInShopee[item]"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="selectedShopeeOrderStatus" placeholder="请选择订单状态" clearable>
                    <el-option
                        v-for="item in orderStatus"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-button @click="searchOrder" type="primary">搜索</el-button>
                <el-button @click="autoImportOrders">自动导入新订单</el-button>
            </div>
            <div v-if="selectedOrderList.length">
                <el-button @click="addToDeliveryBatch">全部加入发货单</el-button>
            </div>
            <el-table
                :data="orderList"
                style="width: 100%"
                @selection-change="select">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="order_sn"
                    :label="`订单编号(共${orderList.length}单)`"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="viewOrderDetail(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="lazada" name="lazada">
            <div>
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
            </div>
            <el-table
                :data="orderListLazada"
                style="width: 100%"
                @selection-change="select">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="order_id"
                    label="订单编号"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="viewOrderDetailLazada(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
    <el-dialog :title="`订单详情 ${currentOrderDetail.order_sn}`" :visible.sync="dialogOrderVisible" width="80%">
        <el-table
        :data="currentOrderDetail.item_list"
        style="width: 100%">
        <el-table-column
            prop="image_info.image_url"
            label="SKU图"
            width="180">
            <template slot-scope="scope">
                <img :src="scope.row.image_info.image_url" style="width: 100%;">
          </template>
        </el-table-column>
        <el-table-column
            prop="item_sku"
            label="全球商品货号"
            width="180">
        </el-table-column>
        <!-- <el-table-column
            prop=""
            label="档口"
            width="180">
        </el-table-column>
        <el-table-column
            prop=""
            label="拿货价"
            width="180">
        </el-table-column> -->
        <el-table-column
            prop="model_name"
            label="型号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="model_quantity_purchased"
            label="数量">
        </el-table-column>
        </el-table>
        <el-descriptions :column="3" border>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-takeaway-box"></i>包装材料</template><span>待定</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-present"></i>礼物</template><span>待定</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-present"></i>总拿货价</template><span>待定</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-takeaway-box"></i>重量预估</template><span>待定</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="role !== 2">
            <template slot="label"><i class="el-icon-present"></i>利润预估</template><span>待定</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-present"></i>买家留言</template><span class="gc-red">{{currentOrderDetail.message_to_seller}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-present"></i>卖家评论</template><span class="gc-red">{{currentOrderDetail.note}}</span>
        </el-descriptions-item>
        </el-descriptions>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addToDelivery">加入发货单</el-button>
            <!-- <el-button @click="addToDelivery" :disabled="disableInsertDelivery">加入发货单</el-button> -->

            <el-button @click="dialogOrderVisible = false">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {
    shopIdInShopee,
    orderStatus,
    shopeeOrderContent
} from '@/constants/shopee.js'
import {
    shopInLazada,
    orderStatusLazada
} from '@/constants/lazada.js'
import {
    getOrderList,
    getOrderDetail
} from '@/apis/shopee.js'
import {
    getOrders,
    getOrderItems
} from '@/apis/orderLazada.js'
import {
    addOrder,
    autoImport
} from '@/apis/order.js'
export default {
  name: 'Order-Index',
  props: ['username', 'role'],
  data () {
    return {
        platform: 'shopee',
        shopIdInShopee,
        orderStatus,
        orderStatusLazada,
        selectedShopeeShop: undefined,
        selectedLazadaShop: undefined,
        selectedShopeeOrderStatus: 'PROCESSED',
        selectedLazadaOrderStatus: 'toship',
        orderList: [],
        orderListLazada: [],
        selectedOrderList: [],
        dialogOrderVisible: false,
        currentOrderDetail: {}
    }
  },
  computed: {
    shopeeShops () {
        return Object.keys(shopIdInShopee)
    },
    lazadaShops () {
        return shopInLazada
    },
    disableInsertDelivery () {
        if (!this.dialogOrderVisible) return
        if (this.platform === 'shopee') {
            return this.currentOrderDetail.order_status !== 'PROCESSED' && this.currentOrderDetail.order_status !== 'SHIPPED'
        } else if (this.platform === 'lazada') {
            return this.currentOrderDetail.statusesLazada.indexOf('ready_to_ship') < 0 && this.currentOrderDetail.statusesLazada.indexOf('packed') < 0 && this.currentOrderDetail.statusesLazada.indexOf('pending') < 0
        }
    }
  },
  watch: {
  },
  created () {

  },
  methods: {
    select (data) {
        this.selectedOrderList = data
    },
    initShops () {
        return Object.keys(shopIdInShopee)
    },
    searchOrder () {
        const now = new Date().getTime()
        const sevenDaysAgo = now - 86400 * 7 * 1000

        getOrderList({
            region: this.selectedShopeeShop,
            shop_id: shopIdInShopee[this.selectedShopeeShop],
            order_status: this.selectedShopeeOrderStatus,
            time_from: Math.floor(sevenDaysAgo / 1000),
            time_to: Math.floor(now / 1000)
        }).then(data => {
            this.orderList = data.order_list
        })
    },
    searchOrderLazada () {
        const now = new Date().getTime()
        const sevenDaysAgo = now - 86400 * 7 * 1000
        getOrders({
            country: this.selectedLazadaShop,
            status: this.selectedLazadaOrderStatus,
            created_before: new Date(now),
            created_after: new Date(sevenDaysAgo)
        }).then(data => {
            console.log(data)
            this.orderListLazada = data.data.result.data.orders
        })
    },
    viewOrderDetail (order) {
        this.currentOrderDetail = {}
        getOrderDetail({
            region: this.selectedShopeeShop,
            shop_id: shopIdInShopee[this.selectedShopeeShop],
            order_sn_list: [order.order_sn],
            response_optional_fields: shopeeOrderContent
        }).then(data => {
            console.log(data)
            this.currentOrderDetail = data.order_list[0]
            this.dialogOrderVisible = true
        })
    },
    viewOrderDetailLazada (order) {
        console.log(order)
        this.currentOrderDetail = {}
        getOrderItems({
            country: this.selectedLazadaShop,
            order_id: Number(order.order_id)
        }).then(data => {
            const items = data.data.result.data
            console.log(items)
            this.currentOrderDetail.order_sn = order.order_id
            this.currentOrderDetail.item_list = items.map(item => {
                return {
                    image_info: {
                        image_url: item.product_main_image
                    },
                    item_sku: item.sku,
                    model_name: item.variation
                }
            })
            this.currentOrderDetail.statusesLazada = order.statuses
            this.dialogOrderVisible = true
        })
    },
    manageOrderDelivery () {
        this.$router.push({ name: 'order-delivery' })
    },
    addToDelivery () {
        const region = this.platform === 'shopee' ? this.selectedShopeeShop : this.selectedLazadaShop
        addOrder([{
            _id: this.currentOrderDetail.order_sn,
            platform: this.platform,
            region,
            delivery_date: ''
        }]).then(data => {
            if (data.code === 0) {
                this.$message.success('已加入发货单')
            } else {
                this.$message.error('加入发货单失败')
            }
        })
    },
    addToDeliveryBatch () {
        const region = this.platform === 'shopee' ? this.selectedShopeeShop : this.selectedLazadaShop

        addOrder(this.selectedOrderList.map(item => {
            return {
                _id: item.order_sn,
                platform: this.platform,
                region,
                delivery_date: ''
            }
        })).then(data => {
            if (data.code === 0) {
                this.$message.success('已加入发货单')
            } else {
                this.$message.error('加入发货单失败')
            }
        })
    },
    autoImportOrders () {
        autoImport({
            order_status: 'READY_TO_SHIP'
            // order_status: 'PROCESSED'
        }).then(data => {
            console.log(data)
            if (data.importResult.length) {
                this.$message.success(data.importResult)
            } else {
                this.$message.info('没有新订单')
            }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gc-everyday {
    margin: 10px;
}
</style>
