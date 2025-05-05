<template>
  <div class="page-content">
    <div class="gc-filter-container">
      <el-row class="gc-filter-line">
        <el-button @click="addProduct">创建商品</el-button>
      </el-row>

      <!-- <div>
        <el-button v-for="(value, key) in station" @click="exportExcel(Number(key))" :key="key">生成{{value}}批量上新Excel</el-button>
      </div> -->

      <el-row class="gc-filter-line">
        <!-- <el-select v-model="nonPublished" placeholder="未发布站点" clearable>
          <el-option
            v-for="(value, key) in station"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select> -->

        <!-- <el-select v-model="nonPublishFilter" placeholder="未发布平台" clearable>
          <el-option
            v-for="(value, key) in platform"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select> -->

        <el-select v-model="supplierFilter" placeholder="供应商" clearable filterable @change="changeSupplier">
          <el-option
            v-for="value in supplierList"
            :key="value.serial"
            :label="value.name"
            :value="value.serial">
          </el-option>
        </el-select>
        <el-select v-model="serieFilter" placeholder="产品系列" clearable>
          <el-option
            v-for="(value, key) in series"
            :key="key"
            :label="value.name"
            :value="value.name">
          </el-option>
        </el-select>
        <el-select v-model="shopeeStatusFilter" placeholder="Shopee全球商品发布状态" clearable>
          <el-option
            v-for="(value, key) in shopeeStatus"
            :key="key"
            :label="value.label"
            :value="value.value">
          </el-option>
        </el-select>
        <el-select v-model="sortByFilter" placeholder="上传排序" clearable>
          <el-option
            v-for="(value, key) in sortBy"
            :key="key"
            :label="value.label"
            :value="value.value">
          </el-option>
        </el-select>
        <!-- <el-select v-model="needCheck" placeholder="是否需要盘点">
          <el-option v-for="(item, key) in checkStatus" :key="key" :label="item" :value="Number(key)"></el-option>
        </el-select> -->
        <el-select v-model="selectedTag" placeholder="标签" filterable clearable>
          <el-option v-for="item in tags" :key="item._id" :label="item.value" :value="item._id"></el-option>
        </el-select>
        <el-select v-model="selectedStatus" placeholder="商品状态" filterable clearable>
          <el-option v-for="(item, index) in adoptedStatus" :key="index" :label="item" :value="index"></el-option>
        </el-select>
        <!-- <el-select v-model="selectedPriceOrientation" placeholder="价格定位" clearable>
          <el-option v-for="(item, key) in priceOrientationMap" :key="key" :label="item.name" :value="Number(key)"></el-option>
        </el-select> -->
      </el-row>

      <el-row class="gc-filter-line">
        <div>
          <el-button @click="search" type="primary">搜索</el-button>
        </div>
      </el-row>

      <el-row v-if="multipleSelection.length" class="gc-filter-line">
        <el-button @click="exportProductsImages">导出商品图片集</el-button>
      </el-row>
    </div>

    <template v-if="productsData.data && productsData.data.length">
      <div>共{{page.totalItem}}条 | 已选择{{multipleSelection.length}}条</div>
      <el-pagination background layout="prev, pager, next" :total="page.totalItem" :current-page.sync="currentPage" :page-size="page.pageSize" @current-change="currentChange">
      </el-pagination>

      <el-table
        ref="multipleTable"
        :data="productsData.data"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="请筛选数据"
        v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="主图预览"
          width="180">
          <template slot-scope="scope">
            <img v-lazy="getMainImageUrl(scope.row)" @click="handleEdit(scope.$index, scope.row)" class="c-thumbnail" loading="lazy">
          </template>
        </el-table-column>
        <el-table-column
          label="商品货号"
          sortable
          width="100"
          :sort-method="sortId">
          <template slot-scope="scope">{{ scope.row._id }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="商品状态"
          width="200">
          <template slot-scope="scope">{{ status[scope.row.status] }}</template>
        </el-table-column>
        <el-table-column
          prop="selling_point"
          sortable
          label="卖点词"
          width="200">
        </el-table-column>
        <el-table-column
          prop="name_by_supplier"
          sortable
          label="供应商产品标题"
          width="200">
        </el-table-column>
        <el-table-column
          prop="supplier_id"
          label="供应商"
          sortable
          width="100">
          <template slot-scope="scope">{{ supplier && supplier[scope.row.supplier_id].name }}</template>
        </el-table-column>
        <el-table-column
          prop="cost_price"
          label="产品成本"
          sortable
          width="100">
        </el-table-column>
        <!-- <el-table-column
          prop="sku_model"
          label="SKU模型">
        </el-table-column>
        <el-table-column
          prop="material"
          label="材质">
        </el-table-column>
        <el-table-column
          prop="features"
          label="特性">
        </el-table-column> -->
        <!-- <el-table-column
          label="已发布站点">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.published" :key="index">{{station[Number(item)]}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="全球商品ID" sortable prop="global_item_id">
        </el-table-column>
        <el-table-column
          label="上传时间"
          width="160">
          <template slot-scope="scope">
            <span>{{adoptTime(scope.row.launch_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="role !== 2"
              @click="handleDelete(scope.$index, scope.row)">隐藏</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>共{{page.totalItem}}条 | 已选择{{multipleSelection.length}}条</div>
      <el-pagination background layout="prev, pager, next" :total="page.totalItem" :current-page.sync="currentPage" :page-size="page.pageSize" @current-change="currentChange">
      </el-pagination>
    </template>
    <!-- <div style="margin-top: 20px">
      <el-button @click="toggleSelection([productsData.data[1], productsData.data[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div> -->
    <Images
      :show="dialogVisibleImages"
      :multiple="generateImagesUrl()"
      @close="closeDialogImages"
    ></Images>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import moment from 'moment'
// import domtoimage from 'dom-to-image'
import {shopeeTableOrder, lazadaTableOrderMY} from '@/constants/tableHeaderOrder'
import station from '@/constants/station.js'
import {imageDomain} from '@/constants/aliyun'
import {checkStatus, priceOrientationMap} from '@/constants/normal'
import {deleteHeaderOfSheet} from '@/utils/index'
import {sheet2Workbook} from '@/utils/sheet'
import {getPlatform} from '@/utils/env'
import {generateShopeeSheetData} from '@/utils/generate/generateShopeeSheetData'
import {getProducts, editProductStatus} from '@/apis/product.js'
import {getTag} from '@/apis/tag.js'
import {getSupplier} from '@/apis/supplier.js'
import status from '@/constants/status.js'
import Images from '@/components/Images.vue'

export default {
  name: 'Index',
  components: {
    Images
  },
  props: ['username', 'role'],
  data () {
    return {
      priceOrientationMap,
      checkStatus,
      station,
      supplier: {},
      imageDomain,
      productsData: {},
      multipleSelection: [],
      nonPublished: '',
      supplierFilter: '',
      nonPublishFilter: '',
      currentPage: 1,
      platform: {
        1: 'shopee global'
      },
      supplierList: [],
      currentSupplier: {},
      serieFilter: '',
      series: [],
      dialogVisibleImages: false,
      status,
      adoptedStatus: {...status, 6: '未测款结束'},
      selectedStatus: undefined,
      selectedPriceOrientation: undefined,
      shopeeStatus: [{
        value: 1,
        label: '已发布'
      }, {
        value: 2,
        label: '未发布'
      }],
      sortBy: [{
        value: 1,
        label: '由新到旧'
      }],
      sortByFilter: undefined,
      shopeeStatusFilter: undefined,
      loading: false,
      needCheck: '',
      tags: [],
      selectedTag: ''
    }
  },
  computed: {
    page () {
      return this.productsData.page || {}
    }
  },
  watch: {
  },
  created () {
    this.initSupplier()

    getTag().then(data => {
      this.tags = data
    })
    // this.doSearch({page: {current: this.currentPage}})
  },
  methods: {
    // saveImage () {
    //   // domtoimage.toPng(this.$refs['images']).then(function (canvas) {
    //   //     // document.body.appendChild(canvas)
    //   //     console.log(canvas)
    //   // })
    //   let options = {"cacheBust": true}
    //   domtoimage.toJpeg(this.$refs['images'], options)
    //     .then(function (dataUrl) {
    //         var img = new Image()
    //         img.src = dataUrl
    //         document.body.appendChild(img)
    //     })
    //     .catch(function (error) {
    //         console.error('oops, something went wrong!', error)
    //     })
    // },
    adoptTime (timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    },
    initSupplier () {
      getSupplier().then(data => {
        this.supplierList = data
        data.forEach(item => {
          this.supplier[item.serial] = item
        })
      })
    },
    currentChange () {
      this.search({current: this.currentPage})
    },
    getMainImageUrl (item) {
      if (item.images.length) {
        if (item.images[0].url.indexOf('blob:') === 0) {
          return `${item.images[0].response.data.result.url}?x-oss-process=style/thumbnail`
        } else {
          return `${item.images[0].url.split('?')[0]}?x-oss-process=style/thumbnail`
        }
      } else {
        // TODO: slice(6)可能有问题
        let imageName = '1.jpg'
        return `${imageDomain}${item.old_supplier_id || item.supplier_id}/${String(item._id).slice(6)}/${imageName}?x-oss-process=style/thumbnail`
      }
    },
    addProduct () {
      this.$router.push({ name: 'add' })
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleEdit (index, row) {
      let url = this.$router.resolve({
        name: 'edit',
        query: {id: row._id}
      })
      window.open(url.href, '_blank')
    },
    handleDelete (index, row) {
      this.$confirm('此操作将隐藏该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // removeProducts({ids: [row._id]}).then(res => {
          //   if (res.code === 0) {
          //     this.$message({
          //       type: 'success',
          //       message: '删除成功!'
          //     })
          //   }
          //   location.reload()
          // })
          editProductStatus({
            _id: row._id,
            status: 3
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '隐藏成功',
                type: 'success'
              })
              // location.reload()
            } else {
              this.$message.error('隐藏失败')
            }
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    exportExcel (stationId) {
      const multipleSelection = this.multipleSelection

      if (!multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '未选择任何商品'
        })
        return
      }

      const published = multipleSelection.find(item => {
        const finded = item.published.find(subItem => Number(subItem) === stationId)
        return finded
      })

      if (published) {
        this.$message({
          type: 'error',
          message: '选择的商品中包含该站点已发布商品'
        })
        return
      }

      let workbook

      const platform = getPlatform(stationId)
      switch (platform) {
        case 'shopee':
          workbook = sheet2Workbook(XLSX.utils.json_to_sheet(generateShopeeSheetData(multipleSelection, stationId), {header: shopeeTableOrder}))
          // 删掉表头内容
          deleteHeaderOfSheet(workbook.Sheets.Sheet1)
          break
        case 'lazada':
          workbook = sheet2Workbook(XLSX.utils.json_to_sheet(generateShopeeSheetData(multipleSelection, stationId), {header: lazadaTableOrderMY}))
          break
      }

      XLSX.writeFile(workbook, `${station[stationId]}-upload-products.xlsx`)
    },

    doSearch (params) {
      this.loading = true
      getProducts(params).then(data => {
        this.productsData = data
        this.loading = false
      })
    },

    search (page) {
      let params = {
        data: {}
      }
      if (page) {
        params.page = page
      }
      if (this.supplierFilter) {
        params.data.supplier_id = this.supplierFilter
      }
      if (this.serieFilter) {
        params.data.serie = this.serieFilter
      }
      if (this.shopeeStatusFilter === 1) {
        params.data.global_item_id = {$gt: 0}
      } else if (this.shopeeStatusFilter === 2) {
        params.data.global_item_id = {$exists: 0}
      }
      if (this.sortByFilter) {
        params.data.sort_by = this.sortByFilter
      }
      if (this.needCheck !== '') {
        if (!params.data.inventory) params.data.inventory = {}
        params.data.inventory.need = this.needCheck
      }
      if (this.selectedTag) {
        params.data.tags = {$elemMatch: {_id: this.selectedTag}}
      }
      if (this.selectedStatus) {
        if (Number(this.selectedStatus) === 6) {
          params.data.status = {$ne: 4}
        } else {
          params.data.status = Number(this.selectedStatus)
        }
      }
      if (this.selectedPriceOrientation !== undefined) {
        params.data.price_orientation = Number(this.selectedPriceOrientation)
      }
      this.doSearch(params)
    },

    sortId (row1, row2) {
      let order = -1
      if (row1._id > row2._id) {
        order = 1
      }
      return order
    },
    changeSupplier (value) {
      this.currentSupplier = this.supplierList.find(item => item.serial === value)
      this.series = this.currentSupplier.series.sort(() => -1)
    },
    exportProductsImages () {
      this.dialogVisibleImages = true
    },
    generateImagesUrl () {
      const images = this.multipleSelection.map(item => {
        return this.getMainImageUrl(item)
      })
      return images
    },
    closeDialogImages () {
      this.dialogVisibleImages = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .c-thumbnail {
    width: 160px;
    height: auto;
  }

  .gc-filter-container {
    margin: 10px;
  }

  .gc-filter-line {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
