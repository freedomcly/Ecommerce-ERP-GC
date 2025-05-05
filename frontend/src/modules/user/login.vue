<template>
  <div>
    <el-card class="gc-box-card" shadow="hover">
      <el-form label-position="right" label-width="80px" :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <div class="gc-actions">
          <el-button @click="handleLogin" type="primary">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {login} from '@/apis/user.js'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin () {
      login({
        username: this.form.username,
        password: this.form.password
      }).then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token)
          this.$router.push({ name: 'product' })
        } else {
          this.$message.error(data.message)
        }
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
