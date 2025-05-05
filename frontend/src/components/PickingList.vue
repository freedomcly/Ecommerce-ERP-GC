<template>
    <div>
        <!--
        <div>采购报酬预估：{{laborCost.laborCost}}(不足4个商品的档口数量: {{laborCost.booth}} - 采购费预估: {{laborCost.booth * 2}}元; 超4个商品的商品数量: {{laborCost.singleItem}} - 采购费预估: {{laborCost.singleItem * 0.5}}元)</div>
        <div>采购报酬预估：{{pickingList.length * 2}}</div>
        -->
        <div v-if="!isMobile">
            <el-button @click="toggleOrderInfo" size="mini">订单信息开关</el-button>
            <el-button @click="toggleProductNameInfo" size="mini">供应商商品名称开关</el-button>
        </div>
        <el-table
            :data="pickingList"
            border
            stripe
            ref="pickingDom"
            style="width: 100%">
            <el-table-column
                prop="info.name"
                :label="`供应商(共${pickingList.length}个)`"
                max-width="20"
                width="160">
                <template slot-scope="scope">
                    <!-- <el-tooltip class="item" effect="dark" placement="bottom-start">
                        <div slot="content">
                            <span>{{scope.row.info.address.building}}</span>
                            <span> - </span>
                            <span>{{scope.row.info.address.buildingFloor}}</span>
                            <span> - </span>
                            <span>{{scope.row.info.address.positionIndex}}</span>
                        </div>
                        <el-button type="text">{{ scope.row.info.name }}</el-button>
                    </el-tooltip> -->
                    <div @click="viewDetail(scope.row, scope.$index)">
                        <div v-if="isMobile">{{ scope.row.info.name }}</div>
                        <div v-if="!isMobile">
                            <el-button @click="toSupplierDetail(scope.row)" type="text">{{ scope.row.info.name }}</el-button>
                        </div>
                        <div>
                            <span>{{scope.row.info.address.building}}</span>
                            <span> - </span>
                            <span>{{scope.row.info.address.buildingFloor}}</span>
                            <span> - </span>
                            <span>{{scope.row.info.address.positionIndex}}</span>
                        </div>
                        <div v-if="scope.row.info.tags.indexOf(11) >= 0">
                            <el-tag type="success" effect="dark" size="mini">群支付</el-tag>
                        </div>
                        <div v-if="scope.row.isReturn">
                            <el-tag type="danger" effect="dark" size="mini">有退货</el-tag>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                v-if="isMobile"
                prop=""
                label="采购状态">
                <template slot-scope="scope">
                    <div @click="viewDetail(scope.row, scope.$index)">
                        <span v-if="scope.row.status === 1">
                            <el-tag type="success">已完成</el-tag>
                            <span>{{getTimer(scope.row.costTimestamp / 1000)}}</span>
                        </span>
                        <el-tag v-else type="warning">未完成</el-tag>
                    </div>
                </template>
            </el-table-column>
            <!--
            <el-table-column
                label="地址"
                max-width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.info.address.building}}</span>
                    <span> - </span>
                    <span>{{scope.row.info.address.buildingFloor}}</span>
                    <span> - </span>
                    <span>{{scope.row.info.address.positionIndex}}</span>
                </template>
            </el-table-column>
            -->
            <el-table-column
                v-if="!isMobile"
                :label="`商品(共${pickingListItemNum}个)`"
                min-width="300">
                <template slot-scope="scope">
                <el-table
                    :data="scope.row.items"
                    :show-header="false"
                    size="mini"
                    border>
                    <el-table-column
                        prop="image_info.image_url"
                        label="SKU图"
                        width="110">
                        <template slot-scope="scope">
                            <div :style="`background-image: url(${getVNImageUrl(scope.row.image_info.image_url)});`" @click="toCGItem(scope.row)" class="gc-back-image"></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isReport"
                        label="款式">
                        <template slot-scope="scope">
                            <el-tag v-for="(item, index) in getSkuInfo(scope.row.model_sku)" :key="index" size="mini">{{item}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="model_name"
                        label="型号">
                        <template slot-scope="scope">
                            <div>{{adoptModel(scope.row.model_name.split(',')[1])}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="model_quantity_purchased"
                        label="数量"
                        max-width="20">
                        <template slot-scope="scope">
                            <span :class="{ 'gc-red': scope.row.model_quantity_purchased > 1}">{{scope.row.model_quantity_purchased}}个</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isProductNameShow"
                        prop="model_name"
                        label="名称">
                        <template slot-scope="scope">
                            <div>{{scope.row.nameBySupplier}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isReport"
                        prop="unitPrice"
                        label="单价">
                    </el-table-column>
                    <el-table-column
                        v-if="isReport"
                        label="单价">
                        <template slot-scope="scope">
                            <div :class="{ 'gc-red-text': scope.row.originUnitPrice !== scope.row.unitPrice }">{{scope.row.originUnitPrice}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isReport"
                        label="单价">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.unitPrice" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isInfoShow"
                        prop=""
                        label="订单信息">
                        <template slot-scope="scope">
                            <div><el-button @click="handleOpenOrderDetail(scope.row.order_sn)" type="text">{{ scope.row.order_sn }}</el-button></div>
                            <div>{{ scope.row.region }}</div>
                            <div>{{ scope.row.model_sku }}</div>
                            <div>{{ scope.row.quantity }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isReport"
                        prop=""
                        label="标记">
                        <template slot-scope="scope2">
                            <div v-if="scope2.row.model_sku && scope2.row.order_sn && orderListMap[scope2.row.order_sn] && orderListMap[scope2.row.order_sn][scope2.row.model_sku]">
                                <ItemStatusRemarker
                                    type="pickinglist"
                                    :statusList="statusList"
                                    :data="scope2.row"
                                    :status="orderListMap[scope2.row.order_sn][scope2.row.model_sku].status"
                                    @mark-item-status="completePickingItem"
                                    @remove-item-from-picking-list="removeItemFromPickingList(scope2.$index, scope.$index)"
                                ></ItemStatusRemarker>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isReport"
                        prop=""
                        label="采购结果">
                        <template slot-scope="scope2">
                            <!-- <ItemStatusRemarker
                                :supplierIndex="scope.$index"
                                :itemIndex="scope2.$index"
                                :statusList="statusList"
                                :data="scope2.row"
                                :status="scope2.row.status"
                                @mark-item-status="completePickingItem"
                            ></ItemStatusRemarker> -->
                            <div>
                                <div v-if="scope2.row.billEnter !== 1"><el-button @click="markBill(1, scope.$index, scope2.$index)" size="mini" round :type="scope2.row.billEnter === 1 ? 'success' : ''">入账</el-button></div>
                                <div v-if="scope2.row.billEnter === 1"><el-button @click="markBill(2, scope.$index, scope2.$index)" size="mini" round type="danger">取消入账</el-button></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="cutOff"
                        label="发单">
                        <template slot-scope="scope">
                            <div v-if="scope.row.cutOff && scope.row.cutOff.length">
                                <div v-for="item in scope.row.cutOff" :key="item">{{item}}</div>
                            </div>
                            <div v-else>未截单</div>
                        </template>
                    </el-table-column>
                </el-table>
                </template>
            </el-table-column>
            <el-table-column
                v-if="!isMobile"
                prop="cost"
                label="货价"
                max-width="20"
                width="220"
                sortable
                :sort-method="sortCost">
                <template slot-scope="scope">
                    <div>{{ scope.row.cost }}元</div>
                    <div v-if="isReport">实际支付预估: {{ adoptActualPayment(scope.row) }}元</div>
                    <div v-if="isReport && scope.row.actCost">实际支付: {{ scope.row.actCost }}元</div>
                    <div v-if="isReport && scope.row.costTimestamp">支付时间: {{getTimer(scope.row.costTimestamp / 1000)}}</div>
                    <div v-if="isReport && scope.row.note">备注: {{scope.row.note}}</div>
                </template>
            </el-table-column>
            <el-table-column
                v-if="!isReport"
                prop=""
                label="标记"
                max-width="20"
                width="180">
                <template slot-scope="scope">
                    <div><el-button @click="generateTagBySupplier(scope.row)" size="mini">入库</el-button></div>
                    <div><el-button @click="checkAccount(scope.row)" size="mini">对账</el-button></div>
                    <div><el-button @click="removeFromPickingList(scope.$index)" size="mini">从当前采购单删除</el-button></div>
                    <div><el-button @click="markReturn(scope.row)" size="mini">
                        <span v-if="!scope.row.isReturn">有退货</span>
                        <span v-else>取消退货</span>
                    </el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            v-if="isMobile"
            :visible.sync="dialogReportVisible"
            title="采购信息"
            fullscreen
            @close="closeReportDialog">
            <div v-if="currentSupplier">
                <div>
                    <el-button @click="toggleOrderInfo" size="mini">订单信息开关</el-button>
                    <el-button @click="toggleProductNameInfo" size="mini">供应商商品名称开关</el-button>
                </div>
                <div>{{ currentSupplier.info.name }}</div>
                <div>
                    <span>{{currentSupplier.info.address.building}}</span>
                    <span> - </span>
                    <span>{{currentSupplier.info.address.buildingFloor}}</span>
                    <span> - </span>
                    <span>{{currentSupplier.info.address.positionIndex}}</span>
                </div>
                <div v-if="currentSupplier.isReturn">
                    <el-tag type="danger" effect="dark" size="mini">有退货</el-tag>
                </div>
                <el-table
                    :data="currentSupplier.items"
                    size="mini"
                    border>
                    <el-table-column
                        prop="image_info.image_url"
                        label="SKU图"
                        width="110">
                        <template slot-scope="scope">
                            <div :style="`background-image: url(${getVNImageUrl(scope.row.image_info.image_url)});`" @click="toCGItem(scope.row)" class="gc-back-image"></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isReport"
                        label="款式">
                        <template slot-scope="scope">
                            <el-tag v-for="(item, index) in getSkuInfo(scope.row.model_sku)" :key="index" size="mini">{{item}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="model_name"
                        label="型号">
                        <template slot-scope="scope">
                            <div>{{adoptModel(scope.row.model_name.split(',')[1])}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="model_quantity_purchased"
                        label="数量"
                        width="50">
                        <template slot-scope="scope">
                            <span :class="{ 'gc-red': scope.row.model_quantity_purchased > 1}">{{scope.row.model_quantity_purchased}}个</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isReport"
                        prop="unitPrice"
                        label="单价">
                    </el-table-column>
                    <el-table-column
                        v-if="isReport"
                        label="单价"
                        width="50">
                        <template slot-scope="scope">
                            <div :class="{ 'gc-red-text': scope.row.originUnitPrice !== scope.row.unitPrice }">{{scope.row.originUnitPrice}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isReport"
                        label="单价">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.unitPrice" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isReport"
                        prop=""
                        label="采购结果">
                        <template slot-scope="scope2">
                            <div>
                                <div v-if="scope2.row.billEnter !== 1"><el-button @click="markBill(1, currentSupplierIndex, scope2.$index)" size="mini" round :type="scope2.row.billEnter === 1 ? 'success' : ''">入账</el-button></div>
                                <div v-if="scope2.row.billEnter === 1"><el-button @click="markBill(2, currentSupplierIndex, scope2.$index)" size="mini" round type="danger">取消入账</el-button></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isInfoShow"
                        prop=""
                        label="订单信息">
                        <template slot-scope="scope">
                            <div><el-button @click="handleOpenOrderDetail(scope.row.order_sn)" type="text">{{ scope.row.order_sn }}</el-button></div>
                            <div>{{ scope.row.model_sku }}</div>
                            <div>{{ scope.row.quantity }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isProductNameShow"
                        prop="model_name"
                        label="名称">
                        <template slot-scope="scope">
                            <div>{{scope.row.nameBySupplier}}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                    <div>{{ currentSupplier.cost }}元</div>
                    <div v-if="isReport">实际支付预估: {{ adoptActualPayment(currentSupplier) }}元</div>
                    <div v-if="isReport">实际支付:
                        <span v-if="currentSupplier.actCost">{{currentSupplier.actCost}}元</span>
                        <el-input v-if="!currentSupplier.actCost" v-model="actCost" :placeholder="adoptActualPayment(currentSupplier)" size="mini" type="number"></el-input>
                    </div>
                    <div v-if="isReport">备注:
                        <span v-if="currentSupplier.note">{{currentSupplier.note}}</span>
                        <el-input v-if="!currentSupplier.note" v-model="note" size="mini"></el-input>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeReportDialog">取 消</el-button>
                <el-button @click="completePurchase" :disabled="currentSupplier.status === 1">对账完成</el-button>
                <div v-if="currentSupplier.status === 1">
                    <div>完成时间{{getTimer(currentSupplier.costTimestamp / 1000)}}</div>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import {downloadPng, getDate} from '@/utils/index.js'
import {
    orderStatusMap,
    remarkOrderItemStatusList,
    statusColorMap
} from '@/constants/status'
import ItemStatusRemarker from '@/components/ItemStatusRemarker.vue'
import {accessoryType, color, texture} from '@/constants/product'

export default {
  name: 'PickingList',
  components: {
    ItemStatusRemarker
  },
  props: {
    pickingList: Array,
    isReport: Boolean,
    isMobile: Boolean,
    downloadMsg: Number,
    orderListMap: Object,
    productsInfo: Object
  },
  data () {
    return {
        skuInfoMap: {...accessoryType, ...color, ...texture},
        orderStatusMap,
        statusColorMap,
        statusList: remarkOrderItemStatusList,
        isInfoShow: false,
        isProductNameShow: false,
        dialogReportVisible: false,
        currentSupplier: '',
        currentSupplierIndex: '',
        actCost: '',
        note: ''
    }
  },
  computed: {
    pickingListItemNum () {
      let pickingListItemNum = 0
      this.pickingList.forEach(picking => {
          picking.items.forEach(pickingItem => {
              pickingListItemNum += pickingItem.model_quantity_purchased
          })
      })
      return pickingListItemNum
    },
    laborCost () {
      let laborCost = 0
      let booth = 0
      let singleItem = 0
      this.pickingList.forEach(picking => {
        if (picking.items.length >= 4) {
            laborCost += 0.5 * picking.items.length
            singleItem += picking.items.length
        } else {
            laborCost += 2
            booth++
            // laborCost += 0.5 * picking.items.length
            // singleItem += picking.items.length
        }
      })
      return {
        laborCost,
        allBooth: this.pickingList.length,
        booth,
        singleItem
      }
    }
  },
  watch: {
    downloadMsg (val, oldVal) {
      if (val) {
        downloadPng(this.$refs.pickingDom.$el, `picking-${getDate()}.png`)
      }
    }
  },
  created () {
  },
  methods: {
    getTimer (timestamp, noTime) {
        if (!timestamp) return null
        if (noTime) return moment(timestamp * 1000).format('YYYY-MM-DD')
        return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
    },
    closeDialog () {
      this.$emit('close')
    },
    getSGImageUrl (url) {
        return `https://cf.shopee.sg/file/${url.split('/')[4]}`
    },
    getTHImageUrl (url) {
        return `https://cf.shopee.th/file/${url.split('/')[4]}`
    },
    getVNImageUrl (url) {
        if (url.indexOf('shopee') >= 0) {
            return `https://cf.shopee.vn/file/${url.split('/')[4]}`
        } else {
            return url
        }
    },
    toCGItem (data) {
      let url = this.$router.resolve({
        name: 'edit',
        query: {id: data.item_sku.split('-')[0]}
      })
      window.open(url.href, '_blank')
    },
    generateTagBySupplier (data) {
        let tags = data.items.filter(item => {
            return this.orderListMap[item.order_sn][item.model_sku].status === 2
        })

        this.$emit('trans-tags', tags)
    },
    completePickingItem (status, data, supplierIndex, itemIndex) {
        this.$emit('mark-item-status', status, data, supplierIndex, itemIndex)
    },
    handleOpenOrderDetail (orderId) {
        this.$emit('open-order', orderId)
    },
    checkAccount (data) {
        this.$emit('check-account', data)
    },
    toggleOrderInfo () {
        this.isInfoShow = !this.isInfoShow
    },
    toggleProductNameInfo () {
        this.isProductNameShow = !this.isProductNameShow
    },
    removeFromPickingList (index) {
        this.$emit('remove-from-picking-list', index)
    },
    removeItemFromPickingList (itemIndex, supplierIndex) {
        this.$emit('remove-item-from-picking-list', itemIndex, supplierIndex)
    },
    adoptActualPayment (data) {
        let payment = 0
        if (data.items.length) {
            data.items.forEach(item => {
                if (item.billEnter === 1) {
                    payment += item.model_quantity_purchased * item.unitPrice
                }
                // if (item.status && [2, 4, 9].indexOf(item.status) >= 0) {
                //     payment += item.model_quantity_purchased * item.unitPrice
                // }
            })
        }
        return payment
    },
    getSkuInfo (modelSku) {
        if (!modelSku) return ''
        const productId = modelSku.split('-')[0]
        const style = modelSku.split('-')[1]
        const productInfo = this.productsInfo[productId]
        let result = []
        if (productId && style && productInfo && productInfo.sku_info && productInfo.sku_info[style]) {
            const infos = productInfo.sku_info[style]
            if (infos && infos.length) {
                console.log(infos)
                infos.map(info => {
                    result.push(this.skuInfoMap[info.type])
                })
            } else {
                result = []
            }
        }
        return result
    },
    adoptModel (model) {
        return model.replace(/สูงสุด/, 'Max')
    },
    markBill (status, supplierIndex, itemIndex) {
        this.$emit('mark-item-bill-enter', status, supplierIndex, itemIndex)
    },
    viewDetail (data, index) {
        if (!this.isMobile) return
        this.dialogReportVisible = true
        this.currentSupplier = data
        this.currentSupplierIndex = index
        this.actCost = ''
        this.note = ''
    },
    closeReportDialog () {
        this.dialogReportVisible = false
    },
    completePurchase () {
        let actCost
        let cost = this.adoptActualPayment(this.currentSupplier)
        if (cost && !this.actCost) {
            actCost = cost
        } else if (this.actCost) {
            actCost = this.actCost
        }
        if (actCost === undefined) {
            this.$message.error('支付金额错误')
            return
        }
        this.$confirm(`确认支付金额 ${actCost}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            this.pickingList[this.currentSupplierIndex].actCost = actCost
            this.pickingList[this.currentSupplierIndex].status = 1
            this.pickingList[this.currentSupplierIndex].costTimestamp = Date.now()
            this.pickingList[this.currentSupplierIndex].note = this.note
            this.$emit('complete-purchase', this.pickingList)
            this.closeReportDialog()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    toSupplierDetail (data) {
        let url = this.$router.resolve({
            name: 'supplier-edit',
            query: {serial: data.info.serial}
        })
        window.open(url.href, '_blank')
    },
    sortCost (a, b) {
        if (!a.costTimestamp) return -1
        return a.costTimestamp - b.costTimestamp
    },
    markReturn (data) {
        data.isReturn = true
        this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.gc-red {
    background-color: red;
    color: #fff;
    font-weight: bolder;
}
.gc-red-text {
    color: red;
}
</style>
<style>
.el-table .gc-back-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center center;
    mask: linear-gradient(-45deg, transparent 30px, #fff 0)
}
</style>
