<template>
    <div class="page-content">
        <div>
            <el-select v-model="selectedPlatform" placeholder="选择平台" clearable>
            <el-option
                v-for="item in platform"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
            </el-select>
            <el-select v-model="selectedRegion" placeholder="选择地区" clearable>
                <el-option
                    v-for="item in region"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <el-input v-model="shopId" placeholder="店铺ID"></el-input>
            <el-input v-model="itemSku" placeholder="商品ID"></el-input>
            <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
                <el-option
                    v-for="(item, key) in statusMap"
                    :key="key"
                    :label="item"
                    :value="key">
                </el-option>
            </el-select>
            <el-select v-model="selectedPublishable" placeholder="选择可发布任务" clearable>
                <el-option
                    v-for="(item, key) in publishableMap"
                    :key="key"
                    :label="item"
                    :value="key">
                </el-option>
            </el-select>
            <el-select v-model="selectedScheduleTag" placeholder="选择排期标签" clearable filterable allow-create>
                <el-option
                    v-for="(item, key) in scheduleTags"
                    :key="key"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <el-date-picker
                v-model="selectedPublishDate"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp">
            </el-date-picker>
            <el-button @click="searchTask">搜索</el-button>
        </div>
        <div>
            <!--
            <el-button @click="openAddTask">创建上新任务</el-button>
            <el-button @click="deleteAllTask">全部删除</el-button>-->
            <el-button v-if="selectedTaskList.length" @click="publishAll">一键发布</el-button>
            <el-button v-if="selectedTaskList.length" @click="addScheduleTag">设置排期标签</el-button>
            <el-button v-if="selectedTaskList.length" @click="deleteBatch">批量删除</el-button>
        </div>
        <el-table
            :data="taskList"
            style="width: 100%"
            @selection-change="select">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="params.global_item_id"
                :label="`全球商品ID(共${taskList.length}条记录)`"
                width="180">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.params && scope.row.params.global_item_id" @click="toCGItem(scope.row)" type="text">{{scope.row.params.global_item_id}}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="shop_id"
                label="店铺ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="region"
                label="地区"
                width="180">
            </el-table-column>
            <el-table-column
                prop="schedule_tag"
                label="排期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'">{{ statusMap[scope.row.status] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="platform"
                label="平台">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button @click="changeTask(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteTask(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑任务" :visible.sync="dialogTaskVisible">
            <el-form :model="item" label-position="right" label-width="60px">
                <el-form-item label="平台">
                    <el-select v-model="item.platform" placeholder="请选择平台">
                        <el-option
                            v-for="(item, key) in platform"
                            :key="key"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地区">
                    <el-select v-model="item.region">
                        <el-option
                            v-for="(item, key) in region"
                            :key="key"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker
                        v-model="item.time"
                        type="datetime"
                        placeholder="选择日期时间"
                        default-time="11:00:00">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTaskVisible = false">取 消</el-button>
                <el-button @click="deleteTask">删 除</el-button>
                <el-button type="primary" @click="confirmTask">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置排期标签" :visible.sync="dialogScheduleVisible">
            <el-form label-position="right" label-width="100px">
                <el-form-item label="排期标签">
                    <el-date-picker
                        v-model="scheduleDate"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="schedulePickerOptions">
                    </el-date-picker>
                    <div>
                        <el-tag v-for="(item, index) in scheduleTimes" :key="index" @click="pickScheduleTime(item)" class="gc-pick">{{item}}</el-tag>
                    </div>
                    <div v-if="scheduleDate && scheduleTime">{{ scheduleTag }}</div>
                    <!-- <el-input v-model="scheduleTag" placeholder="2023-09-09/11:00"></el-input> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogScheduleVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmScheduleTag" :disabled="!(scheduleDate && scheduleTime)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import {platform, region, scheduleTimes} from '@/constants/normal'
import {getTask, removeTask, removeAllTask, editTask} from '@/apis/task'
// import {setDiscountBackEnd} from '@/apis/shopee'

import {
    createPublishTask,
    getItemLimit,
    getItemList
} from '@/apis/shopee.js'
import {getShops} from '@/apis/shop.js'

export default {
name: 'Index',
data () {
    return {
        scheduleTimes,
        platform,
        region,
        dialogTaskVisible: false,
        dialogScheduleVisible: false,
        item: {},
        taskList: [],
        selectedTaskList: [],
        selectedPlatform: '',
        selectedRegion: '',
        selectedStatus: '',
        selectedPublishDate: '',
        selectedPublishable: '',
        selectedScheduleTag: '',
        shopId: '',
        itemSku: '',
        shops: [],
        shopsAttribute: {},
        // scheduleTag: '',
        scheduleTags: [],
        scheduleDate: '',
        scheduleTime: '',
        statusMap: {
            0: '未发布',
            1: '已发布',
            2: '折扣成功'
        },
        publishableMap: {
            0: '全部任务',
            1: '可发布任务'
        },
        pickerOptions: {
            disabledDate (time) {
                return time.getTime() > Date.now()
            }
        },
        schedulePickerOptions: {
            // disabledDate (time) {
            //     return time.getTime() < Date.now()
            // }
        }
    }
},
computed: {
    scheduleTag () {
        return `${this.scheduleDate}/${this.scheduleTime}`
    }
},
watch: {
},
created () {
    this.initSchedule()
    getShops().then(data => {
        this.shops = data

        data.forEach(item => {
            if (!this.shopsAttribute[item.shop_id]) this.shopsAttribute[item.shop_id] = {}
            getItemLimit({
                shop_id: item.shop_id
            }).then(result => {
                this.shopsAttribute[item.shop_id].countLimit = result.item_count_limit.max_limit
            })

            getItemList({
                shop_id: item.shop_id,
                offset: 0,
                status: ['NORMAL']
            }).then(result => {
                this.shopsAttribute[item.shop_id].totalCount = result.total_count
            })
        })
    })
},
methods: {
    pickScheduleTime (time) {
        this.scheduleTime = time
    },
    openAddTask () {
        this.dialogTaskVisible = true
    },
    deleteTask (data) {
        this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            removeTask({id_list: [data._id]}).then(result => {
                console.log(result)
                if (result.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '已删除'
                    })
                }
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
        })
    },
    deleteBatch () {
        this.$confirm(`是否确定删除所选任务${this.selectedTaskList.length}项?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            removeTask({id_list: this.selectedTaskList.map(item => item._id)}).then(result => {
                console.log(result)
                if (result.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '已删除'
                    })
                }
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
        })
    },
    deleteAllTask () {
        removeAllTask().then(result => {
            console.log(result)
        })
    },
    confirmTask () {

    },
    changeTask () {

    },
    searchTask () {
        let params = {}
        if (this.selectedPlatform) {
            params.platform = this.selectedPlatform
        }
        if (this.selectedRegion) {
            params.region = this.selectedRegion
        }
        if (this.selectedStatus) {
            params.status = this.selectedStatus
        }
        if (this.selectedPublishDate) {
            params.publish_time = this.selectedPublishDate
        }
        if (this.selectedScheduleTag) {
            params.schedule_tag = this.selectedScheduleTag === '无标签' ? '' : this.selectedScheduleTag
        }
        if (this.shopId) {
            params.shop_id = this.shopId
        }
        if (this.itemSku) {
            params.item_sku = this.itemSku
        }
        if (Number(this.selectedPublishable)) {
            let shopIds = []
            Object.keys(this.shopsAttribute).forEach(item => {
                const shop = this.shopsAttribute[item]
                if (shop.countLimit > shop.totalCount) {
                    shopIds.push(Number(item))
                }
            })
            params.shop_id = shopIds
        }
        getTask(params).then(data => {
            this.taskList = data.data
        })
    },
    initSchedule () {
        const today = moment().format('YYYY-MM-DD')
        let scheduleTags = scheduleTimes.map(item => {
            return `${today}/${item}`
        })
        scheduleTags.push('无标签')
        this.scheduleTags = scheduleTags
    },
    select (data) {
        this.selectedTaskList = data
    },
    publishAll () {
        this.selectedTaskList.forEach(item => {
            createPublishTask(item.params).then(data => {
                if (data.data.error) {
                    this.$message.error(`${data.data.error} ${data.data.message}`)
                    return
                }
                if (data.code === 0 && !data.data.error) {
                    this.$message.success('任务发布成功')
                    // 后端打折扣

                    // setTimeout(() => {
                    //    setDiscountBackEnd({item, publish_task_id: data.data.response.publish_task_id})
                    // }, 5000)

                    editTask({
                        _id: item._id,
                        publish_time: Date.now(),
                        status: 1
                    }).then(result => {
                        if (result.code === 0) {
                            this.$message.success('任务状态更新成功')
                        } else {
                            this.$message.error('任务状态更新失败')
                        }
                    })
                } else {
                    this.$message.success(`任务发布出错 ${JSON.stringify(data)}`)
                }
            })
        })
    },
    toCGItem (data) {
      let url = this.$router.resolve({
        name: 'edit',
        query: {id: data.item_sku}
      })
      window.open(url.href, '_blank')
    },
    addScheduleTag () {
        this.dialogScheduleVisible = true
    },
    confirmScheduleTag () {
        this.selectedTaskList.forEach(item => {
            if (!item.schedule_tag) {
                editTask({
                    _id: item._id,
                    schedule_tag: this.scheduleTag
                }).then(result => {
                    if (result.code === 0) {
                        this.$message.success('排期标签设置成功')
                        this.dialogScheduleVisible = false
                        // this.scheduleTag = ''
                    } else {
                        this.$message.error('排期标签设置失败')
                    }
                })
            }
        })
    }
}
}
</script>

<style scoped>
.gc-pick {
    cursor: pointer;
}
</style>
