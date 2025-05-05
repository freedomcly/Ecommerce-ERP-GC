<template>
  <el-dialog title="图片集" :visible="show" fullscreen center @close="closeDialog">
    <div class="gc-image-block" ref="images">
      <el-image
        v-for="(item, key) in multiple"
        :key="key"
        style="width: 200px; height: 200px"
        :src="item"
        :fit="fit">
      </el-image>
    </div>
    <!-- <el-button @click="saveImage">保存图片</el-button> -->
  </el-dialog>
</template>

<script>
export default {
  name: 'Images',
  props: {
    show: Boolean,
    multiple: Array
  },
  data () {
    return {
      fit: "['fill', 'contain', 'cover', 'none', 'scale-down']"
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .gc-image-block {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
</style>
