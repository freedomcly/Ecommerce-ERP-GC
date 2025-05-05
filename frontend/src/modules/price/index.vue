<template>
  <div class="page-content">
    <div>
      <el-select v-model="selectedStation" placeholder="请选择站点">
        <el-option
          v-for="item in stations"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-input-number v-model="weight" :step="10"></el-input-number>
    </div>
    <el-table
      :data="priceData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="cost"
        label="成本">
      </el-table-column>
      <el-table-column
        prop="price"
        label="卖家售价(当地货币)">
      </el-table-column>
      <el-table-column
        prop="priceAfterTax"
        label="税后售价(当地货币)">
      </el-table-column>
      <el-table-column
        prop="priceCny"
        label="售价(CNY)">
      </el-table-column>
      <el-table-column
        prop="priceAfterTaxCny"
        label="税后售价(CNY)">
      </el-table-column>
      <el-table-column
        prop="profit"
        label="利润(当地货币)">
      </el-table-column>
      <el-table-column
        prop="profitCny"
        label="利润(CNY))">
      </el-table-column>
      <el-table-column
        prop="profitRate"
        label="利润率(%)">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import {exchangeRate} from '@/constants/exchange.js'
import {shopIdInShopee, shopBasicDiscountInShopee, buyTaxPriceInShopee} from '@/constants/shopee.js'
import {generateCostList} from '@/utils/cost.js'
import {generatePrice} from '@/utils/generate/generatePrice.js'
import {getProfit} from '@/utils/profit.js'
export default {
  name: 'Price',
  props: ['exchangeRate'],
  data () {
    return {
      priceData: [],
      stations: Object.keys(shopIdInShopee),
      selectedStation: 'SG',
      costList: generateCostList(),
      weight: 60
    }
  },
  watch: {
    selectedStation () {
      this.updatePriceData()
    },
    weight () {
      this.updatePriceData()
    }
  },
  created () {
    this.updatePriceData()
  },
  methods: {
    updatePriceData () {
      const station = this.selectedStation
      const discount = (100 - shopBasicDiscountInShopee[station]) / 100
      this.priceData = this.costList.map(item => {
        const originPrice = generatePrice(item, station)
        const finalPrice = (originPrice * discount).toFixed(2)
        const profit = getProfit(this.exchangeRate, originPrice * discount, station, this.weight, item).profit
        return {
          cost: item,
          price: finalPrice,
          priceAfterTax: (finalPrice * (1 + buyTaxPriceInShopee[station])).toFixed(2),
          priceCny: (finalPrice / this.exchangeRate[station]).toFixed(2),
          priceAfterTaxCny: ((finalPrice * (1 + buyTaxPriceInShopee[station])) / this.exchangeRate[station]).toFixed(2),
          profit: profit.toFixed(2),
          profitCny: (profit / this.exchangeRate[station]).toFixed(2),
          profitRate: (profit / finalPrice * 100).toFixed(2)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
