<template>
  <div class="page-content">

    <el-tabs v-model="tab" type="border-card">
      <el-tab-pane label="标签" name="tag">
        <div>
          <el-button @click="openAddTag()">创建新标签</el-button>
        </div>
        <el-table
          :data="tags"
          style="width: 100%"
          :default-sort="{prop: 'type', order: 'descending'}">
          <el-table-column
            prop="value"
            label="标签名">
          </el-table-column>
          <el-table-column
            prop="trans_en"
            label="英文">
          </el-table-column>
          <el-table-column
            prop="trans_tr"
            label="繁体">
          </el-table-column>
          <el-table-column
            prop="synonym"
            label="近义词">
          </el-table-column>
          <el-table-column
            prop="features"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型">
            <template slot-scope="scope">
              <el-tag>{{ tagTypeMap[scope.row.type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="openAddTag(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="描述" name="description">
        <div>
          <el-button @click="openAddDescription()">创建新描述</el-button>
        </div>
        <el-table
          :data="descriptions"
          style="width: 100%"
          :default-sort="{prop: 'type', order: 'descending'}">
          <el-table-column
            prop="short"
            label="短描述"
            width="280">
            <template slot-scope="scope">
              <div>{{scope.row.short}}</div>
              <div>{{scope.row.short_trans}}</div>
              <div>{{scope.row.short_trans_traditional}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="long"
            label="长描述">
            <template slot-scope="scope">
              <div>{{scope.row.long}}</div>
              <div>{{scope.row.long_trans}}</div>
              <div>{{scope.row.long_trans_traditional}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="180">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="openAddDescription(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="型号" name="type">
        <div>
          <el-button @click="openAddType()">创建新型号</el-button>
        </div>
        <el-table
          :data="types">
          <el-table-column
            prop="name"
            label="型号">
          </el-table-column>
          <el-table-column
            prop="type"
            label="手机品牌">
            <template slot-scope="scope">
              <el-tag>{{ brandCompatibility[scope.row.brand] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="openAddType(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="编辑描述" :visible.sync="dialogDescriptionVisible">
      <el-form :model="item">
        <el-form-item label="类别" label-width="100">
          <el-input v-model="item.type"></el-input>
        </el-form-item>
        <el-form-item label="短描述" label-width="100">
          <el-input v-model="item.short"></el-input>
        </el-form-item>
        <el-form-item label="短描述中文简体翻译" label-width="100">
          <el-input v-model="item.short_trans"></el-input>
        </el-form-item>
        <el-form-item label="短描述中文繁体翻译" label-width="100">
          <el-input v-model="item.short_trans_traditional"></el-input>
        </el-form-item>
        <el-form-item label="长描述" label-width="100">
          <el-input v-model="item.long"></el-input>
        </el-form-item>
        <el-form-item label="长描述中文简体翻译" label-width="100">
          <el-input v-model="item.long_trans"></el-input>
        </el-form-item>
        <el-form-item label="长描述中文繁体翻译" label-width="100">
          <el-input v-model="item.long_trans_traditional"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDescriptionVisible = false">取 消</el-button>
        <el-button @click="deleteItem">删 除</el-button>
        <el-button type="primary" @click="confirmDescription">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑标签" :visible.sync="dialogTagVisible">
      <el-form :model="itemTag">
        <el-form-item label="类别" label-width="100">
          <el-select v-model="itemTag.type" placeholder="请选择标签类别">
            <el-option v-for="(item, key) in tagTypeMap" :key="key" :label="item" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" label-width="100">
          <el-input v-model="itemTag.value"></el-input>
        </el-form-item>
        <el-form-item label="英文翻译" label-width="100">
          <el-input v-model="itemTag.trans_en"></el-input>
        </el-form-item>
        <el-form-item label="繁体翻译" label-width="100">
          <el-input v-model="itemTag.trans_tr"></el-input>
        </el-form-item>
        <el-form-item label="近义词" label-width="100">
          <el-input v-model="itemTag.synonym"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100">
          <el-input v-model="itemTag.features"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTagVisible = false">取 消</el-button>
        <el-button @click="handleDeleteTag">删 除</el-button>
        <el-button type="primary" @click="confirmTag">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑型号" :visible.sync="dialogTypeVisible">
      <el-form :model="itemType">
        <el-form-item label="品牌" label-width="100">
          <el-select v-model="itemType.brand" placeholder="请选择品牌">
            <el-option v-for="(item, key) in brandCompatibility" :key="key" :label="item" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" label-width="100">
          <el-input v-model="itemType.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="100">
          <el-input v-model="itemType.sort"></el-input>
        </el-form-item>
        <el-form-item label="长度" label-width="100">
          <el-input v-model="itemType.length"></el-input>
        </el-form-item>
        <el-form-item label="宽度" label-width="100">
          <el-input v-model="itemType.width"></el-input>
        </el-form-item>
        <el-form-item label="高度" label-width="100">
          <el-input v-model="itemType.height"></el-input>
        </el-form-item>
        <el-form-item label="重量" label-width="100">
          <el-input v-model="itemType.weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeVisible = false">取 消</el-button>
        <el-button @click="handleDeleteType">删 除</el-button>
        <el-button type="primary" @click="confirmType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import brandCompatibility from '@/constants/brandCompatibility'
import {getDescriptions, addDescription, editDescription, deleteDescription} from '@/apis/description.js'
import {getTag, addTag, editTag, deleteTag} from '@/apis/tag.js'
import {getType, addType, editType, deleteType} from '@/apis/type.js'

import {tagTypeMap} from '@/constants/normal'

export default {
  name: 'Descriptions',
  data () {
    return {
      brandCompatibility,
      descriptions: [],
      tags: [],
      types: [],
      dialogDescriptionVisible: false,
      dialogTagVisible: false,
      dialogTypeVisible: false,
      item: {},
      itemTag: {},
      itemType: {
        brand: 0
      },
      tab: 'tag',
      tagTypeMap
    }
  },
  created () {
    getDescriptions().then(data => {
      this.descriptions = data
    })
    getTag().then(data => {
      this.tags = data
    })
    getType().then(data => {
      this.types = data
    })
  },
  methods: {
    edit (data) {
      console.log(data)
    },
    openAddDescription (data) {
      if (data) {
        this.item = data
      } else {
        this.item = {}
      }
      this.dialogDescriptionVisible = true
    },
    openAddTag (data) {
      if (data) {
        this.itemTag = data
      } else {
        this.itemTag = {}
      }
      this.dialogTagVisible = true
    },
    openAddType (data) {
      if (data) {
        this.itemType = data
      } else {
        this.itemType = {}
      }
      this.dialogTypeVisible = true
    },
    closeTagDialog () {
      this.dialogTagVisible = false
    },
    confirmDescription () {
      if (this.item._id) {
        editDescription(this.item).then(data => {
          console.log(data)
        })
      } else {
        addDescription(this.item).then(data => {
          console.log(data)
        })
      }
    },
    confirmTag () {
      if (this.itemTag._id) {
        editTag(this.itemTag).then(data => {
          console.log(data)
        })
      } else {
        addTag(this.itemTag).then(data => {
          if (data.length) {
            this.$message.success('标签创建成功')
            this.closeTagDialog()
          }
        })
      }
    },
    confirmType () {
      if (this.itemType._id) {
        editType(this.itemType).then(data => {
          console.log(data)
          this.closeTypeDialog()
        })
      } else {
        addType(this.itemType).then(data => {
          if (data.length) {
            this.$message.success('创建成功')
            this.closeTypeDialog()
          }
        })
      }
    },
    deleteItem () {
      deleteDescription({_id: this.item._id}).then(data => {
        console.log(data)
      })
    },
    handleDeleteTag () {
      deleteTag({_id: this.itemTag._id}).then(data => {
        console.log(data)
      })
    },
    handleDeleteType () {
      deleteType({_id: this.itemType._id}).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
