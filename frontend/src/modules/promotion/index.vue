<template>
  <div class="page-content">
    <el-tabs v-model="type" type="border-card">
    <el-tab-pane label="优惠券" name="voucher">
        <div>
            <el-select v-model="selectedStation" placeholder="请选择站点">
                <el-option
                v-for="item in stations"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>

            <span v-if="PCT">
                <span>上月客单价</span>
                <span>{{PCT}}</span>
                <span class="gc-cny">{{getCNY(PCT)}}</span>
            </span>

            <el-button :disabled="!selectedStation" @click="createVoucherThree">创建下周各档优惠券(周二零点前使用)</el-button>
        </div>
        <el-table
            :data="voucherData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="voucher_code"
                label="优惠券代码">
            </el-table-column>
            <el-table-column
                prop="voucher_name"
                label="优惠券名称">
            </el-table-column>
            <el-table-column
                prop="current_usage"
                label="已用"
                width="80">
            </el-table-column>
            <el-table-column
                prop=""
                label="优惠券类型"
                width="120">
                <template slot-scope="scope">
                    {{voucherTypes[scope.row.reward_type]}}
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="百分比"
                width="80">
                <template v-if="scope.row.percentage" slot-scope="scope">
                    {{scope.row.percentage}}%
                </template>
            </el-table-column>
            <el-table-column
                prop="max_price"
                label="最高优惠金额">
            </el-table-column>
            <el-table-column
                prop="discount_amount"
                label="优惠金额"
                width="80">
            </el-table-column>
            <el-table-column
                prop="min_basket_price"
                label="门槛"
                width="80">
            </el-table-column>
            <el-table-column
                prop=""
                label="时间">
                <template slot-scope="scope">
                    <div>{{getTimer(scope.row.start_time)}}</div>
                    <div>{{getTimer(scope.row.end_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="viewVoucherDetail(scope.row)" type="text" size="small">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>

    <el-tab-pane label="关注礼" name="followPrize">
        <div>
            <el-select v-model="selectedStation" placeholder="请选择站点">
                <el-option
                v-for="item in stations"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>

            <span v-if="PCT">
                <span>上月客单价</span>
                <span>{{PCT}}</span>
                <span class="gc-cny">{{getCNY(PCT)}}</span>
            </span>
        </div>
        <el-table
            :data="voucherData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="campaign_id"
                label="关注礼ID">
            </el-table-column>
            <el-table-column
                prop="follow_prize_name"
                label="关注礼名称">
            </el-table-column>
            <el-table-column
                prop="claimed"
                label="关注礼领取">
            </el-table-column>
            <el-table-column
                prop="usage_quantity"
                label="关注礼总数">
            </el-table-column>
            <el-table-column
                prop=""
                label="时间">
                <template slot-scope="scope">
                    <div>{{getTimer(scope.row.start_time)}}</div>
                    <div>{{getTimer(scope.row.end_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="viewDetail(scope.row)" type="text" size="small">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>

    <el-tab-pane label="折扣" name="discount">
        <div>
            <el-select v-model="selectedStation" placeholder="请选择站点">
                <el-option
                v-for="item in stations"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>

            <span v-if="PCT">
                <span>上月客单价</span>
                <span>{{PCT}}</span>
                <span class="gc-cny">{{getCNY(PCT)}}</span>
            </span>
        </div>
        <el-table
            :data="discountData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="discount_id"
                label="折扣ID">
                <template slot-scope="scope">
                    <span>{{scope.row.discount_id}}</span>
                    <el-tag v-if="defaultDiscountData && defaultDiscountData._id && scope.row.discount_id === defaultDiscountData._id" type="success" size="mini">默认</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="discount_name"
                label="折扣名称">
            </el-table-column>
            <el-table-column
                prop=""
                label="时间">
                <template slot-scope="scope">
                    <div>{{getTimer(scope.row.start_time)}}</div>
                    <div>{{getTimer(scope.row.end_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <!-- <el-button @click="viewDetail(scope.row)" type="text" size="small">查看详情</el-button> -->
                    <el-button @click="setDefaultDiscount(scope.row)" type="text" size="small">设为默认折扣</el-button>
                    <el-button @click="copyDiscount(scope.row)" type="text" size="small">复制折扣</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>

    <el-tab-pane label="店内秒杀" name="flashSale">
        <div>
            <el-select v-model="selectedStation" @change="selectStationFlashSale" placeholder="请选择站点">
                <el-option
                v-for="item in stations"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>

            <el-button :disabled="!selectedStation" @click="handleCreateFlashSale">创建下周全时段秒杀(从明天起)</el-button>
        </div>
        <el-table
            :data="flashSaleData"
            stripe
            style="width: 100%"
            :default-sort = "{prop: 'start_time', order: 'descending'}">
            <el-table-column
                prop="flash_sale_id"
                label="秒杀ID">
            </el-table-column>
            <el-table-column
                prop="item_count"
                label="秒杀商品数">
            </el-table-column>
            <el-table-column
                prop="remindme_count"
                label="remindme数">
            </el-table-column>
            <el-table-column
                prop="click_count"
                label="点击数">
            </el-table-column>
            <el-table-column
                prop=""
                label="时间"
                sortable
                sort-by="start_time">
                <template slot-scope="scope">
                    <div>{{getTimer(scope.row.start_time)}}</div>
                    <div>{{getTimer(scope.row.end_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="viewFlashSaleDetail(scope.row)" type="text" size="small">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    </el-tabs>
    <el-dialog
        :title="`优惠券详情-${voucherDetail && voucherDetail.voucher_code}`"
        :visible.sync="dialogVisibleVoucher"
        width="80%">
        <el-descriptions v-if="voucherDetail" class="margin-top" title="" :column="2" border>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-user"></i>
                    客单价
                </template>
                {{PCT || '本站暂无'}}
                <span class="gc-cny">{{PCT ? getCNY(PCT) : ''}}</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="voucherDetail.percentage">
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    百分比
                </template>
                {{voucherDetail.percentage}}%
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    门槛
                </template>
                {{voucherDetail.min_basket_price}}
                <span class="gc-cny">{{getCNY(voucherDetail.min_basket_price)}}</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="voucherDetail.discount_amount">
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    优惠金额
                </template>
                {{voucherDetail.discount_amount}}
                <span class="gc-cny">{{getCNY(voucherDetail.discount_amount)}}</span>
            </el-descriptions-item>
            <template v-if="voucherDetail.reward_type !== 1">
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        最高优惠金额
                    </template>
                    {{voucherDetail.max_price}}
                    <span class="gc-cny">{{getCNY(voucherDetail.max_price)}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        价格范围
                    </template>
                    {{voucherDetail.min_basket_price}}-{{(voucherDetail.max_price / voucherDetail.percentage * 100).toFixed(2)}}
                    <span class="gc-cny">{{getCNY(voucherDetail.min_basket_price)}}-{{getCNY(voucherDetail.max_price / voucherDetail.percentage * 100)}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        优惠范围
                    </template>
                    {{(voucherDetail.min_basket_price * voucherDetail.percentage / 100).toFixed(2)}}-{{voucherDetail.max_price}}
                    <span class="gc-cny">{{getCNY(voucherDetail.min_basket_price * voucherDetail.percentage / 100)}}-{{getCNY(voucherDetail.max_price)}}</span>
                </el-descriptions-item>
            </template>

        </el-descriptions>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleVoucher = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisibleVoucher = false">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
        title="秒杀详情"
        :visible.sync="dialogVisibleFlashSale"
        width="80%">
        <el-descriptions v-if="flashSaleDetail" class="margin-top" title="" :column="2" border>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-user"></i>
                    客单价
                </template>
                {{PCT || '本站暂无'}}
                <span class="gc-cny">{{PCT ? getCNY(PCT) : ''}}</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="voucherDetail.percentage">
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    百分比
                </template>
                {{voucherDetail.percentage}}%
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    门槛
                </template>
                {{voucherDetail.min_basket_price}}
                <span class="gc-cny">{{getCNY(voucherDetail.min_basket_price)}}</span>
            </el-descriptions-item>
            <el-descriptions-item v-if="voucherDetail.discount_amount">
                <template slot="label">
                    <i class="el-icon-tickets"></i>
                    优惠金额
                </template>
                {{voucherDetail.discount_amount}}
                <span class="gc-cny">{{getCNY(voucherDetail.discount_amount)}}</span>
            </el-descriptions-item>
            <template v-if="voucherDetail.reward_type !== 1">
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        最高优惠金额
                    </template>
                    {{voucherDetail.max_price}}
                    <span class="gc-cny">{{getCNY(voucherDetail.max_price)}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        价格范围
                    </template>
                    {{voucherDetail.min_basket_price}}-{{(voucherDetail.max_price / voucherDetail.percentage * 100).toFixed(2)}}
                    <span class="gc-cny">{{getCNY(voucherDetail.min_basket_price)}}-{{getCNY(voucherDetail.max_price / voucherDetail.percentage * 100)}}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        优惠范围
                    </template>
                    {{(voucherDetail.min_basket_price * voucherDetail.percentage / 100).toFixed(2)}}-{{voucherDetail.max_price}}
                    <span class="gc-cny">{{getCNY(voucherDetail.min_basket_price * voucherDetail.percentage / 100)}}-{{getCNY(voucherDetail.max_price)}}</span>
                </el-descriptions-item>
            </template>

        </el-descriptions>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleFlashSale = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisibleFlashSale = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {
    shopIdInShopee,
    PCT
} from '@/constants/shopee.js'
import {
    voucher
} from '@/constants/voucher.js'
import {
    getVoucherList,
    getVoucher,
    addVoucher,
    getFollowPrizeList,
    getFollowPrizeDetail,
    getDiscountList,
    addDiscount,
    getFlashSaleTimeSlotId,
    createFlashSale,
    getFlashSaleList
} from '@/apis/shopee.js'
import {
    addDefaultDiscount,
    getDefaultDiscount
} from '@/apis/activity.js'
// import {exchangeRate} from '@/constants/exchange.js'

export default {
  name: 'Promotion',
  props: ['exchangeRate'],
  data () {
    return {
        type: 'voucher',
        selectedStation: undefined,
        stations: Object.keys(shopIdInShopee),
        voucherTypes: {
            1: '固定折扣',
            2: '百分比',
            3: '返金币'
        },
        voucherData: [],
        discountData: [],
        defaultDiscountData: {},
        voucherDetail: {},
        dialogVisibleVoucher: false,
        dialogVisibleFlashSale: false,
        // exchangeRate,
        PCT: undefined,
        currentTimeSlotIdList: [],
        flashSaleData: [],
        flashSaleDetail: {}
    }
  },
  watch: {
    selectedStation () {
        this.empty()
        this.PCT = PCT[this.selectedStation]
        this.updateVoucherData()
    },
    type () {
        this.empty()
        if (!this.selectedStation) return

        this.updateVoucherData()
    }
  },
  created () {
  },
  methods: {
    empty () {
        this.voucherData = []
        this.discountData = []
    },
    updateVoucherData () {
        if (this.type === 'voucher') {
            getVoucherList({
                region: this.selectedStation,
                shop_id: shopIdInShopee[this.selectedStation],
                status: 'all'
            }).then(data => {
                this.voucherData = data.voucher_list
            })
        } else if (this.type === 'followPrize') {
            getFollowPrizeList({
                region: this.selectedStation,
                shop_id: shopIdInShopee[this.selectedStation],
                status: 'ongoing'
            }).then(data => {
                this.voucherData = data.follow_prize_list
            })
        } else if (this.type === 'discount') {
            getDiscountList({
                region: this.selectedStation,
                shop_id: shopIdInShopee[this.selectedStation],
                status: 'ongoing'
            }).then(data => {
                this.discountData = data.discount_list
            }).catch(err => {
                console.log(err)
            })

            getDefaultDiscount({
                region: this.selectedStation
            }).then(data => {
                this.defaultDiscountData = data.data[0]
            })
        }
    },
    getTimer (timestamp) {
        return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
    },
    viewDetail (promotion) {
        if (this.type === 'voucher') {
            this.viewVoucherDetail(promotion)
        } else if (this.type === 'followPrize') {
            this.viewFollowPrizeDetail(promotion)
        }
    },
    viewVoucherDetail (voucher) {
        this.voucherDetail = null
        getVoucher({
            region: this.selectedStation,
            shop_id: shopIdInShopee[this.selectedStation],
            voucher_id: voucher.voucher_id
        }).then(data => {
            this.voucherDetail = data
            this.dialogVisibleVoucher = true
        })
    },
    viewFollowPrizeDetail (prize) {
        this.voucherDetail = null
        getFollowPrizeDetail({
            region: this.selectedStation,
            shop_id: shopIdInShopee[this.selectedStation],
            campaign_id: prize.campaign_id
        }).then(data => {
            this.voucherDetail = data
            this.voucherDetail.min_basket_price = data.min_spend
            this.voucherDetail.voucher_code = data.follow_prize_name
            this.dialogVisibleVoucher = true
        })
    },
    viewFlashSaleDetail (flash) {
        this.dialogVisibleFlashSale = true
    },
    getCNY (origin) {
        if (!this.selectedStation) return
        return (origin / this.exchangeRate[this.selectedStation.slice(0, 2)]).toFixed(2)
    },
    setDefaultDiscount (data) {
        addDefaultDiscount({
            region: this.selectedStation,
            discount_id: data.discount_id,
            shop_id: shopIdInShopee[this.selectedStation]
        }).then(data => {
            if (data.code === 0 && data.data.text === 'success') {
                this.$message.success('设置默认折扣成功')
            }
        })
    },
    adoptTime () {
        // 从下周二到下周一
        let now = new Date()
        let nowDay = now.getDay()
        let nowTimer = now.getTime()
        let plusDays = 0

        if (nowDay === 0) {
            plusDays = 2
        } else if (nowDay === 1) {
            plusDays = 1
        } else {
            plusDays = 9 - nowDay
        }

        let startTime = (new Date(nowTimer + plusDays * 24 * 60 * 60 * 1000)).setHours(0, 0, 0, 0)
        let endTime = startTime + 7 * 24 * 60 * 60 * 1000

        return {
            startTime,
            endTime
        }
    },
    adoptTimeWholeWeek () {
        let now = new Date()
        // let nowDay = now.getDay()
        let nowTimer = now.getTime()
        // let plusDays = 0

        // if (nowDay === 0) {
        //     plusDays = 1
        // } else {
        //     plusDays = 8 - nowDay
        // }

        // let startTime = (new Date(nowTimer + plusDays * 24 * 60 * 60 * 1000)).setHours(0, 0, 0, 0)
        let startTime = (new Date(nowTimer + 1 * 24 * 60 * 60 * 1000)).setHours(0, 0, 0, 0)
        let endTime = startTime + 7 * 24 * 60 * 60 * 1000 - 1000

        return {
            startTime,
            endTime
        }
    },
    createVoucherThree () {
        const timer = this.adoptTime()
        const regionVoucher = voucher[this.selectedStation.slice(0, 2)]

        regionVoucher.three.forEach((item, index) => {
            let params = {
                voucher_name: `${index + 1}门槛优惠券${timer.startTime / 1000}`,
                voucher_code: `${(timer.startTime.toString()).slice(6, 8)}${shopIdInShopee[this.selectedStation].toString().slice(0, 2)}${index}`,
                start_time: timer.startTime / 1000,
                end_time: timer.endTime / 1000,
                voucher_type: 1,
                reward_type: regionVoucher.reward_type,
                usage_quantity: 200000,
                min_basket_price: item.min_basket_price,
                display_channel_list: [1],
                shop_id: shopIdInShopee[this.selectedStation]
                // display_start_time: timer.startTime / 1000
            }

            if (regionVoucher.reward_type === 1) {
                params.discount_amount = item.discount_amount
            } else if (regionVoucher.reward_type === 2) {
                params.percentage = item.percentage
                params.max_price = item.max_price
            }

            addVoucher(params).then(data => {
                if (data.response && data.response.voucher_id) {
                    this.$message.success(`优惠券创建成功${data.response.voucher_id}`)
                } else {
                    this.$message.error(`优惠券创建失败${data.message}`)
                }
            })
        })
    },
    copyDiscount (data) {
        this.$confirm('复制相同时间段的折扣?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            addDiscount({
                discount_name: `${data.discount_name.slice(0, 10)}${Date.now()}`,
                start_time: Math.floor(Date.now() / 1000) + 60,
                end_time: data.end_time,
                shop_id: Number(this.defaultDiscountData.shop_id)
            }).then(result => {
                if (result && result.discount_id) {
                    this.$message.success('复制成功')
                } else {
                    this.$message.error('未成功')
                }
            })
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
        })
    },
    selectStationFlashSale () {
        this.currentTimeSlotIdList = []
        const timer = this.adoptTimeWholeWeek()
        const shopId = shopIdInShopee[this.selectedStation]
        getFlashSaleTimeSlotId({
            shop_id: shopId,
            start_time: timer.startTime / 1000,
            end_time: timer.endTime / 1000
        }).then(data => {
            this.currentTimeSlotIdList = data
        })

        getFlashSaleList({
            type: [1, 2],
            shop_id: shopIdInShopee[this.selectedStation]
        }).then(data => {
            this.flashSaleData = data.flash_sale_list
        })
    },
    handleCreateFlashSale () {
        if (!this.currentTimeSlotIdList || !this.currentTimeSlotIdList.length) {
            this.$message.error('创建错误或已创建')
            return
        }
        this.currentTimeSlotIdList.forEach(item => {
            createFlashSale({
                shop_id: shopIdInShopee[this.selectedStation],
                timeslot_id: item.timeslot_id
            }).then(data => {
                if (data && data.status === 1) {
                    this.$message.success('店内秒杀创建成功')
                } else {
                    this.$message.error('店内秒杀创建失败')
                }
            })
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gc-cny {
    color: red;
}
</style>
