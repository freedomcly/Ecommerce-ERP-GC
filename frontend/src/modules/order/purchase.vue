<template>
  <div class="page-content">
    <el-table
      :data="purchaseList"
      style="width: 100%">
      <el-table-column
        prop="cutoff"
        label="截单标签"
        width="180">
      </el-table-column>
      <el-table-column
        prop=""
        label="支付"
        width="180">
        <template slot-scope="scope">
          <div>{{scope.row.payment}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
          <template slot-scope="scope">
              <div>
                <el-button @click="viewPurchaseDetail(scope.row)" size="mini">查看</el-button>
                <el-button @click="openPurchaseDetail(scope.row)" size="mini">打开采购模式</el-button>
                <el-button @click="deletePurchaseDetail(scope.row)" size="mini">删除</el-button>
              </div>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="`采购报告 ${currentReport.cutoff}`" :visible.sync="dialogPurchaseVisible" fullscreen>
      <div v-if="!payment">
        <el-popover
          placement="right"
          width="400"
          trigger="click">
          <div>
            <el-input v-model="paymentTemp" placeholder="请填写实际支付金额" size="mini"></el-input>
            <el-button @click="confirmPayment" size="mini">确认</el-button>
          </div>
          <el-button slot="reference" type="danger" size="mini">请填写实际支付金额</el-button>
        </el-popover>
      </div>
      <div v-else>实际账单总采购价<el-tag size="mini">{{payment}}</el-tag></div>
      <div>系统预估总采购价<el-tag size="mini">{{totalCost}}</el-tag></div>
      <div>实际支付总采购价<el-tag size="mini">{{totalCostReal}}</el-tag></div>
      <PickingList
        :picking-list="currentReport.picking_list"
        :is-report="Boolean(true)"
        @mark-item-bill-enter="completePickingItem"
      ></PickingList>
    </el-dialog>
  </div>
</template>

<script>
import PickingList from '@/components/PickingList.vue'

import {
    getPurchaseNote,
    editPurchaseNote
} from '@/apis/purchase.js'
import {
    editOrder,
    getOrder
} from '@/apis/order.js'
export default {
  name: 'Order-Purchase-List',
  components: {
    PickingList
  },
  props: {
  },
  data () {
    return {
      purchaseList: [],
      dialogPurchaseVisible: false,
      currentReport: {},
      payment: 0,
      paymentTemp: 0
    }
  },
  computed: {
    totalCost () {
      let cost = 0
      if (this.currentReport && this.currentReport.picking_list && this.currentReport.picking_list.length) {
        this.currentReport.picking_list.forEach(supplier => {
          supplier.items.forEach(item => {
            if (item.billEnter === 1) {
              cost += item.model_quantity_purchased * item.unitPrice
            }
            // if (item.status && [2, 4, 9].indexOf(item.status) >= 0) {
            //     cost += item.model_quantity_purchased * item.unitPrice
            // }
          })
        })
      }
      return cost
    },
    totalCostReal () {
      let cost = 0
      if (this.currentReport && this.currentReport.picking_list && this.currentReport.picking_list.length) {
        this.currentReport.picking_list.forEach(supplier => {
          if (supplier.actCost) {
            cost += Number(supplier.actCost)
          }
        })
      }
      return cost
    }
  },
  created () {
    getPurchaseNote().then(data => {
      this.purchaseList = data.data
    })
  },
  methods: {
    viewPurchaseDetail (data) {
      this.currentReport = data
      this.payment = data.payment || 0
      this.paymentTemp = 0

      this.currentReport.picking_list.forEach(item => {
        item.items.forEach(subItem => {
          if (!subItem.originUnitPrice) subItem.originUnitPrice = subItem.unitPrice
        })
      })

      this.dialogPurchaseVisible = true
    },
    deletePurchaseDetail (data) {
      console.log(data)
    },
    completePickingItem (status, supplierIndex, itemIndex) {
      const currentItem = this.currentReport.picking_list[supplierIndex].items[itemIndex]

      if (status) {
        getOrder({
          _id: currentItem.order_sn
        }).then(data => {
          const order = data.data[0]
          if (!order) {
            this.$message.error('订单状态有误')
          }
          const items = order.items
          let end = false
          items.forEach(item => {
            if (item.model_sku === currentItem.model_sku) {
              if (status === 1) {
                if (item.billTag && item.billTag.length) {
                  this.$message.error('请勿重复入账')
                  end = true
                }
                if (!item.billTag) {
                  item.billTag = []
                  item.billTag.push(this.currentReport.cutoff)
                }
              } else if (status === 2) {
                item.billTag = ''
              }
            }
          })

          if (!end) {
            editOrder({
                _id: currentItem.order_sn,
                items: items
            }).then(data => {
                if (data.code === 0) {
                    this.$message.success(`订单标记成功 ${status}`)
                } else {
                    this.$message.success('订单标记失败')
                }
            })
            this.$set(currentItem, 'billEnter', status)
            editPurchaseNote({
              _id: this.currentReport._id,
              picking_list: this.currentReport.picking_list
            }).then(data => {
                this.$message.success('入账成功')
            })
          }
        })
      }
    },
    confirmPayment () {
      editPurchaseNote({
        _id: this.currentReport._id,
        payment: this.paymentTemp
      }).then(data => {
          console.log(data)
          this.payment = this.paymentTemp
      })
    },
    openPurchaseDetail (data) {
      let url = this.$router.resolve({
        name: 'purchase-report',
        query: {cutoff: data.cutoff}
      })
      window.open(url.href, '_blank')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
