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
        <el-form-item label="确认密码">
          <el-input v-model="form.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option v-for="(item, index) in roleMap" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
<!--         <div class="gc-actions">
          <el-button @click="handleRegister" type="primary">注册</el-button>
          <el-button @click="goToLogin">已有账号，去登录</el-button>
        </div> -->
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {register} from '@/apis/user.js'

export default {
  name: 'Register',
  data () {
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      roleMap: {
        1: '超级管理员',
        2: '仓库管理员',
        3: '商品管理员'
      }
    }
  },
  methods: {
    handleRegister () {
      register({
        username: this.form.username,
        password: this.form.password,
        role: this.form.role
      }).then(data => {
        this.$message('注册成功')
        this.$router.push({ name: 'login' })
      })
    },
    goToLogin () {
      this.$router.push({ name: 'login' })
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
