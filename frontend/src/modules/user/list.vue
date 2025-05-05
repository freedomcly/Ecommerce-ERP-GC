<template>
  <div>
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="removeUser(scope.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {list, remove} from '@/apis/user.js'

export default {
  name: 'Login',
  data () {
    return {
      userList: []
    }
  },
  created () {
    // this.initList()
  },
  methods: {
    initList () {
      list().then(data => {
        this.userList = data.data
      })
    },
    removeUser (data) {
      remove({_id: data._id}).then(result => {
        console.log(result)
      })
    }
  }
}
</script>

<style scoped>
.gc-box-card {
  width: 500px;
  margin: 100px auto;
}
.gc-actions {
  display: flex;
  justify-content: center;
}
</style>
