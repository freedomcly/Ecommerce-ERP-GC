<template>
  <div class="page-content">
    <el-card class="gc-card">
      <div slot="header">
        <span>供应商详情</span>
        <!-- <span v-if="productId && form.supplier_id && form.brand_compatibility_id">20{{form.brand_compatibility_id}}{{form.supplier_id}}{{productId}}</span> -->
      </div>
      <el-form ref="form" :model="supplierData" :rules="rules" label-position="top">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="supplierData.name" placeholder="请输入内容" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="serial">
          <el-input v-model="supplierData.serial" placeholder="请输入内容" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="系列" prop="series">
          <el-tag
            :key="key"
            v-for="(item, key) in supplierData.series"
            closable
            :disable-transitions="false"
            @click="modifyModels(item)"
            @close="deleteSeries(item)">
            {{item.name}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="seriesInputVisible"
            v-model="seriesInput"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputSeriesConfirm"
            @blur="handleInputSeriesConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showSeriesInput">新建产品系列</el-button>

          <el-table
            border
            ref="multipleTable"
            :data="supplierData.series"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              label="名称"
              prop="name"
              width="150">
            </el-table-column>
            <el-table-column
              label="型号"
              prop="models">
              <template slot-scope="scope">
                <el-tag v-for="tag in scope.row.models" :key="tag">{{tag}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              prop="price">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="标签" prop="QQGroup">
            <el-select v-model="supplierData.tags" placeholder="选择标签" clearable multiple filterable>
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <div class="gc-address-editor">
            <el-select v-model="supplierData.address.building" placeholder="选择建筑" clearable @change="selectBuilding">
              <el-option
                v-for="item in building"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input-number v-model="supplierData.address.buildingFloor" :min="1" :max="10" label="选择楼层" @change="inputBuildingFloor"></el-input-number>
            <el-input v-model="supplierData.address.positionIndex" placeholder="输入位置" @input="inputPositionIndex"></el-input>
          </div>
          <!-- <el-tag
            :key="item"
            v-for="item in supplierData.address"
            closable
            :disable-transitions="false"
            @close="deleteAddress(item)">
            {{item}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="addressInputVisible"
            v-model="addressInput"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputAddressConfirm"
            @blur="handleInputAddressConfirm"
          >
          </el-input> -->
          <!-- <el-button v-else class="button-new-tag" size="small" @click="showAddressInput">新建地址</el-button> -->
        </el-form-item>
        <el-form-item label="QQ群" prop="QQGroup">
          <el-input v-model="supplierData.QQGroup" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="supplierData.wechat" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button v-if="isEdit" type="primary" @click="saveSupplier">保存供应商</el-button>
        <el-button v-else type="primary" @click="createSupplier">创建供应商</el-button>
        <!-- <el-button @click="cancel">返回商品列表</el-button> -->
      </div>
    </el-card>
    <el-dialog
      title="产品系列详情"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="closeDialog">
          <div>
            <el-input
              v-model="currentItem.name"
              size="small"
            >
            </el-input>
          </div>
          <div>
            <el-select v-model="brand" placeholder="导入对应的手机型号" @change="importBrandModelType">
              <el-option
                v-for="(item, key) in brandCompatibility"
                :key="key"
                :label="item"
                :value="key">
              </el-option>
            </el-select>
          </div>
          <draggable v-model="models" group="people" @start="drag=true" @end="drag=false">
            <el-tag
              :key="item"
              v-for="item in models"
              closable
              :disable-transitions="false"
              @close="deleteModel(item)"
              class="gc-draggable-tag">
              {{item}}
            </el-tag>
          </draggable>
          <el-input
            class="input-new-tag"
            v-if="modelInputVisible"
            v-model="modelInput"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputModelConfirm"
            @blur="handleInputModelConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showModelInput">新建型号</el-button>
          <div>
            <el-button @click="importTypes" type="text">导入iPhone 16 系列型号（临时功能）</el-button>
            <el-button @click="importAllTypes" type="text">iPhone最小集</el-button>
          </div>
          <div>
            <el-input-number v-model="currentItem.price" :min="1" :max="500" label="请输入产品系列价格"></el-input-number>
          </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmModels">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import {addSupplier, getSupplier, editSupplier} from '@/apis/supplier.js'
import brandCompatibility, {
  brandTypeMap,
  iPhoneTypeMini
} from '@/constants/brandCompatibility'
import {
  building,
  tags
} from '@/constants/supplier'

export default {
  name: 'Add',
  components: {
    draggable
  },
  props: ['username', 'role'],
  data () {
    return {
        supplierData: {
            name: '',
            address: {
              building: '',
              buildingFloor: 0,
              positionIndex: ''
            },
            series: []
        },
        rules: {
            name: {required: true},
            serial: {required: true}
        },
        isEdit: false,
        addressInputVisible: false,
        addressInput: '',
        seriesInputVisible: false,
        seriesInput: '',
        modelInputVisible: false,
        modelInput: '',
        dialogVisible: false,
        models: [],
        brandCompatibility,
        brand: '',
        tags,
        currentItem: {
          price: 0
        }
    }
  },
  async created () {
    const serial = this.$route.query.serial
    if (serial) {
      this.isEdit = true

      getSupplier({serial}).then(data => {
        this.supplierData = data[0]
        if (!this.supplierData.address) {
          this.supplierData.address = {}
        }
      })
    }
  },
  computed: {
    building () {
        return Object.keys(building).map(item => ({value: building[item], label: building[item]}))
    }
  },
  watch: {

  },
  methods: {
    createSupplier () {
      addSupplier(this.supplierData).then(data => {
          console.log(data)
          this.$router.push({ name: 'supplier' })
      })
    },
    saveSupplier () {
      editSupplier(this.supplierData).then(data => {
        if (data.code === 0) {
          this.$message.success('保存成功')
        }
      })
    },
    deleteAddress (item) {
      this.supplierData.address.splice(this.supplierData.address.indexOf(item), 1)
    },
    deleteSeries (item) {
      this.supplierData.series.splice(this.supplierData.series.indexOf(item), 1)
      // this.$forceUpdate()
    },
    deleteModel (item) {
      this.models.splice(this.models.indexOf(item), 1)
    },
    showAddressInput () {
      this.addressInputVisible = true
    },
    showSeriesInput () {
      this.seriesInputVisible = true
    },
    showModelInput () {
      this.modelInputVisible = true
    },
    handleInputAddressConfirm () {
      if (!this.addressInput) return
      this.supplierData.address.push(this.addressInput)
      this.addressInput = ''
    },
    handleInputSeriesConfirm () {
      if (!this.seriesInput) return
      this.supplierData.series.push({
        name: this.seriesInput,
        models: []
      })
      this.seriesInput = ''
    },
    handleInputModelConfirm () {
      if (!this.modelInput) return
      this.models.push(this.modelInput)
      this.modelInput = ''
    },
    modifyModels (data) {
      this.dialogVisible = true
      this.currentItem = data
      this.models = data.models
      this.brand = ''
      console.log(data)
    },
    closeDialog () {
      this.dialogVisible = false
    },
    confirmModels () {
      this.dialogVisible = false
    },
    importBrandModelType (value) {
      brandTypeMap[value].forEach(item => {
        this.models.push(item)
      })
    },
    selectBuilding (data) {
      this.$forceUpdate()
    },
    inputBuildingFloor (data) {
      this.$forceUpdate()
    },
    inputPositionIndex (data) {
      this.$forceUpdate()
    },
    importTypes () {
      this.models.unshift('iPhone 16 Pro Max', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16')
      // this.$forceUpdate()
    },
    importAllTypes () {
      this.models = []
      iPhoneTypeMini.forEach(item => {
        this.models.push(item)
      })
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .gc-sku-images {
    width: 160px;
    height: auto;
  }

  .gc-global-item-image {
    width: 160px;
    height: auto;
    margin-right: 15px;
  }

  .gc-card {
    margin: 20px;
  }

  .gc-images {
    display: flex;
    flex-wrap: wrap;
  }

  .gc-image-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .gc-publish-button {
    margin: 10px 10px 10px 0;
  }

  .gc-address-editor {
    display: flex;
  }

  .gc-draggable-tag {
    cursor: pointer;
  }
</style>
