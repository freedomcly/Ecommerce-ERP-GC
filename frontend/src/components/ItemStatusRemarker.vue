<template>
    <div>
        <div v-for="item in statusList" :key="item.id">
            <el-button @click="markStatus(item.id, data)" :type="String(status === item.id && 'primary')" :disabled="role === 2 && item.id === 9" size="mini" round>{{orderStatusMap[item.id]}}</el-button>
        </div>
        <el-button v-if="type === 'pickinglist'" @click="removeItemFromPickingList" size="mini" round>从当前采购单删除</el-button>
    </div>
</template>

<script>
import {
    orderStatusMap
} from '@/constants/status'
export default {
    name: 'ItemStatusRemarker',
    props: {
        statusList: Array,
        data: Object,
        order: Object,
        status: Number,
        type: String,
        supplierIndex: Number,
        itemIndex: Number,
        role: Number
    },
    data () {
        return {
            orderStatusMap
        }
    },
    computed: {
    },
    watch: {
    },
    methods: {
        markStatus (status, data) {
            if (!data.order_sn) {
                if (this.order) {
                    data.order_sn = this.order.order_sn
                }
            }
            this.$emit('mark-item-status', status, data, this.supplierIndex, this.itemIndex)
        },
        removeItemFromPickingList () {
            this.$emit('remove-item-from-picking-list')
        }
    }
}
</script>

<style scoped>
</style>
<style>
</style>
