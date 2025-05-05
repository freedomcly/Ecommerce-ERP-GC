<template>
  <div class="page-content">
    <div>
      <el-button @click="sync">同步全球商品</el-button>
      <el-button @click="loadPublishedInfo">同步站点发布数据</el-button>
      <el-button @click="loadProductInfo">同步商品数据</el-button>
    </div>
    <div>共条</div>
    <!-- <el-pagination background layout="prev, pager, next" :total="total" :current-page.sync="currentPage" :page-size="page.pageSize" @current-change="currentChange">
    </el-pagination> -->

    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
    </el-table>
    <div>共{{total}}条</div>
    <!-- <el-pagination background layout="prev, pager, next" :total="total" :current-page.sync="currentPage" :page-size="page.pageSize" @current-change="currentChange">
    </el-pagination> -->
  </div>
</template>

<script>
import {
  syncGlobalProducts,
  syncGlobalItemPublishedInfo,
  syncGlobalItemProductInfo
} from '@/apis/shopee'

export default {
  name: 'Index',
  data () {
    return {
      list: [],
      total: 0,
      currentPage: 1
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    // this.doSearch({current: this.currentPage})
  },
  methods: {
    handleSelectionChange () {

    },
    sync () {
      syncGlobalProducts().then(data => {
        console.log(data)
        // this.list = data.data.global_item_list
        // this.total = data.data.total_count
      })
    },
    doSearch (params) {
    },
    loadPublishedInfo () {
      syncGlobalItemPublishedInfo()
    },
    loadProductInfo () {
      syncGlobalItemProductInfo()
    }
  }
}
</script>

<style scoped>
</style>
