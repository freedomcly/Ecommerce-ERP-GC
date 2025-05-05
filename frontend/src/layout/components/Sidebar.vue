
<template>
  <div v-if="role" class="sidebar">
    <el-menu
      default-active="2"
      class="gc-menu"
      @select="handleSelect">
      <el-menu-item index="product">
        <i class="el-icon-goods"></i>
        <span slot="title">商品库</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="product-publish">
        <i class="el-icon-connection"></i>
        <span slot="title">上新引擎</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="product-online">
        <i class="el-icon-connection"></i>
        <span slot="title">线上商品</span>
      </el-menu-item>
      <el-menu-item index="order">
        <i class="el-icon-shopping-bag-1"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="descriptions">
        <i class="el-icon-aim"></i>
        <span slot="title">关键词</span>
      </el-menu-item>
      <el-menu-item index="supplier">
        <i class="el-icon-user"></i>
        <span slot="title">供应商</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="price">
        <i class="el-icon-money"></i>
        <span slot="title">价格模型</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="promotion">
        <i class="el-icon-ice-cream-round"></i>
        <span slot="title">活动</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="auth">
        <i class="el-icon-key"></i>
        <span slot="title">手动授权</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="boost">
        <i class="el-icon-magic-stick"></i>
        <span slot="title">热销池</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="shop">
        <i class="el-icon-s-shop"></i>
        <span slot="title">店铺管理</span>
      </el-menu-item>
      <el-menu-item v-if="role !== 2" index="data">
        <i class="el-icon-data-analysis"></i>
        <span slot="title">数据查询</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: ['username', 'role'],
  data () {
    return {
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push({ name: key })
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 160px;
  height: 100%;
  position: fixed;
  top: 51px;
  left: 0;
  z-index: 10;
}

.gc-menu {
  min-height: 100%;
}

</style>
