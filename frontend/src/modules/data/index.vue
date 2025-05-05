<template>
  <div class="page-content">
    <el-input
      type="textarea"
      :rows="6"
      placeholder="请输入数据查询语句"
      v-model="query">
    </el-input>
    <el-button @click="search">查询</el-button>
  </div>
</template>

<script>
import {searchData} from '@/apis/data.js'

export default {
  name: 'Data',
  data () {
    return {
      query: ''
    }
  },
  methods: {
    search () {
      searchData({
        query: this.query
      }).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
