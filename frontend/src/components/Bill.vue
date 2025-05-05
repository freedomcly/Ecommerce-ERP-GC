<template>
  <div>
    <div>
      <span>税前售价 {{billDetail.cost_of_goods_sold}} </span>
      <span>({{(billDetail.cost_of_goods_sold / exchangeRate[region.slice(0, 2)]).toFixed(2)}} CNY)</span>
    </div>
    <div>
      <span>订单收入 {{(billDetail.cost_of_goods_sold - billDetail.sales_tax_on_lvg).toFixed(2)}} </span>
      <span>({{((billDetail.cost_of_goods_sold - billDetail.sales_tax_on_lvg) / exchangeRate[region.slice(0, 2)]).toFixed(2)}} CNY)</span>
    </div>
    <div></div>
    <div>买家运费 {{billDetail.buyer_paid_shipping_fee.toFixed(2)}}</div>
    <div>折扣 {{(billDetail.order_seller_discount / billDetail.order_original_price * 100).toFixed(2)}}%OFF</div>
    <div>卖家优惠券 {{billDetail.voucher_from_seller}}</div>
    <div>平台优惠券 {{billDetail.voucher_from_shopee}}</div>
    <div>买家实际支付 {{billDetail.buyer_total_amount}}</div>
    <div>货单价 {{unitPrice}} CNY</div>
    <el-divider content-position="left">平台收费</el-divider>
    <div :class="{'gc-error': Number(getProfitHere().commissionPart.toFixed(2)) !== billDetail.commission_fee}">
      <span>
        <span>佣金 {{billDetail.commission_fee}} </span>
        <strong>{{getProfitHere().commissionPart.toFixed(2)}}</strong>
        <span>{{(billDetail.commission_fee / (billDetail.cost_of_goods_sold - billDetail.sales_tax_on_lvg - billDetail.voucher_from_seller) * 100).toFixed(2)}}%</span>
      </span>
    </div>
    <div :class="{'gc-error': Number(getProfitHere().transactionPart.toFixed(2)) !== billDetail.seller_transaction_fee}">
      <span>
        <span>交易手续费 {{billDetail.seller_transaction_fee}} </span>
        <strong>{{getProfitHere().transactionPart.toFixed(2)}}</strong>
        <span>{{(billDetail.seller_transaction_fee / (billDetail.buyer_total_amount + billDetail.coins) * 100).toFixed(2)}}%</span>
      </span>
    </div>
    <div :class="{'gc-error': Number(getProfitHere().servicePart.toFixed(2)) !== billDetail.service_fee}">
      <span>
        <span>活动服务费 {{billDetail.service_fee}} </span>
        <strong>{{getProfitHere().servicePart.toFixed(2)}}</strong>
        <span>{{(billDetail.service_fee / (billDetail.cost_of_goods_sold - billDetail.sales_tax_on_lvg - billDetail.voucher_from_seller) * 100).toFixed(2)}}%</span>
      </span>
    </div>
    <div :class="{'gc-error': getProfitHere().sellerPaysShipping.toFixed(2) !== (billDetail.actual_shipping_fee - billDetail.buyer_paid_shipping_fee - billDetail.shopee_shipping_rebate).toFixed(2)}">
      <span>
        <span>藏价 {{cangjia.toFixed(2)}} </span>
        <strong>{{getProfitHere().sellerPaysShipping.toFixed(2)}}</strong>
        <span>{{((billDetail.actual_shipping_fee - billDetail.buyer_paid_shipping_fee - billDetail.shopee_shipping_rebate) / billDetail.cost_of_goods_sold * 100).toFixed(2)}}%</span>
      </span>
    </div>
    <div v-if="false">
      <el-divider content-position="left">其他成本</el-divider>
      <div>采购人力 {{manpower.purchase}} CNY</div>
      <div>质检人力 {{manpower.qc}} CNY</div>
      <div>打包人力 {{manpower.packing}} CNY</div>
      <div>人力合计 {{manpower.total}} CNY</div>
      <div>包材预估 1 CNY</div>
    </div>
    <el-divider content-position="left">利润</el-divider>
    <div :class="{'gc-error': Number(getProfitHere().income.toFixed(2)) !== billDetail.escrow_amount_after_adjustment}">打款收入 {{billDetail.escrow_amount_after_adjustment}} {{(billDetail.escrow_amount_after_adjustment / billDetail.cost_of_goods_sold * 100).toFixed(2)}}% <strong>{{getProfitHere().income.toFixed(2)}}</strong></div>
    <div v-if="billDetail && billDetail.escrow_amount_after_adjustment && cost">利润CNY {{profit.profitOfProductCost.toFixed(2)}}</div>
    <div v-if="billDetail && billDetail.escrow_amount_after_adjustment && cost">利润CNY(扣除其他成本) {{profit.netProfit.toFixed(2)}}</div>
    <div>毛利润率 {{((profit.profitOfProductCost / (billDetail.cost_of_goods_sold / exchangeRate[region.slice(0, 2)])) * 100).toFixed(2)}}%</div>
    <div>净利润率 {{((profit.netProfit / (billDetail.cost_of_goods_sold / exchangeRate[region.slice(0, 2)])) * 100).toFixed(2)}}%</div>
    <div>
      <el-button @click="calculatePrice" size="mini">计算价格区间</el-button>
    </div>
    <div v-if="prices">
      <div v-for="(price, key) in prices" :key="key">{{key}}元利润价格: {{price.toFixed(2)}}</div>
    </div>
  </div>
</template>

<script>
import {rateInShopee} from '@/constants/shopee.js'
import {getProfit} from '@/utils/profit.js'

export default {
  name: 'Bill',
  props: {
    billDetail: Object,
    cost: Number,
    region: String,
    weight: Number,
    exchangeRate: Object
  },
  data () {
    return {
      prices: null
    }
  },
  computed: {
    profit () {
      const profitOfProductCost = this.billDetail.escrow_amount_after_adjustment / this.exchangeRate[this.region.slice(0, 2)] - this.cost
      const netProfit = profitOfProductCost - this.manpower.total - 1
      this.$emit('profit', profitOfProductCost)
      return {
        profitOfProductCost,
        netProfit
      }
    },
    manpower () {
      const purchase = this.billDetail.items.length * 2 // 每个商品采购人力预估2
      const qc = this.billDetail.items.length * 0.5 // 每个商品质检人力预估0.5
      const packing = 2 // 每个订单打包人力预估2
      return {
        purchase,
        packing,
        qc,
        total: purchase + qc + packing
      }
    },
    unitPrice () {
      let amount = 0
      this.billDetail.items.forEach(subItem => {
          amount += subItem.quantity_purchased
      })
      let CTPure = (this.billDetail.buyer_total_amount - this.billDetail.buyer_paid_shipping_fee + this.billDetail.voucher_from_shopee + this.billDetail.voucher_from_seller) / this.exchangeRate[this.region.slice(0, 2)]
      return (CTPure / amount).toFixed(2)
    },
    cangjia () {
      return this.billDetail.actual_shipping_fee - this.billDetail.buyer_paid_shipping_fee - this.billDetail.shopee_shipping_rebate
    }
  },
  methods: {
    getProfitHere () {
      const profit = getProfit(this.exchangeRate, this.billDetail.cost_of_goods_sold, this.region.slice(0, 2), this.weight, this.cost || 0, this.billDetail.buyer_paid_shipping_fee, this.billDetail.voucher_from_seller, this.billDetail)
      return profit
    },
    calculatePrice () {
      const region = this.region.slice(0, 2)

      const platformChargeRatio = rateInShopee[region].commission + rateInShopee[region].transaction + rateInShopee[region].service

      const a = this.cost * this.exchangeRate[region] + this.cangjia
      const b = (100 - platformChargeRatio) / 100
      let prices = {}

      for (let i = 0; i <= 30; i = i + 5) {
        prices[i] = (a + i * this.exchangeRate[region]) / b
      }

      this.prices = prices
    }
  }
}
</script>

<style scoped>
.gc-error {
  color: red;
}
</style>
