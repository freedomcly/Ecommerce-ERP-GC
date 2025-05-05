<template>
  <div class="page-content">
    <el-row v-if="role !== 2" class="">
      <el-button @click="addSupplier">创建供应商</el-button>
    </el-row>
    <div>
      <div>
        <el-select v-model="selector.tag" placeholder="选择供应商标签" clearable size="mini">
          <el-option
            v-for="item in tags"
            :key="item.value"
            :label="item.label"
            :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="selector.address.building" placeholder="选择建筑" clearable size="mini">
          <el-option
            v-for="item in building"
            :key="item.value"
            :label="item.label"
            :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-input-number v-model="selector.address.buildingFloor" :min="1" :max="10" label="选择楼层" @change="inputBuildingFloor" size="mini"></el-input-number>
      </div>
      <div>
        <el-button @click="seachSupplier" type="primary" size="mini">筛选</el-button>
      </div>
    </div>
    <el-row>
    <el-table
      ref="multipleTable"
      :data="supplierList"
      tooltip-effect="dark"
      style="width: 100%"
      :default-sort = "{prop: 'serial', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <el-table-column
      sortable
        :label="`序号(${supplierList.length}个)`"
        prop="serial">
      </el-table-column>
      <el-table-column
        sortable
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="地址"
        prop="">
        <template slot-scope="scope">
          <span v-if="scope.row.address && scope.row.address.building">{{scope.row.address.building}}</span>
          <span> - </span>
          <span v-if="scope.row.address && scope.row.address.buildingFloor">{{scope.row.address.buildingFloor}}</span>
          <span> - </span>
          <span v-if="scope.row.address && scope.row.address.positionIndex">{{scope.row.address.positionIndex}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="系列"
        prop="series">
        <template slot-scope="scope">
          <el-tag v-for="(item, key) in scope.row.series" :key="key" type="success">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-if="role !== 2"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import {getSupplier, deleteSupplier} from '@/apis/supplier.js'
import {
  tags,
  building
} from '@/constants/supplier'
export default {
  name: 'Supplier',
  props: ['username', 'role'],
  data () {
    return {
      supplierList: [],
      selector: {
        tag: undefined,
        address: {}
      },
      tags
    }
  },
  computed: {
    building () {
        return Object.keys(building).map(item => ({value: building[item], label: building[item]}))
    }
  },
  created () {
    this.seachSupplier()
  },
  methods: {
    seachSupplier () {
      let params = this.selector
      params = _.omit(this.selector, ['address'])
      if (this.selector.address && this.selector.address.building && !this.selector.address.buildingFloor) {
        params['address.building'] = this.selector.address.building
      } else if (this.selector.address && this.selector.address.building && this.selector.address.buildingFloor) {
        params['address.building'] = this.selector.address.building
        params['address.buildingFloor'] = this.selector.address.buildingFloor
      }
      getSupplier(params).then(data => {
        this.supplierList = data
      })
    },
    addSupplier () {
      this.$router.push({ name: 'supplier-add' })
    },
    handleEdit (index, row) {
      let url = this.$router.resolve({
        name: 'supplier-edit',
        query: {serial: row.serial}
      })
      window.open(url.href, '_blank')
    },
    handleSelectionChange () {
      console.log('handleSelectionChange')
    },
    handleDelete (index, row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier({_id: row._id}).then(data => {
          console.log(data)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    inputBuildingFloor (data) {
      this.$forceUpdate()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
