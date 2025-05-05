<template>
    <el-dialog title="图片预览" :visible="show" @close="close">
      <div v-if="!isSimple">
        <el-button @click="setMainImage" :disabled="index === 0" type="text">设置为第一张</el-button>
        <el-button @click="forwardImage" :disabled="index === 0" type="text">向前移动</el-button>
        <el-button @click="backwardImage" :disabled="images && index === images.length - 1" type="text">向后移动</el-button>
        <el-button @click="setLastImage" :disabled="images && index === images.length - 1" type="text">设置为最后一张</el-button>
        <el-button @click="downloadImage" type="text">下载无logo水印图片</el-button>
        <el-button @click="setOptionImage" type="text">设置为选项图</el-button>
      </div>
      <img v-if="!isSimple" width="100%" :src="current && current.url" alt="">
      <div v-if="isSimple && current && current.url" :style="`background-image: url(${current.url});`" class="gc-back-image"></div>
    </el-dialog>
</template>

<script>
export default {
  name: 'ImagePreview',
  props: {
    show: Boolean,
    index: Number,
    images: Array,
    current: Object,
    isSimple: Boolean
  },
  data () {
    return {
    }
  },
  methods: {
    setMainImage () {
      this.$emit('main')
    },
    forwardImage () {
      this.$emit('forward')
    },
    backwardImage () {
      this.$emit('backward')
    },
    setLastImage () {
      this.$emit('last')
    },
    close () {
      this.$emit('close')
    },
    downloadImage () {
      let url = this.current.url.split('?')[0]
      const link = document.createElement('a')

      // const urlStringArr = url.split('.')

      // if (['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'].indexOf(urlStringArr[urlStringArr.length - 1]) < 0) {
        // url = `${url}.jpg`
      // }
      link.download = this.current.name
      link.href = url
      link.click()
    },
    setOptionImage () {
      this.$emit('option')
    }
  }
}
</script>

<style scoped>
.gc-back-image {
    width: 600px;
    height: 600px;
    background-size: cover;
    background-position: center center;
    mask: linear-gradient(-45deg, transparent 200px, #fff 0)
}
</style>
