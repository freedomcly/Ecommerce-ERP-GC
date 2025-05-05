<template>
  <div>
      <div>采购单 {{report.cutoff}}</div>
      <PickingList
        v-if="report.picking_list && report.picking_list.length"
        :picking-list="report.picking_list"
        :is-mobile="Boolean(true)"
        :is-report="Boolean(true)"
        @mark-item-bill-enter="completePickingItem"
        @complete-purchase="completePurchase"
      ></PickingList>
  </div>
</template>

<script>
import PickingList from '@/components/PickingList.vue'
import {
    buildingWeight
} from '@/constants/supplier'

import {
    getPurchaseNote,
    editPurchaseNote
} from '@/apis/purchase.js'
import {info} from '@/apis/user.js'

import {
    editOrder,
    getOrder
} from '@/apis/order.js'
export default {
  name: 'Order-Purchase-Report',
  components: {
    PickingList
  },
  props: {
  },
  data () {
    return {
      report: '',
      purchaseList: [],
      dialogPurchaseVisible: false,
      payment: 0,
      paymentTemp: 0
    }
  },
  computed: {
  },
  created () {
    this.getUserInfo()
    this.initPurchaseReport()
  },
  methods: {
    getUserInfo () {
      const token = localStorage.getItem('token')

      if (!token) {
        this.$router.push({ name: 'login' })
        return
      }

      info({token}).then(data => {
        if (!data || !data.username) {
          this.$router.push({ name: 'login' })
          return
        }
        this.username = data.username
        this.role = data.role
      })
    },
    initPurchaseReport () {
      const cutoff = this.$route.query.cutoff
      if (cutoff) {
        getPurchaseNote({
          cutoff: this.$route.query.cutoff
        }).then(data => {
          if (data.data.length) {
            data.data[0].picking_list.forEach(item => {
              item.items.forEach(subItem => {
                if (!subItem.originUnitPrice) subItem.originUnitPrice = subItem.unitPrice
              })
            })
            this.sort(data.data[0].picking_list)
            this.report = data.data[0]
          }
        })
      } else {
        this.$message.error('链接错误')
      }
    },
    completePickingItem (status, supplierIndex, itemIndex) {
      const currentItem = this.report.picking_list[supplierIndex].items[itemIndex]

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
                if (!item.billTag || item.billTag.length === 0) {
                  item.billTag = []
                  item.billTag.push(this.report.cutoff)
                  item.status = 2
                }
              } else if (status === 2) {
                item.billTag = ''
                item.status = 1
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
              _id: this.report._id,
              picking_list: this.report.picking_list
            }).then(data => {
                this.$message.success('入账成功')
            })
          }
        })
      }
    },
    completePurchase (pickingList) {
      editPurchaseNote({
        _id: this.report._id,
        picking_list: pickingList
      }).then(data => {
          console.log(data)
      })
    },
    sort (list) {
      list.sort((a, b) => {
          if (!a.info.address || !a.info.address.building) {
              this.$message.error(`请先添加地址 ${a.info.serial}`)
              return
          }
          if (!b.info.address || !b.info.address.building) {
              this.$message.error(`请先添加地址 ${b.info.serial}`)
              return
          }
          const addressAWeight = buildingWeight[a.info.address.building]
          const addressBWeight = buildingWeight[b.info.address.building]

          const buildingSort = addressAWeight - addressBWeight

          return buildingSort || -(a.info.address.buildingFloor - b.info.address.buildingFloor)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
