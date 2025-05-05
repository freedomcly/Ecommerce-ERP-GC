<template>
  <div class="page-content">
    <div>
        <el-date-picker
            v-model="selectedDeliveryDate"
            :picker-options="pickerOptions"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发货日"
            size="mini">
        </el-date-picker>
        <el-date-picker
            v-model="selectedDeliveryDateTime"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp" size="mini">
        </el-date-picker>
        <el-select v-model="selectedPlatform" placeholder="选择平台" clearable size="mini">
            <el-option
                v-for="item in platform"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
        </el-select>
        <el-select v-model="selectedRegion" placeholder="选择地区" clearable size="mini">
            <el-option
                v-for="item in region"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
        </el-select>
        <el-select v-model="selectedStatus" placeholder="选择状态" clearable size="mini">
            <el-option
                v-for="(item, key) in statusMapOrder"
                :key="key"
                :label="item"
                :value="key">
            </el-option>
        </el-select>
        <el-select v-model="selectedCutOffTag" placeholder="选择截单" clearable size="mini">
            <el-option
                v-for="(item, index) in cutOffTag"
                :key="index"
                :label="item"
                :value="item">
            </el-option>
        </el-select>
        <el-button v-if="selectedCutOffTag && selectedCutOffTag !=='未截单'" @click="getPurchasingReport" size="mini">获取采购报告</el-button>
        <el-input v-model="orderId" placeholder="订单编号" size="mini"></el-input>
        <el-input v-model="productId" placeholder="全球商品货号" size="mini"></el-input>
        <el-date-picker
            v-model="selectedGenerateDate"
            :picker-options="pickerOptionsGenerateDate"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            placeholder="选择订单生成日"
            size="mini"
            clearable>
        </el-date-picker>
        <el-button @click="searchOrder" size="mini">搜索</el-button>
    </div>
    <div>
        <el-tooltip class="item" effect="dark" content="本页如有标注商品状态或其他操作，点击生成拣货单前请先刷新页面" placement="top-start">
            <el-button @click="generatePickingList(1)" size="mini">生成拣货单</el-button>
        </el-tooltip>
        <el-button v-if="role !== 2" @click="generatePackingList(false)" size="mini">生成打包单</el-button>
        <el-button @click="generatePackingList(true)" size="mini">当日发货</el-button>
    </div>
    <div>
        <el-button @click="handleGenerateFirstMileTrackingNumber" size="mini">
            <span v-if="!firstMileTrackingNumber">生成当日揽货批次号</span>
            <span v-else>{{firstMileTrackingNumber}}</span>
        </el-button>
        <el-button @click="copyFirstMileTrackingNumber" size="mini">复制</el-button>
        <el-button v-if="firstMileTrackingNumber && role !== 2" @click="reGenerateFirstMileTrackingNumber" size="mini">重新生成</el-button>
        <!-- <el-button @click="handleExpressage" size="mini">快递发货预报</el-button> -->
        <!-- <el-button @click="generateNumber" size="mini">生成送仓数量</el-button> -->
    </div>
    <div>
        <el-button v-if="role !== 2" @click="generatePickingList(2)" type="text" size="mini">按采购数排序</el-button>
        <el-button v-if="role !== 2" @click="generatePickingList(3)" type="text" size="mini">按采购款排序</el-button>
        <el-button @click="toPurchaseNote" type="text" size="mini">历史采购报告</el-button>
    </div>
    <div>
        <el-button @click="select50" type="text" size="mini">选择前50</el-button>
        <el-button @click="selectVersa" type="text" size="mini">反选</el-button>
    </div>
    <div>
        <el-button v-if="isSentAllShow" @click="sentAll" size="mini">全部标记为已送仓</el-button>
    </div>
    <el-table
      :data="orderList"
      style="width: 100%"
      ref="orderList"
      :default-sort = "{prop: '_id', order: 'ascending'}"
      @selection-change="selectOrderList">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
      <el-table-column
        prop="_id"
        :label="`订单编号(共${orderList.length}单)`"
        width="220"
        sortable>
            <template slot-scope="scope">
                <el-link @click="viewOrderDetail(scope.row)" type="primary">{{scope.row._id}}</el-link>
                <el-tag v-if="scope.row.status === 19" type="warning" size="mini">紧急</el-tag>
                <el-tag v-if="scope.row.status === 20" type="danger" size="mini">当日到仓</el-tag>
            </template>
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台"
        width="100">
      </el-table-column>
      <el-table-column
        prop="region"
        label="站点"
        width="100"
        sortable>
      </el-table-column>
      <el-table-column
        prop="status"
        label="本地状态">
        <template slot-scope="scope">
            <!-- <el-tag size="small" :type="statusColorMap[scope.row.status]">{{statusMap[scope.row.status]}}</el-tag> -->
            <el-tag size="small" :type="statusColorMap[generateOrderStatus(scope.row)]">{{statusMap[generateOrderStatus(scope.row)]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="打包时间"
        sortable>
        <template slot-scope="scope">
            <div>{{getTimer(scope.row.delivery_date_timestamp / 1000)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="delivery_date"
        label="发货日">
      </el-table-column>
      <el-table-column
        label="送仓时间">
        <template slot-scope="scope">
            <div>{{getTimer(scope.row.transport_timestamp / 1000)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="质检结果">
        <template slot-scope="scope">
            <div>
                <el-button v-if="scope.row.items.some(item => item.quality && item.quality.length)" @click="viewOrderDetail(scope.row)" type="danger" size="mini" round plain>!</el-button>
            </div>
        </template>
      </el-table-column>
        <el-table-column
            v-if="role !== 2"
            label="操作">
            <template slot-scope="scope">
                <el-button @click="viewOrderDetail(scope.row)" type="text" size="small">查看</el-button>
                <!-- <el-button @click="emptyItems(scope.row)" type="text" size="small">清空Items</el-button> -->
                <el-button v-if="role !== 2" @click="deleteOrderFromDelivery(scope.row)" type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog :title="`订单详情 ${currentOrderDetail.region} - ${currentOrderDetail.order_sn}`" :visible.sync="dialogOrderVisible" width="80%">
        <div v-if="currentOrderDetail.platform === 'lazada'">
            <span class="gc-red">Lazada订单 单独发货</span>
        </div>
        <div>
            <el-tag v-if="currentOrderDetail.status === 19" type="warning">紧急</el-tag>
            <el-tag v-if="currentOrderDetail.status === 20" type="danger">当日到仓</el-tag>
            <el-tag v-if="currentOrderDetail.days_to_ship > 2" type="success">预购（出货时间{{currentOrderDetail.days_to_ship}}天）</el-tag>
        </div>
        <div>
            <span>订单创建时间{{getTimer(currentOrderDetail.create_time)}} - </span>
            <span v-if="currentOrderDetail.pay_time">订单支付时间{{getTimer(currentOrderDetail.pay_time)}} - </span>
            <span>{{currentOrderDetail.cod ? '货到付款' : '已支付'}}</span>
        </div>
        <el-table
            :data="currentOrderDetail.item_list"
            style="width: 100%">
            <el-table-column
                prop="model_quantity_purchased"
                label="数量"
                width="60">
                <template slot-scope="scope">
                    <span :class="{ 'gc-red': scope.row.model_quantity_purchased > 1}">{{scope.row.model_quantity_purchased}}个</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                label="货价"
                width="60">
                <template slot-scope="scope">
                    <span v-if="productsInfo[scope.row.item_sku]">{{calculateSinglePrice(scope.row)}}元</span>
                    <span v-else>未获取</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="role !== 2"
                prop="model_discounted_price"
                label="售价"
                width="60">
                <template slot-scope="scope">
                    <div>{{scope.row.model_discounted_price}}</div>
                    <div>{{(scope.row.model_discounted_price / exchangeRate[currentOrderDetail.region]).toFixed(2)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="image_info.image_url"
                label="SKU图"
                width="210">
                <template slot-scope="scope">
                    <div :style="`background-image: url(${getVNImageUrl(scope.row.image_info.image_url)});`" @click="toCGItem(scope.row)" class="gc-back-image-detail"></div>
                    <div>
                        <!-- <el-button @click="openImage(scope.row.image_info.image_url)" type="text" size="mini">大图链接</el-button> -->
                        <el-button @click="openImageInPage(scope.row.image_info.image_url)" type="text" size="mini">打开大图</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="model_name"
                label="型号"
                width="210">
                <template slot-scope="scope">
                    {{adoptModel(scope.row.model_name)}}
                </template>
            </el-table-column>
            <el-table-column
                v-if="currentOrderDetail.platform === 'shopee'"
                prop=""
                label="配件"
                width="180">
                <template slot-scope="scope">
                    <div v-if="productsInfo[scope.row.model_sku.split('-')[0]] && productsInfo[scope.row.model_sku.split('-')[0]].sku_info && productsInfo[scope.row.model_sku.split('-')[0]].sku_info[scope.row.model_sku.split('-')[1]]">
                        <div v-for="(item, index) in productsInfo[scope.row.model_sku.split('-')[0]].sku_info[scope.row.model_sku.split('-')[1]]" :key="index">
                            <el-tag size="mini" type="danger">{{skuInfoMap[item.type]}}</el-tag>
                        </div>
                    </div>
                    <div v-else>
                        <el-tag size="mini">无配件</el-tag>
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column
                prop=""
                label="质检"
                width="280">
                <template slot-scope="scope">
                    <div v-if="productsInfo[scope.row.item_sku]">
                        <el-checkbox v-for="(item, key) in productsInfo[scope.row.item_sku].quality_control" :label="qc[item]" :key="key"></el-checkbox>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column
                prop=""
                label="标记"
                width="110">
                <template slot-scope="scope">
                    <ItemStatusRemarker
                        :statusList="statusList"
                        :data="scope.row"
                        :role="role"
                        :status="scope.row.model_sku && currentItemsMap[scope.row.model_sku] && currentItemsMap[scope.row.model_sku].status"
                        @mark-item-status="markOrderItemStatus"
                    ></ItemStatusRemarker>
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <!-- <div class="gc-link"><el-link @click="toCGItem(scope.row)" type="primary">编辑CG商品</el-link></div> -->
                    <div v-if="role !== 2" class="gc-link"><el-link @click="toItemPage(scope.row)" type="primary">商品落地页</el-link></div>
                    <!-- <div class="gc-link"><el-link @click="toEditGlobalItem(scope.row)" type="primary">编辑虾皮全球商品</el-link></div> -->
                    <div v-if="role !== 2" class="gc-link"><el-link @click="toEditItem(scope.row)" type="primary">编辑虾皮站点商品</el-link></div>
                    <div v-if="role !== 2" class="gc-link"><el-link @click="toItemOptimizing(scope.row)" type="primary">商品优化表格</el-link></div>
                    <div v-if="universalTypes.indexOf(scope.row.model_name.split(',')[1]) >= 0" class="gc-link">
                        <el-link @click="printTypeTag(scope.row, 1)" type="primary">打印通用标</el-link>
                        <el-link @click="printTypeTag(scope.row, 2)" type="primary">通用标文件</el-link>
                    </div>
                    <div class="gc-link"><el-link @click="generateTag(scope.row)" type="primary">入库</el-link></div>
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="供应商商品名称"
                width="180">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.name_by_supplier}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                v-if="role !== 2"
                prop=""
                label="采购单"
                width="180">
                <template slot-scope="scope">
                    <div>
                        <div v-for="item in scope.row.cutOff" :key="item">
                            <el-tag size="mini" :type="(scope.row.billTag && scope.row.billTag.length && scope.row.billTag.indexOf(item) >= 0) ? 'success' : ''">{{item}}</el-tag>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="质检"
                width="280">
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.quality_control && scope.row.quality_control.length">
                            <div>质检建议:</div>
                            <div v-for="item in scope.row.quality_control" :key="item">{{qc[item]}}</div>
                        </div>
                        <div>
                            <div>质检结果:</div>
                            <el-select v-model="scope.row.quality" @change="changeQuality(scope.row)" multiple placeholder="请选择" size="mini">
                                <el-option
                                  v-for="(item, key) in qualityMap"
                                  :key="key"
                                  :label="item"
                                  :value="key"
                                  size="mini">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-descriptions :column="3" border>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-tickets"></i>订单状态</template>
            <div>
                <el-tag :type="adoptOrderType(currentOrderDetail.order_status)" size="small">{{currentOrderDetail.order_status}}</el-tag>
                <span v-if="currentOrderDetail.order_status === 'CANCELLED' || currentOrderDetail.order_status === 'IN_CANCEL'" class="gc-red">订单已取消 无需发货</span>
            </div>
            <div v-if="getOrderReturnStatus(currentOrderDetail)"><el-tag type="danger" size="small">{{getOrderReturnStatus(currentOrderDetail)}}</el-tag></div>
            <div v-if="currentOrderDetail.order_status === 'READY_TO_SHIP'">
                <el-button @click="handleShipOrder" size="small">手动出货</el-button>
            </div>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-tickets"></i>配送状态</template>
            <span v-if="Object.keys(currentOrderDetail).length && (currentOrderDetail.item_list && currentOrderDetail.item_list.length) && (currentOrderDetail.package_list && currentOrderDetail.package_list.length)">
                <div v-if="currentOrderDetail.platform === 'shopee'">
                    <el-tag :type="getStatusColor(currentOrderDetail)" size="small">{{getStatus(currentOrderDetail)}}</el-tag>
                    <div v-if="getShipByDateStatus(currentOrderDetail) === 'danger'"><el-tag type="danger" effect="dark" size="mini">{{getTimer(currentOrderDetail.ship_by_date)}}</el-tag></div>
                    <div v-if="currentOrderDetail.pickup_done_time">
                        <div>扫描时间{{getTimer(currentOrderDetail.pickup_done_time)}}</div>
                        <div>最晚到仓{{calculateDeadline(currentOrderDetail.pickup_done_time, currentOrderDetail.ship_by_date)}}</div>
                        <div>更新时间{{getTimer(currentOrderDetail.update_time)}}</div>
                    </div>
                    <div v-if="calculate48Hours(currentOrderDetail)">
                        <el-tag type="warning" effect="dark" size="mini">已超48小时</el-tag>
                    </div>
                </div>
                <el-tag v-else size="small">{{currentOrderDetail.item_list[0].status}}</el-tag>
            </span>
        </el-descriptions-item>
        <el-descriptions-item v-if="role !== 2">
            <template slot="label"><i class="el-icon-user"></i>买家名称</template><span>{{ currentOrderDetail.buyer_username }}</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="role !== 2">
            <template slot="label"><i class="el-icon-takeaway-box"></i>包装材料</template><span>{{packingRecommendation}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-takeaway-box"></i>重量</template>
            <span v-if="currentOrderDetail.order_chargeable_weight_gram">{{currentOrderDetail.order_chargeable_weight_gram}}g</span>
            <span v-else>待定</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="role !== 2 || gift">
            <template slot="label"><i class="el-icon-present"></i>礼物</template>
            <span class="gc-red">{{gift}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-money"></i>订单货价</template>
            <span>{{ currentOrderDetail.orderCost }}元</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-chat-line-square"></i>买家留言</template><span class="gc-red">{{currentOrderDetail.message_to_seller}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-edit-outline"></i>卖家评论</template><span class="gc-red">{{currentOrderDetail.note}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label"><i class="el-icon-edit-outline"></i>发货备注</template><span>{{currentOrderDetail.shippingRemark}}</span>
            <el-button @click="openRemark" size="mini">编辑发货备注</el-button>
        </el-descriptions-item>
        <el-descriptions-item>
            <template v-if="role !== 2" slot="label"><i class="el-icon-coin"></i>账单</template>
            <span v-show="role !== 2">
                <span v-if="currentOrderDetail.billDetail && (currentOrderDetail.order_chargeable_weight_gram || currentOrderDetail.order_chargeable_weight_gram === 0)">
                    <Bill
                        :billDetail="currentOrderDetail.billDetail.order_income"
                        :region="currentOrderDetail.region"
                        :cost="currentOrderDetail.orderCost"
                        :exchangeRate="exchangeRate"
                        :weight="currentOrderDetail.order_chargeable_weight_gram"
                        @profit="listenProfit"
                    ></Bill>
                </span>
            </span>
        </el-descriptions-item>
        </el-descriptions>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="previous" type="primary">上一个</el-button>
            <el-button @click="next" type="primary">下一个</el-button> -->
            <div>
                <el-button v-if="getOrderReturnStatus(currentOrderDetail) === 'RETURN'" @click="handleDownloadWaybillFromAliyun" type="primary">退货争议面单打印</el-button>
                <el-button v-if="role === 2 && !currentOrderDetail.delivery_date_timestamp" @click="handleDownloadWaybillFromAliyun" type="primary" :disabled="!isDownloadAliyunWaybillAbled">出库</el-button>
                <el-button v-if="role !== 2" @click="handleDownloadWaybillFromAliyun" type="primary">VIP 出库</el-button>
                <el-button @click="handleDownloadWaybill" :disabled="!isDownloadWaybillAbled" type="primary">下载面单<span>{{ currentOrderDetail.waybill_download_num }}</span></el-button>
                <el-button v-if="role !== 2" @click="handleGetShippingDocumentDataInfo" type="primary">面单信息</el-button>
                <el-button @click="handleBindFirstMile('manual')" type="primary">绑定首公里</el-button>
            </div>
            <!--
            <div style="margin-top: 10px;">
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 17)" :disabled="currentOrderDetail.status === 17">标记为{{statusMap[17]}}</el-button>
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 16)" :disabled="currentOrderDetail.status === 16">标记为{{statusMap[16]}}</el-button>
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 15)" :disabled="currentOrderDetail.status === 15">标记为{{statusMap[15]}}</el-button>
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 14)" :disabled="currentOrderDetail.status === 14">标记为{{statusMap[14]}}</el-button>
            </div>
            -->
            <div style="margin-top: 10px;">
                <el-button v-if="role !== 2" @click="markOrderStatus(currentOrderDetail.order_sn, 21)" :disabled="currentOrderDetail.status === 21">标记为{{statusMap[21]}}</el-button>
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 20)" :disabled="currentOrderDetail.status === 20">标记为{{statusMap[20]}}</el-button>
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 19)" :disabled="currentOrderDetail.status === 19">标记为{{statusMap[19]}}</el-button>
                <el-button v-if="role !== 2" @click="markOrderStatus(currentOrderDetail.order_sn, 13)" :disabled="currentOrderDetail.status === 13">标记为{{statusMap[13]}}</el-button>
                <el-button v-if="role !== 2" @click="markOrderStatus(currentOrderDetail.order_sn, 5)" :disabled="currentOrderDetail.status === 5">标记为{{statusMap[5]}}</el-button>
                <!-- <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 1)" :disabled="currentOrderDetail.status === 1">标记为{{statusMap[1]}}</el-button> -->
                <el-button v-if="role !== 2" @click="markOrderStatus(currentOrderDetail.order_sn, 6)" :disabled="currentOrderDetail.status === 6">标记为{{statusMap[6]}}</el-button>
                <!-- <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 4)" :disabled="currentOrderDetail.status === 4">标记为{{statusMap[4]}}</el-button> -->
                <!-- <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 2)" :disabled="currentOrderDetail.status === 2">标记为{{statusMap[2]}}</el-button> -->
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 0)">标记为{{statusMap[0]}}</el-button>
                <!-- <el-button @click="confirmOrderDetail">确定</el-button> -->
            </div>
            <div style="margin-top: 10px;">
                <el-button @click="markOrderStatus(currentOrderDetail.order_sn, 3)" :disabled="currentOrderDetail.status === 3 || currentOrderDetail.delivery_date_timestamp" type="success">标记为{{statusMap[3]}}</el-button>
            </div>
            <div v-if="currentOrderDetail.delivery_date_timestamp" style="margin-top: 10px;">打包时间{{getTimer(currentOrderDetail.delivery_date_timestamp / 1000)}}</div>
        </div>
    </el-dialog>
    <el-dialog title="拣货单" :visible.sync="dialogPickingVisible" fullscreen>
        <PickingList :picking-list="pickingList" :is-report="Boolean(false)"
            :order-list-map="selectedOrderListMap"
            :download-msg.sync="pickingDownloadMsg"
            :products-info="productsInfo"
            @trans-tags="receiveTags"
            @mark-item-status="completePickingItem"
            @open-order="openOrder"
            @check-account="checkAccount"
            @remove-from-picking-list="removeFromPickingList"
            @remove-item-from-picking-list="removeItemFromPickingList"
        ></PickingList>
        <div>
            <el-date-picker
                v-model="buyStartTime"
                type="datetime"
                placeholder="选择出发时间"
                default-time="12:00:00">
            </el-date-picker>
            <el-date-picker
                v-model="buyReturnTime"
                type="datetime"
                placeholder="选择完成时间"
                default-time="12:00:00">
            </el-date-picker>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cutOff">采购截单</el-button>
            <!-- <el-button @click="generatePurchasingReport">修改采购报告</el-button> -->
            <el-button @click="downloadPickingPng">下载拣货单图片</el-button>
            <el-button v-if="role !== 2" @click="downloadPickingExcel">下载拣货单表格</el-button>
        </div>
    </el-dialog>
    <el-dialog
        :title="`打包单`"
        :visible.sync="dialogPackingVisible"
        fullscreen
        @close="closePackingDialog">
        <div v-if="isCompleting">
            <div v-if="role !== 2">
                <el-button @click="calculateProfit">计算</el-button>
                <div>今日收入：{{totalIncome.toFixed(2)}} <span>(包含Shopee)</span></div>
                <div>今日客单价(包含运费): {{(CT / orderList.length).toFixed(2)}}</div>
                <div>今日客单价(扣除运费和优惠券): {{(CTPure / orderList.length).toFixed(2)}}</div>
                <div>今日货单价: {{(unitPrice / orderList.length).toFixed(2)}}</div>
                <div>今日客单打款收入：{{(totalIncome / orderList.length).toFixed(2)}} <span>(包含Shopee)</span></div>
                <div>今日货价：{{totalCost}} <span>(包含Shopee和lazada)</span></div>
                <div>今日利润(扣除货价)：{{totalProfit.toFixed(2)}} <span>(包含Shopee和lazada)</span></div>
                <div>今日利润(扣除其他成本)：{{netProfit.toFixed(2)}} <span>(包含Shopee)</span></div>
                <div>今日利润(扣除货价)每单：{{(totalProfit / orderList.length).toFixed(2)}} <span>(包含Shopee和lazada)</span></div>
                <div>今日利润(扣除其他成本)每单：{{(netProfit / orderList.length).toFixed(2)}} <span>(包含Shopee和lazada)</span></div>
                <div>今日采购人力: {{purchaseManpowerCost}}</div>
                <div>今日打包人力: {{packingManpowerCost}}</div>
                <div>今日打包包材: {{packingMaterialsCost}}</div>
            </div>
            <div>
                <div>今日退货量: {{totalReturnNum}}</div>
                <div>今日取消量: {{totalCancelNum}}</div>
            </div>
        </div>
        <el-table
            :data="packingList"
            stripe
            border
            ref="packingDom"
            style="width: 100%">
            <el-table-column
                prop="order_sn"
                :label="`订单编号(共${packingList.length}单)`"
                width="180"
                sortable>
                <template slot-scope="scope">
                    <el-link @click="openOrder(scope.row.order_sn)" type="primary">{{scope.row.order_sn}}</el-link>
                    <!-- <span>{{scope.row.order_sn}}</span> -->
                    <strong>({{scope.row.item_list.reduce((accumulator, curr) => accumulator + curr.model_quantity_purchased, 0)}})</strong>
                    <i @click="copyOrderSN(scope.row.order_sn)" class="el-icon-copy-document"></i>
                    <div v-if="scope.row.package_number">{{scope.row.package_number}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="region"
                label="站点"
                width="60">
            </el-table-column>
            <!-- <el-table-column
                prop="days_to_ship"
                label="预售"
                width="100"
                sortable>
            </el-table-column> -->
            <el-table-column
                :label="`商品(共${packingListItemNum}个)`"
                width="560">
                <template slot-scope="scope">
                    <el-table
                        :data="scope.row.item_list"
                        :show-header="false"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="model_quantity_purchased"
                            label="数量"
                            width="60">
                            <template slot-scope="scope">
                                <span :class="{ 'gc-red': scope.row.model_quantity_purchased > 1}">{{scope.row.model_quantity_purchased}}个</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="image_info.image_url"
                            label="SKU图"
                            :width="isCompleting ? 100 : 110">
                            <template slot-scope="scope">
                                <div :style="`background-image: url(${getVNImageUrl(scope.row.image_info.image_url)});`" @click="toCGItem(scope.row)" class="gc-back-image"></div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="model_name"
                            label="型号">
                        </el-table-column>
                        <el-table-column
                            v-if="isCompleting"
                            prop=""
                            label="货价"
                            width="70">
                            <template slot-scope="scope">
                                <span v-if="productsInfo[scope.row.item_sku]">{{calculateSinglePrice(scope.row)}}元</span>
                                <span v-else>未获取</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="role !== 2"
                            prop="model_discounted_price"
                            label="售价"
                            width="60">
                            <template slot-scope="scope2">
                                <div>{{scope2.row.model_discounted_price}}</div>
                                <div>{{(scope2.row.model_discounted_price / exchangeRate[scope.row.region]).toFixed(2)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop=""
                            label="配件">
                            <template slot-scope="scope">
                                <div v-if="productsInfo[scope.row.model_sku.split('-')[0]] && productsInfo[scope.row.model_sku.split('-')[0]].sku_info && productsInfo[scope.row.model_sku.split('-')[0]].sku_info[scope.row.model_sku.split('-')[1]]">
                                    <div v-for="(item, index) in productsInfo[scope.row.model_sku.split('-')[0]].sku_info[scope.row.model_sku.split('-')[1]]" :key="index">
                                        <el-tag size="mini" type="danger">{{skuInfoMap[item.type]}}</el-tag>
                                    </div>
                                </div>
                                <div v-else>
                                    <el-tag size="mini">无配件</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="selectedOrderListMap[scope.row.order_sn]"
                            prop=""
                            label="标记"
                            width="120">
                            <template slot-scope="scope2">
                                <div v-if="selectedOrderListMap[scope.row.order_sn][scope2.row.model_sku]">
                                    <ItemStatusRemarker
                                        :role="role"
                                        :statusList="statusList"
                                        :data="scope2.row"
                                        :order="scope.row"
                                        :status="selectedOrderListMap[scope.row.order_sn][scope2.row.model_sku].status"
                                        @mark-item-status="completePickingItem"
                                    ></ItemStatusRemarker>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop=""
                            label="采购单"
                            width="120">
                            <template slot-scope="scope2">
                            <div>
                                <div v-for="item in scope2.row.cutOff" :key="item">
                                    <el-tag size="mini" :type="(scope.row.billTag && scope.row.billTag.length && scope2.row.billTag.indexOf(item) >= 0) ? 'success' : ''">{{item}}</el-tag>
                                </div>
                            </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="role !== 2"
                            prop="price_orientation"
                            label="价格定位"
                            width="100">
                            <template slot-scope="scope">
                                <span v-if="productsInfo[scope.row.item_sku.split('-')[0]].price_orientation">{{ priceOrientationMap[productsInfo[scope.row.item_sku.split('-')[0]].price_orientation].name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="role !== 2"
                            prop=""
                            label="上架天数"
                            width="160">
                            <template slot-scope="scope">
                                <div>上传天数: {{ Math.ceil((Date.now() - productsInfo[scope.row.item_sku.split('-')[0]].launch_time) / 1000 / 60 / 60 / 24)  }}</div>
                                <div>上传时间: {{ getTimer(productsInfo[scope.row.item_sku.split('-')[0]].launch_time / 1000, true) }}</div>
                            </template>
                        </el-table-column>
                        <!--
                        <el-table-column
                            v-if="isCompleting"
                            prop=""
                            label="">
                            <template slot-scope="scope">
                                <span>是否缺货</span>
                                <el-select v-model="scope.row.isStockout" placeholder="是否缺货" size="mini">
                                    <el-option
                                        v-for="(item, key) in yesOrNo"
                                        :key="key"
                                        :label="item"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="isCompleting"
                            prop=""
                            label="">
                            <template slot-scope="scope">
                                <span>是否瑕疵</span>
                                <el-select v-model="scope.row.hasFlaw" placeholder="是否瑕疵" size="mini">
                                    <el-option
                                        v-for="(item, key) in yesOrNo"
                                        :key="key"
                                        :label="item"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        -->
                    </el-table>
                </template>
            </el-table-column>
            <template v-if="!isCompleting">
                <el-table-column
                    prop="status"
                    label="本地状态"
                    width="160">
                    <template slot-scope="scope">
                        <el-tag size="small" :type="statusColorMap[scope.row.status]">{{statusMap[scope.row.status]}}</el-tag>
                    </template>
                </el-table-column>
            </template>
            <template v-if="isCompleting">
                <el-table-column
                    prop="orderCost"
                    label="订单货价"
                    width="100"
                    sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderCost}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="role !== 2"
                    prop="weight"
                    label="重量(g)"
                    width="160">
                    <template slot-scope="scope">
                        <!-- <el-input-number v-model="scope.row.weight" :min="0" :max="500" :precision="1" label="填入重量" size="mini"></el-input-number> -->
                        <div v-if="scope.row.order_chargeable_weight_gram" class="gc-weight"><el-tag>{{scope.row.order_chargeable_weight_gram}}</el-tag></div>
                    </template>
                </el-table-column>
                <!--
                <el-table-column
                    prop="packaging"
                    label="包装"
                    width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.packaging" placeholder="选择包装" size="mini">
                            <el-option
                            v-for="item in packaging"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="freebie"
                    label="礼物"
                    width="150">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.freebie" placeholder="选择礼物" size="mini" multiple>
                            <el-option
                            v-for="item in freebies"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                -->
                <el-table-column
                    v-if="role !== 2"
                    prop=""
                    label="账单(左边是最终数额，右边是GC系统估算数额)"
                    width="200">
                    <template slot-scope="scope">
                        <div v-if="scope.row.billDetail">
                            <Bill
                                :billDetail="scope.row.billDetail.order_income"
                                :region="scope.row.region"
                                :cost="scope.row.orderCost"
                                :exchangeRate="exchangeRate"
                                :weight="scope.row.order_chargeable_weight_gram"
                            ></Bill>
                        </div>
                        <div v-else-if="orderBillLazada[scope.row.order_sn]">
                            <div>
                                <span>商品收入(不含运费)</span>{{orderBillLazada[scope.row.order_sn].item_price_credit}}
                            </div>
                            <!-- <div><span>优惠券</span>{{scope.row.billDetail.voucher_from_seller}}</div> -->
                            <div>
                                <span>佣金</span>
                                {{orderBillLazada[scope.row.order_sn].commission}}
                                <strong>{{getProfitHereLazada(scope.row, orderBillLazada[scope.row.order_sn]).commissionFee.toFixed(2)}}</strong>
                            </div>
                            <div>
                                <span>交易手续费</span>
                                {{orderBillLazada[scope.row.order_sn].payment_fee.toFixed(2)}}
                                <strong>{{getProfitHereLazada(scope.row, orderBillLazada[scope.row.order_sn]).paymentFee.toFixed(2)}}</strong>
                            </div>
                            <div>
                                <span>国际运费</span>
                                {{orderBillLazada[scope.row.order_sn].international_shipping_fees}}
                            </div>
                            <div>
                                <span>末端运费</span>
                                {{orderBillLazada[scope.row.order_sn].domestic_shipping_fees}}
                            </div>
                            <div>
                                <span>买家支付运费</span>
                                {{orderBillLazada[scope.row.order_sn].shipping_fee}}
                            </div>
                            <div>
                                <span>最终收入</span>
                                {{orderBillLazada[scope.row.order_sn].income}}
                                <!-- <strong>{{getProfitHere(scope.row).income.toFixed(2)}}</strong> -->
                                <strong>(CNY{{(orderBillLazada[scope.row.order_sn].income / exchangeRate[scope.row.region.slice(0, 2)]).toFixed(2)}})</strong>
                            </div>
                            <div v-if="scope.row.orderCost">
                                <span>利润</span>
                                {{getLazadaProfit(scope.row)}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </template>
            <el-table-column
                prop="order_status"
                label="订单状态"
                width="160"
                sortable>
                <template slot-scope="scope">
                    <div><el-tag :type="adoptOrderType(scope.row.order_status)" size="small">{{scope.row.order_status}}</el-tag></div>
                    <div><el-tag v-if="scope.row.isReturn" type="danger" size="small">RETURN</el-tag></div>
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="配送状态"
                width="160">
                <template slot-scope="scope">
                    <div v-if="scope.row.platform === 'shopee'">
                        <div><el-tag :type="getStatusColor(scope.row)" size="small">{{getStatus(scope.row)}}</el-tag></div>
                        <div v-if="getShipByDateStatus(scope.row) === 'danger'"><el-tag type="danger" effect="dark" size="mini">{{getTimer(scope.row.ship_by_date)}}</el-tag></div>
                        <div v-if="scope.row.pickup_done_time">
                            <div>扫描时间{{getTimer(scope.row.pickup_done_time)}}</div>
                            <div>最晚到仓{{calculateDeadline(scope.row.pickup_done_time, scope.row.ship_by_date)}}</div>
                            <div>更新时间{{getTimer(scope.row.update_time)}}</div>
                        </div>
                        <div v-if="calculate48Hours(scope.row)">
                            <el-tag type="warning" effect="dark" size="mini">已超48小时</el-tag>
                        </div>
                    </div>
                    <el-tag v-else size="small">{{scope.row.item_list[0].status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="message_to_seller"
                label="买家留言"
                sortable>
                <template slot-scope="scope">
                    <span class="gc-red">{{scope.row.message_to_seller}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="note"
                label="卖家评论"
                sortable>
                <template slot-scope="scope">
                    <span class="gc-red">{{scope.row.note}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="note"
                label="发货备注"
                sortable>
                <template slot-scope="scope">
                    <span>{{scope.row.shippingRemark}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="action"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.order_status === 'PROCESSED' && scope.row.days_to_ship === 2" @click="handleBindFirstMile('downloadWaybill', {shopId: scope.row.shopId, orderSn: scope.row.order_sn, region: scope.row.region})" size="mini">绑定首公里</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-date-picker
                v-model="deliveryDate"
                type="date"
                value-format="timestamp"
                placeholder="发货日">
            </el-date-picker>
        </div>
        <span v-if="isCompleting" slot="footer" class="dialog-footer">
            <el-button @click="closePackingDialog">取 消</el-button>
            <el-button v-if="!selectedDeliveryDate && role !== 2" type="primary" @click="submitComplete">完成今日发货</el-button>
        </span>
        <span v-else slot="footer" class="dialog-footer">
            <el-button @click="downloadPackingPng">下载打包单图片</el-button>
            <el-button @click="generateTagsBatch">批量生成小标签</el-button>
        </span>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogTagsVisible"
        title="产品标签"
        fullscreen
        @close="closeTagsDialog">
        <div ref="printDom">
            <div v-for="(item, index) in tags" :key="index" class="gc-single-tag">
                <div>[{{ item.region }}]{{ item.order_sn }}</div>
                <div>1/{{ item.quantity }}</div>
                <div>{{ item.model_name.split(',')[0] }}</div>
                <div>{{ item.model_name.split(',')[1] }}</div>
                <div>{{ item.model_sku || item.item_sku }}</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeTagsDialog">取 消</el-button>
            <el-button @click="print">打 印</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="发货备注"
        :visible.sync="dialogRemarkVisible"
        width="30%"
        :before-close="closeRemark">
        <el-input
            v-model="shippingRemark"
            type="textarea"
            :rows="2"
            placeholder="请输入发货备注">
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeRemark">取 消</el-button>
            <el-button type="primary" @click="handleUpdateRemark">确 定</el-button>
        </span>
    </el-dialog>
    <ImagePreview
      :show="dialogImagePreviewVisible"
      :index="0"
      :current="currentPreviewImage"
      :isSimple="Boolean(1)"
      @close="closeDialogImagePreview"
    ></ImagePreview>
  </div>
</template>

<script>
import table2excel from 'js-table2excel'
// import {sheet2Workbook} from '@/utils/sheet'
// import XLSX from 'xlsx'
import _ from 'lodash'
import moment from 'moment'
// import {exchangeRate} from '@/constants/exchange.js'
import {getLodop} from '@/utils/LodopFuncs.js'

import {
    shopIdInShopee,
    // orderStatus,
    shopeeOrderContent,
    shopIdGift
} from '@/constants/shopee.js'
import {
    yesOrNo,
    platform,
    region,
    priceOrientationMap
} from '@/constants/normal.js'
import {
    universalTypes
} from '@/constants/brandCompatibility.js'
import {
    packaging,
    packagingInfo,
    qc
} from '@/constants/packaging.js'
import {
    freebies
} from '@/constants/freebie.js'
import {
    buildingWeight
} from '@/constants/supplier'
import {
    orderStatusMap,
    remarkOrderItemStatusList,
    statusColorMap
} from '@/constants/status'
import {accessoryType, color, qualityMap, texture} from '@/constants/product'
import {
    getOrder,
    editOrder,
    removeOrder,
    editOrderBatch,
    shipOrder
} from '@/apis/order.js'
import {
    addPurchaseNote,
    editPurchaseNote,
    getPurchaseNote
} from '@/apis/purchase.js'
import {
    getProductsBatch
} from '@/apis/product.js'
import {
    // getOrderList,
    // getChannelIdList,
    getOrderDetail,
    getEscrowDetail,
    bindFirstMile,
    downloadShippingDocument,
    createShippingDocument,
    getShippingDocumentResult,
    getTrackingNumber,
    generateFirstMileTrackingNumber,
    getShippingDocumentDataInfo,
    getFirstMileTrackingNumber
} from '@/apis/shopee.js'
import {
    getTransactionDetails,
    // getOrderLazada,
    getOrdersItems
} from '@/apis/orderLazada.js'
import {getSupplier} from '@/apis/supplier.js'
import {downloadPng, getDate, getSystemType} from '@/utils/index.js'
import {
    getProfit,
    getLazadaBill,
    getProfitLazada
} from '@/utils/profit.js'
import PickingList from '@/components/PickingList.vue'
import ItemStatusRemarker from '@/components/ItemStatusRemarker.vue'
import ImagePreview from '@/components/ImagePreview.vue'

import Bill from '@/components/Bill.vue'

export default {
  name: 'OrderDelivery',
  components: {
    PickingList,
    ItemStatusRemarker,
    Bill,
    ImagePreview
  },
  props: ['username', 'role', 'exchangeRate'],
  data () {
    return {
        universalTypes,
        qualityMap,
        priceOrientationMap,
        accessoryType,
        texture,
        skuInfoMap: {...accessoryType, ...color, ...texture},
        platform,
        region,
        qc,
        yesOrNo,
        packaging,
        packagingInfo,
        freebies,
        CT: 0,
        CTPure: 0,
        unitPrice: 0,
        orderList: [],
        selectedOrderList: [],
        selectedDeliveryDate: '',
        selectedDeliveryDateTime: '',
        selectedGenerateDate: '',
        selectedPlatform: '',
        selectedRegion: '',
        selectedStatus: '',
        selectedCutOffTag: '',
        pickerOptions: {
            disabledDate (time) {
                return time.getTime() > Date.now()
            }
        },
        pickerOptionsGenerateDate: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dialogOrderVisible: false,
        dialogPickingVisible: false,
        dialogPackingVisible: false,
        dialogTagsVisible: false,
        dialogRemarkVisible: false,
        currentOrderDetail: {},
        supplierData: {},
        pickingList: [],
        packingList: [],
        pickingListItemNum: 0,
        packingListItemNum: 0,
        isCompleting: false,
        deliveryDate: '',
        productsInfo: {},
        totalCost: 0,
        totalIncome: 0,
        totalProfit: 0,
        netProfit: 0,
        purchaseManpowerCost: 0,
        packingManpowerCost: 0,
        packingMaterialsCost: 0,
        statusMap: orderStatusMap,
        statusMapOrder: {
            3: '已打包',
            5: '已取消',
            6: '已沟通',
            18: '已送仓',
            13: '不发货',
            14: '拒收',
            15: '未送仓',
            16: '退货',
            17: '无法供应'
        },
        statusColorMap,
        statusList: remarkOrderItemStatusList,
        cutOffTag: ['未截单'],
        orderBillLazada: {},
        orderId: '',
        currentItemsMap: {},
        tags: [],
        firstMileTrackingNumber: '',
        pickingDownloadMsg: 0,
        buyStartTime: '',
        buyReturnTime: '',
        productId: '',
        totalReturnNum: 0,
        totalCancelNum: 0,
        gift: '',
        shippingRemark: '',
        dialogImagePreviewVisible: false,
        currentPreviewImage: {}
    }
  },
  computed: {
    isSentAllShow () {
        let show = false
        show = this.selectedOrderList.every(item => {
            return item.status === 3 && item.delivery_date === this.selectedDeliveryDate
        })
        return show
    },
    selectedOrderListMap () {
        let orderMap = {}
        this.selectedOrderList.forEach(item => {
            let itemsMap = {}
            item.items.forEach(subItem => {
                itemsMap[subItem.item_sku] = subItem
            })
            orderMap[item._id] = itemsMap
        })
        return orderMap
    },
    orderListMap () {
        const orderMap = {}
        this.orderList.forEach(item => {
            orderMap[item._id] = item
        })
        return orderMap
    },
    isDownloadWaybillAbled () {
        let isAllInStorage = true
        Object.keys(this.currentItemsMap).forEach(item => {
            if (this.currentItemsMap[item].status !== 9) {
                isAllInStorage = false
            }
        })
        if (['已到仓', '疑似到仓'].indexOf(this.getStatus(this.currentOrderDetail)) >= 0) {
            isAllInStorage = false
        }
        return isAllInStorage
    },
    isDownloadAliyunWaybillAbled () {
        let tmp = true

        if (this.currentOrderDetail.status === 3) {
            tmp = false
        }
        if (['SHIPPED', 'PROCESSED', 'TO_RETURN'].indexOf(this.currentOrderDetail.order_status) < 0) {
            tmp = false
        }
        if (['已到仓', '疑似到仓'].indexOf(this.getStatus(this.currentOrderDetail)) >= 0) {
            tmp = false
        }
        return tmp
    },
    packingRecommendation () {
        if (!this.currentOrderDetail.item_list) return ''
        const itemList = this.currentOrderDetail.item_list
        let packagingId = 1

        switch (itemList.length) {
            case 1:
                packagingId = 1
                break
            case 2:
                packagingId = 2
                break
            case 3:
                packagingId = 3
                break
            case 4:
                packagingId = 6
                break
        }

        if (itemList.length >= 4) {
            packagingId = 6
        }

        return packagingInfo[packagingId].name
    },
    disabledGeneratePurchasingReport () {
        if (!this.selectedOrderList.length) return false
        let disable = false
        let cutOff = this.selectedOrderList[0].cutoff
        this.selectedOrderList.forEach(item => {
            if (item.cutoff !== cutOff) {
                disable = true
            }
        })
        return disable
    }
  },
  created () {
    if (this.$route.query && this.$route.query.productId) {
        this.productId = this.$route.query.productId
    }
    this.searchOrder().then(data => {
        this.initCutOff(data)
    })
    this.searchFirstMileTrackingNumber()
    this.initSupplier()
  },
  methods: {
    changeQuality (data) {
        let orderListMap = {}
        this.orderList.forEach(item => {
            orderListMap[item._id] = item
        })

        let items = orderListMap[this.currentOrderDetail.order_sn].items
        let itemsMap = {}
        items.forEach(item => {
            itemsMap[item.item_sku] = item
        })

        let adoptedItems = []

        if (data.quality && itemsMap[data.model_sku]) {
            itemsMap[data.model_sku].quality = data.quality
            Object.keys(itemsMap).forEach(item => {
                adoptedItems.push(itemsMap[item])
            })
            editOrder({
                _id: this.currentOrderDetail.order_sn,
                items: adoptedItems
            }).then(data => {
                if (data.code === 0) {
                    this.$message.success(`更新成功`)
                    this.currentOrderDetail.item_list = adoptedItems
                } else {
                    this.$message.success('更新失败')
                }
            })
        } else {
            this.$message.error('更新失败')
        }
    },
    copyOrderSN (orderSN) {
        let url = orderSN
        let oInput = document.createElement('input')
        oInput.value = url
        document.body.appendChild(oInput)
        oInput.select() // 选择对象
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message({
            message: '复制成功',
            type: 'success'
        })
        oInput.remove()
    },
    removeFromPickingList (index) {
        this.pickingList.splice(index, 1)
        this.$forceUpdate()
    },
    removeItemFromPickingList (itemIndex, supplierIndex) {
        if (this.pickingList[supplierIndex].items.length === 1) {
            this.pickingList.splice(supplierIndex, 1)
        } else {
            this.pickingList[supplierIndex].items.splice(itemIndex, 1)
        }
        this.$forceUpdate()
    },
    openImage (url) {
        window.open(url)
    },
    openImageInPage (url) {
        this.dialogImagePreviewVisible = true
        this.currentPreviewImage = {url}
    },
    closeDialogImagePreview () {
        this.dialogImagePreviewVisible = false
        this.currentPreviewImage = null
    },
    select50 () {
        this.orderList.forEach((row, index) => {
            if (index < 50) {
                this.$refs.orderList.toggleRowSelection(row, true)
            } else {
                this.$refs.orderList.toggleRowSelection(row, false)
            }
        })
    },
    selectVersa () {
        this.orderList.forEach((row, index) => {
            this.$refs.orderList.toggleRowSelection(row)
        })
    },
    handleExpressage () {
        console.log('ing')
    },
    previous () {
        console.log('p')
    },
    next () {
        console.log('n')
    },
    initCutOff (data) {
        let cutOffTags = {}
        data.forEach(item => {
            item.items.forEach(subItem => {
                if (subItem.cutOff && subItem.cutOff.length) {
                    subItem.cutOff.forEach(cut => {
                        cutOffTags[cut] = 1
                    })
                }
            })
        })
        this.cutOffTag = [...Object.keys(cutOffTags), '未截单']
    },
    calculate48Hours (orderData) {
        if (['已扫描', '已到仓'].indexOf(this.getStatus(orderData)) >= 0) return false

        const payTime = orderData.pay_time
        const createTime = orderData.create_time
        let time
        const now = Date.now()
        const interval = 60 * 60 * 48 * 1000
        if (payTime) {
            time = payTime
        } else {
            time = createTime
        }

        if (now - time * 1000 > interval) return true

        return false
    },
    getSGImageUrl (url) {
        return `https://cf.shopee.sg/file/${url.split('/')[4]}`
    },
    getTHImageUrl (url) {
        return `https://cf.shopee.th/file/${url.split('/')[4]}`
    },
    getVNImageUrl (url) {
        return `https://cf.shopee.vn/file/${url.split('/')[4]}`
    },
    generateTagsBatch () {
        let tags = []
        this.packingList.forEach(item => {
            item.item_list.forEach(subItem => {
                if (!subItem.isTagPrint) {
                    for (let i = 0; i < subItem.model_quantity_purchased; i++) {
                        tags.push({
                            region: item.region,
                            order_sn: item.order_sn,
                            model_sku: subItem.model_sku,
                            model_name: subItem.model_name,
                            item_sku: subItem.item_sku,
                            order_num: item.item_list.length
                        })
                    }
                }
            })
        })

        this.tags = tags

        this.closePackingDialog()
        this.dialogTagsVisible = true
    },
    print () {
        let LODOP = getLodop()
        console.log(LODOP)
        let systemType = getSystemType()
        if (systemType === 'windows') {
            console.log(LODOP.VERSION)
            console.log(LODOP.GET_PRINTER_COUNT())
            LODOP.PRINT_INIT('miniTag')
            LODOP.SET_PRINT_PAGESIZE(1, 400, 300, 'miniTag')
            this.tags.forEach(tag => {
                LODOP.ADD_PRINT_TEXT(0, 0, 400, 20, `[${tag.region}]${tag.order_sn}`)
                LODOP.ADD_PRINT_TEXT(20, 0, 400, 20, `1/${tag.quantity}`)
                LODOP.ADD_PRINT_TEXT(40, 0, 400, 20, tag.model_name.split(',')[0])
                LODOP.ADD_PRINT_TEXT(60, 0, 400, 20, tag.model_name.split(',')[1])
                LODOP.ADD_PRINT_TEXT(80, 0, 400, 20, tag.model_sku || tag.item_sku)
                LODOP.NewPageA()
                this.completePickingItem(9, tag)
            })
            LODOP.SET_PRINTER_INDEX('HPRT D35')
            LODOP.PREVIEW()
            this.closeTagsDialog()
        } else {
            this.$print(this.$refs.printDom, {
                noPrint: '.noPrint',
                onStart: () => {
                    console.log('打印开始')
                },
                onEnd: () => {
                    console.log('打印完成')
                    this.closeTagsDialog()

                    this.tags.forEach(tag => {
                        this.completePickingItem(9, tag)
                    })
                }
            })
        }
    },
    generateTag (data) {
        let tags = [{
            region: this.currentOrderDetail.region,
            order_sn: this.currentOrderDetail.order_sn,
            model_sku: data.model_sku || data.item_sku,
            model_name: data.model_name,
            item_sku: data.item_sku,
            quantity: this.currentOrderDetail.item_list.length
        }]

        this.tags = tags

        this.dialogTagsVisible = true
    },
    receiveTags (tags) {
        if (tags.length) {
            this.tags = tags
            this.dialogTagsVisible = true
        } else {
            this.$message.error('没有可打印小标')
        }
    },
    getShipByDateStatus (data) {
        const nowTimeStamp = Date.now()
        const shopByDate = data.ship_by_date * 1000
        if (data.order_status === 'PROCESSED' || data.order_status === 'READY_TO_SHIP') {
            if (shopByDate - 60 * 60 * 24 * 1000 > nowTimeStamp) {
                return 'success'
            } else {
                return 'danger'
            }
        } else {
            return 'info'
        }
    },
    getTimer (timestamp, noTime) {
        if (!timestamp) return null
        if (noTime) return moment(timestamp * 1000).format('YYYY-MM-DD')
        return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
    },
    getLazadaProfit (row) {
        let orderBillLazada = this.orderBillLazada
        let profit = (orderBillLazada[row.order_sn].income / this.exchangeRate[row.region.slice(0, 2)] - row.orderCost).toFixed(2)
        this.orderBillLazada[row.order_sn].profit = profit
        return profit
    },
    tableRowClassName ({row, rowIndex}) {
        return `gc-row-${row.platform}`
    },
    getProfitHere (order) {
        return getProfit(this.exchangeRate, order.billDetail.order_income.cost_of_goods_sold, order.region.slice(0, 2), order.order_chargeable_weight_gram, order.orderCost || 0, order.billDetail.order_income.buyer_paid_shipping_fee, order.billDetail.order_income.voucher_from_seller)
    },
    getProfitHereLazada (order, bill) {
        return getProfitLazada(bill.item_price_credit, order.region.slice(0, 2), bill.shipping_fee)
    },
    calculateProfit () {
        let totalIncome = 0
        let totalProfit = 0
        let netProfit = 0
        let purchaseManpowerCost = 0
        let packingManpowerCost = 0
        let packingMaterialsCost = 0
        let CT = 0
        let CTPure = 0
        let unitPrice = 0
        this.packingList.filter(item => item.platform === 'shopee').forEach(item => {
            let orderIncome = item.billDetail.order_income.escrow_amount_after_adjustment / this.exchangeRate[item.region.slice(0, 2)]
            let orderProfit = orderIncome - item.orderCost
            let orderPurchaseManpowerCost = item.item_list.length * 2
            let orderPackingManpowerCost = 2
            let qcManpowerCost = item.item_list.length * 0.5
            let orderPackingMaterials = 1
            totalIncome += orderIncome
            totalProfit += orderProfit
            purchaseManpowerCost += orderPurchaseManpowerCost
            packingManpowerCost += orderPackingManpowerCost + qcManpowerCost
            packingMaterialsCost += orderPackingMaterials
            netProfit += orderProfit - orderPurchaseManpowerCost - orderPackingManpowerCost - qcManpowerCost - orderPackingMaterials
            CT += item.billDetail.order_income.buyer_total_amount / this.exchangeRate[item.region.slice(0, 2)]
            let CTPureSingle = (item.billDetail.order_income.buyer_total_amount - item.billDetail.order_income.buyer_paid_shipping_fee + item.billDetail.order_income.voucher_from_shopee + item.billDetail.order_income.voucher_from_seller) / this.exchangeRate[item.region.slice(0, 2)]
            CTPure += CTPureSingle
            let amountSingel = 0
            item.billDetail.order_income.items.forEach(subItem => {
                amountSingel += subItem.quantity_purchased
            })
            unitPrice += CTPureSingle / amountSingel
        })

        Object.keys(this.orderBillLazada).forEach(item => {
            totalProfit += Number(this.orderBillLazada[item].profit)
        })

        this.totalIncome = totalIncome
        this.totalProfit = totalProfit
        this.netProfit = netProfit
        this.purchaseManpowerCost = purchaseManpowerCost
        this.packingManpowerCost = packingManpowerCost
        this.packingMaterialsCost = packingMaterialsCost
        this.CT = CT
        this.CTPure = CTPure
        this.unitPrice = unitPrice
    },
    getBillDetail (order) {
        return new Promise(resolve => {
            getEscrowDetail({
                order_sn: order.order_sn,
                shop_id: order.shop_id || shopIdInShopee[order.region],
                region: order.region
            }).then(data => {
                resolve(data)
            })
        })
    },
    searchOrder () {
        let query = {
            delivery_date: ''
        }
        if (this.selectedDeliveryDate) {
            query.delivery_date = this.selectedDeliveryDate
        }
        if (this.selectedDeliveryDateTime) {
            query.delivery_date_timestamp = this.selectedDeliveryDateTime
            delete query.delivery_date
        }
        if (this.selectedGenerateDate) {
            query.generate_date = this.selectedGenerateDate.map(item => item / 1000)
            delete query.delivery_date
        }
        if (this.orderId) {
            query._id = this.orderId
            delete query.delivery_date
        }
        if (this.productId) {
            query.productId = this.productId
            if (!query.delivery_date) delete query.delivery_date
        }
        // } else {
        //     query.status = JSON.stringify({$ne: 5})
        // }
        if (this.selectedPlatform) {
            query.platform = this.selectedPlatform
        }
        if (this.selectedRegion) {
            query.region = this.selectedRegion
        }
        if (this.selectedStatus) {
            query.status = this.selectedStatus
        }
        if (this.selectedCutOffTag) {
            if (this.selectedCutOffTag === '未截单') {
                query.cutoff = ''
            } else {
                query.cutoff = this.selectedCutOffTag
            }
        }
        return new Promise(resolve => {
            getOrder(query).then(data => {
                this.orderList = data.data
                this.$refs.orderList.toggleAllSelection()
                resolve(data.data)
            })
        })
    },
    initProducts (orderCollections) {
        let itemList = this.generateItemList(orderCollections)

        return getProductsBatch({
            ids: itemList.map(item => item.item_sku.split('-')[0])
        }).then(data => {
            data.forEach(item => {
                this.productsInfo[item._id] = {
                    cost_price: item.cost_price,
                    multi_cost_price: item.multi_cost_price,
                    quality_control: item.quality_control,
                    sku_info: item.sku_info,
                    material: item.material,
                    price_orientation: item.price_orientation,
                    name_by_supplier: item.name_by_supplier,
                    images_sku: item.images_sku,
                    launch_time: item.launch_time,
                    supplier_id: item.supplier_id
                }
            })
        })
    },
    setDisabledDate (time) {
        return time.getTime() > Date.now()
    },
    checkSelectedOrders () {
        let checkResult = true
        let regionSort = {}
        this.selectedOrderList.forEach(item => {
            if (!regionSort[item.region]) {
                regionSort[item.region] = 0
            }
            regionSort[item.region]++
        })

        Object.keys(regionSort).forEach(item => {
            if (regionSort[item] > 50) checkResult = false
        })
        return checkResult
    },
    getGenerateSource (type) {
        this.orderBillLazada = {}
        if (!this.selectedOrderList.length) {
            this.$message.error('请选择订单')
            return
        }

        if (!this.checkSelectedOrders()) {
            this.$message.error('单店订单数大于50')
            return
        }

        const adoptedOrders = this.adoptOrders(this.selectedOrderList, type)
        const shopeeOrders = adoptedOrders.shopee
        const lazadaOrders = adoptedOrders.lazada

        const shopeeOrdersPromises = Object.keys(shopeeOrders).map(region => {
            return new Promise(resolve => {
                getOrderDetail({
                    region,
                    shop_id: shopIdInShopee[region],
                    order_sn_list: shopeeOrders[region].map(item => item._id).join(','),
                    response_optional_fields: shopeeOrderContent
                }).then(data => {
                    if (data.code === 1) {
                        this.$message.error(`${region}未返回结果`)
                        resolve({
                            order_list: []
                        })
                    } else {
                        // 初始化有问题
                        data.order_list.forEach((order, index) => {
                            this.initOrderItem(this.orderListMap[order.order_sn], data.order_list[index].item_list, data.order_list[index])
                        })
                        resolve({
                            ...data,
                            region
                        })
                    }
                })
            })
        })
        const lazadaOrdersPromises = Object.keys(lazadaOrders).map(region => {
            return new Promise(resolve => {
                getOrdersItems({
                    country: region,
                    order_ids: `[${(lazadaOrders[region].map(item => {
                        getTransactionDetails({
                            trade_order_id: item._id,
                            start_time: '2022-07-27',
                            end_time: '2022-08-27',
                            country: region
                        }).then(result => {
                            this.orderBillLazada[item._id] = getLazadaBill(result.data)
                        })
                        return item._id
                    })).join(',')}]`
                }).then(data => {
                    resolve(data.data.result.data)
                })
            })
        })

        return Promise.all([
            ...shopeeOrdersPromises,
            ...lazadaOrdersPromises
        ])
    },
    generateItemList (data, type) {
        let list = []
        data.forEach(item => {
            if (item.order_list) {
                // shopee
                item.order_list.forEach(subItem => {
                    if (type === 'pick') {
                        const quantity = subItem.item_list.reduce((accumulator, curr) => accumulator + curr.model_quantity_purchased, 0)
                        subItem.item_list.forEach(subSubItem => {
                            const itemInfo = this.selectedOrderListMap[subItem.order_sn][subSubItem.model_sku]

                            if (itemInfo) {
                                if ([0, 1, 4, 10, 11].indexOf(itemInfo.status) >= 0 || !itemInfo.status) {
                                    list = list.concat({
                                        ...subSubItem,
                                        order_sn: subItem.order_sn,
                                        region: subItem.region,
                                        cutOff: itemInfo.cutOff,
                                        quantity
                                    })
                                }
                            } else {
                                list = list.concat({
                                    ...subSubItem,
                                    order_sn: subItem.order_sn,
                                    region: subItem.region,
                                    quantity
                                })
                            }
                        })
                    } else {
                        list = list.concat(subItem.item_list)
                    }
                })
            } else {
                // lazada
                if (item) {
                    item.forEach(subItem => {
                        subItem.order_items.forEach(subSubItem => {
                            list.push({
                                item_sku: subSubItem.sku.split('_')[0],
                                model_quantity_purchased: Math.round(subSubItem.paid_price / subSubItem.item_price),
                                image_info: {
                                    image_url: subSubItem.product_main_image
                                },
                                model_name: subSubItem.variation
                            })
                        })
                    })
                }
            }
        })

        return list
    },
    generatePickingList (sort) {
        let pickingListTmp = []
        this.pickingList = []
        this.getGenerateSource('pick').then(async data => {
            await this.initProducts(data)

            let itemList = this.generateItemList(data, 'pick')
            let supplier = {}
            itemList.forEach(item => {
                const adoptItemSku = item.item_sku.split('-')

                const supplierId = adoptItemSku.length > 1 ? Number(adoptItemSku[1]) : this.productsInfo[adoptItemSku[0]].supplier_id
                if (!supplier[supplierId]) {
                    supplier[supplierId] = {items: [], cost: 0}
                }
                supplier[supplierId].items.push({
                    ...item,
                    unitPrice: this.calculateSinglePrice(item),
                    nameBySupplier: (item.model_sku && this.productsInfo[item.model_sku.split('-')[0]]) ? this.productsInfo[item.model_sku.split('-')[0]].name_by_supplier : '未命名'
                })
                supplier[supplierId].info = this.supplierData[supplierId]
                if (!this.productsInfo[item.item_sku]) {
                    console.log(item)
                } else if (this.productsInfo[item.item_sku].multi_cost_price.length) {
                    if (item.model_sku) {
                        supplier[supplierId].cost += this.productsInfo[item.item_sku].multi_cost_price[Number(item.model_sku.split('-')[1])] * item.model_quantity_purchased
                    }
                } else {
                    supplier[supplierId].cost += this.productsInfo[item.item_sku].cost_price * item.model_quantity_purchased
                }
            })

            Object.keys(supplier).forEach(item => {
                pickingListTmp.push(supplier[item])

                this.pickingListItemNum = 0
                pickingListTmp.forEach(picking => {
                    picking.items.forEach(pickingItem => {
                        this.pickingListItemNum += pickingItem.model_quantity_purchased
                    })
                })
            })

            let process = true

            if (sort === 1) {
                pickingListTmp.sort((a, b) => {
                    if (!a.info.address || !a.info.address.building) {
                        this.$message.error(`请先添加地址 ${a.info.serial}`)
                        process = false
                        return
                    }
                    if (!b.info.address || !b.info.address.building) {
                        this.$message.error(`请先添加地址 ${b.info.serial}`)
                        process = false
                        return
                    }
                    const addressAWeight = buildingWeight[a.info.address.building]
                    const addressBWeight = buildingWeight[b.info.address.building]

                    const buildingSort = addressAWeight - addressBWeight

                    return buildingSort || -(a.info.address.buildingFloor - b.info.address.buildingFloor)
                })
            } else if (sort === 2) {
                pickingListTmp.sort((a, b) => {
                    return -(a.items.length - b.items.length)
                })
            } else if (sort === 3) {
                pickingListTmp.sort((a, b) => {
                    return -(a.cost - b.cost)
                })
            }

            this.pickingList = pickingListTmp

            this.dialogPickingVisible = process && true
        })
    },
    generatePackingList (isCompleting) {
        let orderListMap = {}
        this.orderList.map(item => {
            orderListMap[item._id] = item
        })
        let packingList = []
        this.packingListItemNum = 0

        let sourceType = 'pack'
        if (isCompleting) sourceType = 'completing'
        this.getGenerateSource(sourceType).then(async data => {
            await this.initProducts(data)

            data.forEach(item => {
                if (item.order_list) {
                    // shopee
                    item.order_list.forEach(async subItem => {
                        let orderCost = 0

                        subItem.item_list.forEach(subSubItem => {
                            // items
                            let itemsMap = {}
                            orderListMap[subItem.order_sn].items.map(product => {
                                itemsMap[product.item_sku] = product
                            })

                            if (Object.keys(itemsMap).length) {
                                const item = itemsMap[subSubItem.model_sku] || itemsMap[subSubItem.item_sku]
                                subSubItem.isTagPrint = item.isTagPrint
                                // subSubItem.hasFlaw = item.hasFlaw
                                // subSubItem.isStockout = item.isStockout
                            } else {
                                // subSubItem.hasFlaw = '0'
                                // subSubItem.isStockout = '0'
                            }

                            const sku = subSubItem.item_sku.split('-')[0]

                            if (this.productsInfo[sku].multi_cost_price.length && subSubItem.model_sku) {
                                orderCost += this.productsInfo[sku].multi_cost_price[Number(subSubItem.model_sku.split('-')[1])] * subSubItem.model_quantity_purchased
                            } else if (this.productsInfo[sku]) {
                                orderCost += this.productsInfo[sku].cost_price * subSubItem.model_quantity_purchased
                            } else {
                                this.$message.error('货价计算错误')
                            }

                            this.packingListItemNum += subSubItem.model_quantity_purchased

                            let itemInited = itemsMap[subSubItem.model_sku] || itemsMap[subSubItem.item_sku]
                            subSubItem.cutOff = itemInited.cutOff
                            subSubItem.billTag = itemInited.billTag
                        })

                        subItem.orderCost = orderCost
                        subItem.platform = 'shopee'
                        subItem.region = item.region

                        if (this.role !== 2) {
                            const billDetail = await this.getBillDetail(subItem)
                            this.$set(subItem, 'billDetail', billDetail)
                            if (billDetail.return_order_sn_list.length) {
                                subItem.isReturn = true
                                this.totalReturnNum++
                            }
                        }
                    })
                    packingList = packingList.concat(item.order_list)
                } else if (item.length) {
                    // lazada
                    item.forEach(subItem => {
                        let orderCost = 0
                        let currency = ''

                        subItem.order_items.forEach(subSubItem => {
                            // items
                            let itemsMap = {}
                            orderListMap[subItem.order_id].items.map(product => {
                                itemsMap[product.item_sku] = product
                            })

                            // if (Object.keys(itemsMap).length) {
                            //     subSubItem.hasFlaw = itemsMap[subSubItem.item_sku].hasFlaw
                            //     subSubItem.isStockout = itemsMap[subSubItem.item_sku].isStockout
                            // } else {
                            //     subSubItem.hasFlaw = '0'
                            //     subSubItem.isStockout = '0'
                            // }

                            const quantity = subSubItem.paid_price / subSubItem.item_price
                            const sku = subSubItem.sku.split('_')[0]

                            orderCost += this.productsInfo[sku].cost_price * quantity
                            currency = subSubItem.currency
                        })

                        // subItem.orderCost = orderCost

                        // this.$set(subItem, 'billDetail', await this.getBillDetail(subItem))

                        packingList.push({
                            platform: 'lazada',
                            order_sn: subItem.order_id,
                            package_number: subItem.order_items[0].package_id,
                            item_list: subItem.order_items.map(item => ({
                                item_sku: item.sku.split('_')[0],
                                model_quantity_purchased: Math.round(item.paid_price / item.item_price),
                                image_info: {
                                    image_url: item.product_main_image
                                },
                                model_name: item.variation,
                                status: item.status
                            })),
                            orderCost,
                            region: currency
                        })
                    })
                }
            })

            let totalCost = 0

            // init
            packingList.forEach(item => {
                if (item.order_sn) {
                    // shopee
                    item.weight = orderListMap[item.order_sn].weight
                    item.packaging = orderListMap[item.order_sn].packaging
                    item.freebie = orderListMap[item.order_sn].freebie
                    item.status = orderListMap[item.order_sn].status
                    item.shopId = orderListMap[item.order_sn].shop_id
                    item.shippingRemark = orderListMap[item.order_sn].shippingRemark

                    totalCost += item.orderCost
                }
                if (item.order_status === 'CANCELLED') {
                    this.totalCancelNum++
                }
            })
            this.totalCost = totalCost

            this.packingList = packingList
            if (this.selectedDeliveryDate || this.selectedDeliveryDateTime) {
                this.deliveryDate = ''
            } else {
                this.deliveryDate = Date.now()
            }

            if (isCompleting) {
                this.isCompleting = true
            }

            this.dialogPackingVisible = true
        })
    },
    adoptOrders (orderList, type) {
        const orders = {
            shopee: {},
            lazada: {}
        }
        orderList.forEach(item => {
            if (type === 'pick') {
                if ([2, 3, 13].indexOf(item.status) < 0) {
                    if (!orders[item.platform][item.region]) orders[item.platform][item.region] = []
                    orders[item.platform][item.region].push(item)
                }
            } else if (type === 'pack') {
                if ([3].indexOf(item.status) < 0) {
                    if (!orders[item.platform][item.region]) orders[item.platform][item.region] = []
                    orders[item.platform][item.region].push(item)
                }
            } else if (type === 'completing') {
                if ([13].indexOf(item.status) < 0) {
                    if (!orders[item.platform][item.region]) orders[item.platform][item.region] = []
                    orders[item.platform][item.region].push(item)
                }
            } else {
                if (!orders[item.platform][item.region]) orders[item.platform][item.region] = []
                orders[item.platform][item.region].push(item)
            }
        })

        return orders
    },
    viewOrderDetail (order) {
        let currentItemsMap = {}
        order.items.forEach(item => {
            currentItemsMap[item.item_sku] = item
        })
        this.currentItemsMap = currentItemsMap
        this.currentOrderDetail = {}
        if (order.platform === 'shopee') {
            getOrderDetail({
                region: order.region,
                shop_id: shopIdInShopee[order.region],
                order_sn_list: [order._id],
                response_optional_fields: shopeeOrderContent
            }).then(async data => {
                this.currentOrderDetail = data.order_list[0]
                this.currentOrderDetail.status = order.status
                this.currentOrderDetail.platform = 'shopee'
                this.currentOrderDetail.waybill_download_num = order.waybill_download_num
                this.currentOrderDetail.shop_id = order.shop_id
                this.currentOrderDetail.delivery_date_timestamp = order.delivery_date_timestamp
                this.currentOrderDetail.shippingRemark = order.shippingRemark

                await this.initProducts([{
                    order_list: data.order_list,
                    region: order.region
                }])

                this.currentOrderDetail.orderCost = 0
                this.currentOrderDetail.item_list.forEach(item => {
                    const sku = item.item_sku.split('-')[0]
                    if (this.productsInfo[sku].multi_cost_price && this.productsInfo[sku].multi_cost_price.length && item.model_sku) {
                        this.currentOrderDetail.orderCost += this.productsInfo[sku].multi_cost_price[Number(item.model_sku.split('-')[1])] * item.model_quantity_purchased
                    } else if (this.productsInfo[sku]) {
                        this.currentOrderDetail.orderCost += this.productsInfo[sku].cost_price * item.model_quantity_purchased
                    } else {
                        this.$message.error('货价计算错误')
                    }

                    if (this.productsInfo[sku]) {
                        item.name_by_supplier = this.productsInfo[sku].name_by_supplier || ''
                        item.quality_control = this.productsInfo[sku].quality_control || ''
                    }

                    item.quality = currentItemsMap[item.model_sku] && currentItemsMap[item.model_sku].quality

                    item.cutOff = currentItemsMap[item.model_sku] && currentItemsMap[item.model_sku].cutOff
                    item.billTag = currentItemsMap[item.model_sku] && currentItemsMap[item.model_sku].billTag
                })

                // if (this.role !== 2) {
                    this.$set(this.currentOrderDetail, 'billDetail', await this.getBillDetail(this.currentOrderDetail))
                // }

                this.initOrderItem(order, data.order_list[0].item_list, data.order_list[0])

                if (!order.waybill_download_num) {
                    this.handleDownloadWaybill()
                }

                this.gift = ''
                if (order.status === 21 || this.currentOrderDetail.item_list.length >= 3 || shopIdGift.indexOf(Number(order.shop_id)) >= 0) {
                    this.gift = '请送礼物'
                }
                this.dialogOrderVisible = true
            })
        }

        if (order.platform === 'lazada') {
            getOrdersItems({
                country: order.region,
                order_ids: `[${order._id}]`
            }).then(data => {
                const orderItems = data.data.result.data[0].order_items

                this.currentOrderDetail.order_sn = order._id

                this.currentOrderDetail.item_list = orderItems.map(item => {
                    return {
                        model_quantity_purchased: Math.round(item.paid_price / item.item_price),
                        image_info: {
                            image_url: item.product_main_image
                        },
                        item_sku: item.sku.split('_')[0],
                        model_name: item.variation
                    }
                })
                this.currentOrderDetail.platform = 'lazada'
                this.gift = ''
                this.dialogOrderVisible = true
            })
        }
    },
    initOrderItem (order, itemList, orderInfoFromPlatform) {
        if (!order.items.length) {
            // data.order_list[0].item_list
            const orderItems = itemList.map(item => {
                return {
                    ...item,
                    status: 0,
                    order_item_id: item.order_item_id,
                    model_id: item.order_item_id,
                    item_sku: item.model_sku || item.item_sku
                }
            })
            // 初始化 items
            editOrder({
                _id: order._id,
                items: orderItems,
                info_from_platform: _.omit(orderInfoFromPlatform, ['item_list'])
            }).then(data => {
                if (data.code === 0) {
                    this.$message.success('初始化成功')
                    order.items = orderItems
                } else {
                    this.$message.success('初始化失败')
                }
            })
        }
    },
    deleteOrderFromDelivery (order) {
      this.$confirm('此操作将从发货单中删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeOrder({order_list: [order._id]}).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            location.reload()
          })
        })

        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    adoptOrderType (status) {
        let type = ''
        if (['CANCELLED', 'IN_CANCEL'].indexOf(status) >= 0) {
            type = 'danger'
        }
        return type
    },
    initSupplier () {
        getSupplier().then(data => {
            const supplierList = data
            supplierList.forEach(item => {
                this.supplierData[item.serial] = item
            })
        })
    },
    closePackingDialog () {
        this.tag = []
        this.isCompleting = false
        this.dialogPackingVisible = false
        this.totalProfit = 0
        this.totalIncome = 0
        this.totalCost = 0
        this.netProfit = 0
        this.purchaseManpowerCost = 0
        this.packingManpowerCost = 0
        this.packingMaterialsCost = 0
        this.totalCancelNum = 0
        this.totalReturnNum = 0
    },
    closeTagsDialog () {
        this.dialogTagsVisible = false
    },
    submitComplete (orders, notClosePackingListDialog) {
        if (!orders.length) {
            orders = this.selectedOrderList
        }
        let packageListMap = {}
        this.packingList.map(item => {
            packageListMap[item.order_sn] = item
        })
        const tempList = orders.map((item, key) => {
            if (packageListMap[item._id]) {
                item.weight = packageListMap[item._id].weight
                item.packaging = packageListMap[item._id].packaging
                item.freebie = packageListMap[item._id].freebie
                item.items = packageListMap[item._id].item_list.map(subItem => {
                    return _.pick(subItem, ['item_sku', 'hasFlaw', 'isStockout'])
                })
            }
            if (!this.deliveryDate) {
                this.deliveryDate = Date.now()
            }
            item.delivery_date = moment(this.deliveryDate).format('YYYY-MM-DD')
            item.delivery_date_timestamp = Date.now()
            // item.status = 0
            return item
        })

        editOrderBatch({
            order_list: tempList
        }).then(data => {
            if (!notClosePackingListDialog) {
                this.dialogPackingVisible = false
            }
            this.totalProfit = 0
        })
    },
    getStatus (order) {
        let status = '未扫描'

        if (!order.package_list || !order.package_list.length) {
            status = '未获取'
        } else {
            const packageData = order.package_list[0]
            if (packageData.logistics_status === 'LOGISTICS_PICKUP_DONE') {
                if (packageData.parcel_chargeable_weight_gram > 0) {
                    status = '已到仓'
                // } else if (Math.abs(order.update_time - order.pickup_done_time) > 500) { // 并不能判断CO
                    // status = '疑似到仓'
                } else {
                    status = '已扫描'
                }
            } else if (packageData.logistics_status === 'LOGISTICS_REQUEST_CREATED') {
                status = '已创建'
            } else if (packageData.logistics_status === 'LOGISTICS_DELIVERY_FAILED') {
                status = '买家拒收'
            } else if (packageData.logistics_status === 'LOGISTICS_REQUEST_CANCELED') {
                status = '卖家未送仓'
            } else {
                status = packageData.logistics_status
            }
        }

        return status
    },
    getStatusColor (order) {
        const status = this.getStatus(order)

        const statusColorMap = {
            '已扫描': 'danger',
            '未扫描': 'warning',
            '已到仓': 'success'
        }
        return statusColorMap[status]
    },
    downloadPickingPng () {
        this.pickingDownloadMsg++
        this.cutOff()
        // downloadPng(this.$refs.pickingDom.$el, `picking-${getDate()}.png`)
    },
    downloadPackingPng () {
        downloadPng(this.$refs.packingDom.$el, `packing-${getDate()}.png`)
    },
    selectOrderList (data) {
        this.selectedOrderList = data
    },
    confirmOrderDetail () {
        this.dialogOrderVisible = false
        this.currentOrderDetail = {}
    },
    markOrderStatus (_id, status) {
        // 自动绑定首公里
        if (status === 3 && this.currentOrderDetail.package_list[0].logistics_status !== 'LOGISTICS_PICKUP_DONE') {
            this.handleBindFirstMile()
        }

        let params = {
            _id,
            status
        }

        if (status === 0) {
            params.delivery_date = ''
        }

        editOrder(params).then(data => {
            if (data.code === 0) {
                this.$message.success(`标记成功 ${status} （如需更新列表内的本地状态，请刷新当前页面）`)
                // window.location.reload()
                this.confirmOrderDetail()
                if (status === 3) {
                    this.submitComplete([this.orderListMap[_id]], true)
                }
            } else {
                this.$message.success('标记失败')
            }
        })
    },
    toItemPage (data) {
      const region = this.currentOrderDetail.region
      const regionLower = region.slice(0, 2).toLowerCase()
      const shopId = this.currentOrderDetail.shop_id
      window.open(`https://${regionLower}.xiapibuy.com/product/${shopId}/${data.item_id}`, '_blank')
    },
    toEditGlobalItem (data) {
      const region = this.currentOrderDetail.region
      const shopId = shopIdInShopee[region]
      window.open(`https://seller.shopee.cn/portal/product/mtsku/${data.item_sku}/?cnsc_shop_id=${shopId}`, '_blank')
    },
    toEditItem (data) {
      const region = this.currentOrderDetail.region
      const shopId = shopIdInShopee[region]
      window.open(`https://seller.shopee.cn/portal/product/${data.item_id}/?cnsc_shop_id=${shopId}`, '_blank')
    },
    toItemOptimizing () {
      window.open(`https://docs.qq.com/form/page/DS3p6ZXZxb1JwRHJ1`, '_blank')
    },
    toCGItem (data) {
      let url = this.$router.resolve({
        name: 'edit',
        query: {id: data.item_sku.split('-')[0]}
      })
      window.open(url.href, '_blank')
    },
    toPurchaseNote () {
        this.$router.push('/order/purchase-list')
    },
    markOrderItemStatus (status, data) {
        let orderListMap = {}
        this.orderList.forEach(item => {
            orderListMap[item._id] = item
        })

        let items = orderListMap[this.currentOrderDetail.order_sn].items

        let itemsMap = {}
        items.forEach(item => {
            itemsMap[item.item_sku] = item
        })

        let adoptedItems = []

        if (!itemsMap[data.model_sku]) {
            adoptedItems = this.currentOrderDetail.item_list.map(item => {
                return {
                    ...item,
                    order_item_id: item.order_item_id,
                    model_id: item.order_item_id,
                    item_sku: item.model_sku || item.item_sku,
                    status: status
                }
            })
        } else {
            itemsMap[data.model_sku].status = status
            Object.keys(itemsMap).forEach(item => {
                adoptedItems.push(itemsMap[item])
            })
        }
        editOrder({
            _id: this.currentOrderDetail.order_sn,
            items: adoptedItems
        }).then(data => {
            if (data.code === 0) {
                this.$message.success(`标记成功 ${status} （如需更新列表内的本地状态，请刷新当前页面）`)
            } else {
                this.$message.success('标记失败')
            }
        })
    },
    calculateSinglePrice (data) {
        const product = this.productsInfo[data.item_sku.split('-')[0]]
        let price = 0
        if (product.multi_cost_price && product.multi_cost_price.length && data.model_sku) {
            price = product.multi_cost_price[Number(data.model_sku.split('-')[1])] * data.model_quantity_purchased
        } else {
            price = product.cost_price * data.model_quantity_purchased
        }
        return price
    },
    calculateDeadline (pickupTime, shipByDate) {
        return moment((shipByDate + 60 * 60 * 24 * 3) * 1000).format('YYYY-MM-DD HH:mm')
    },
    completePickingItem (status, data) {
        let itemMap = {}
        if (!data.order_sn) {
            this.$message.error('没有order_sn')
        }
        this.orderListMap[data.order_sn].items.forEach(item => {
            itemMap[item.item_sku] = item
        })
        itemMap[data.model_sku].status = status
        let newItems = []
        Object.keys(itemMap).forEach(item => {
            newItems.push(itemMap[item])
        })
        editOrder({
            _id: data.order_sn,
            items: newItems
        }).then(data => {
            if (data.code === 0) {
                this.$message.success(`标记成功 ${status} （如需更新列表内的本地状态，请刷新当前页面）`)
                // this.orderListMap[data.order_sn].items = newItems
            } else {
                this.$message.success('标记失败')
            }
        })
    },
    generateOrderStatus (data) {
        const items = data.items

        if ([3, 5, 6, 18].indexOf(data.status) >= 0) return data.status
        if (!items.length) return data.status

        const needExchange = items.some(item => {
            return item.status === 4
        })
        const needExchangeOther = items.some(item => {
            return item.status === 12
        })
        const outOfStock = items.some(item => {
            return item.status === 1
        })
        const outOfStockAccessory = items.some(item => {
            return item.status === 10
        })
        const outOfStockCase = items.some(item => {
            return item.status === 11
        })
        const shutDown = items.some(item => {
            return item.status === 8
        })
        const complete = items.every(item => {
            return item.status === 2
        })
        const unlabeled = items.every(item => {
            return !item.status
        })

        const instorage = items.every(item => {
            return item.status === 9
        })

        if (shutDown) return 8
        if (complete) return 2
        if (needExchange) return 4
        if (needExchangeOther) return 12
        if (outOfStock) return 1
        if (outOfStockAccessory) return 10
        if (outOfStockCase) return 11
        if (unlabeled) return 7
        if (instorage) return 9
        return data.status
    },
    getOrderReturnStatus (order) {
        if (order.billDetail && order.billDetail.return_order_sn_list.length) {
            return `RETURN`
        } else {
            return 0
        }
    },
    emptyItems (data) {
        editOrder({
            _id: data._id,
            items: []
        }).then(data => {
            if (data.code === 0) {
                this.$message.success('清空成功')
            } else {
                this.$message.success('清空失败')
            }
        })
    },
    downloadPickingExcel () {
        // this.$message.info('开发中...')
        // let workbook

        let list = []
        const client = 'A262微微'

        this.pickingList.forEach(item => {
            console.log('item', item)
            item.items.forEach(subItem => {
                const productInfo = this.productsInfo[subItem.model_sku.split('-')[0]]
                const modelSkuArr = subItem.model_sku.split('-')
                let localImage
                if (!this.productsInfo[modelSkuArr[0]].images_sku[modelSkuArr[1]]) {
                    localImage = ''
                } else {
                    localImage = `${this.productsInfo[modelSkuArr[0]].images_sku[modelSkuArr[1]].url.split('?')[0]}?x-oss-process=style/compress`
                }

                list.push({
                    client,
                    product: productInfo ? this.productsInfo[subItem.model_sku.split('-')[0]].name_by_supplier : '自行填写',
                    image: subItem.image_info.image_url,
                    image_no_water: localImage || subItem.image_info.image_url,
                    cost: item.cost,
                    unitPrice: subItem.unitPrice,
                    model_sku: subItem.model_sku,
                    model_name: subItem.model_name,
                    model_type: subItem.model_name.split(',')[1],
                    model_style: subItem.model_name.split(',')[0],
                    sku_info: (productInfo && productInfo.sku_info && productInfo.sku_info[subItem.model_sku.split('-')[1]] && productInfo.sku_info[subItem.model_sku.split('-')[1]].length) ? productInfo.sku_info[subItem.model_sku.split('-')[1]].reduce((prev, item) => {
                        return `${prev} + ${accessoryType[item.type]}`
                    }, '') : '无配件',
                    model_quantity_purchased: subItem.model_quantity_purchased,
                    // info: item.info,
                    name: item.info.name,
                    address: `${item.info.address.building}-${item.info.address.buildingFloor}-${item.info.address.positionIndex}`,
                    remark: this.generateRemark(subItem)
                })
            })
        })

        const column = [
            {title: '客户', key: 'client'},
            {title: '档口号', key: 'address'},
            {title: '档口名', key: 'name'},
            // {title: '档口总价格预估', key: 'cost'},
            {title: '产品图片', key: 'image_no_water', type: 'image'},
            {title: '型号', key: 'model_type'},
            {title: '配件', key: 'sku_info'},
            {title: '备注', key: 'remark'},
            {title: '数量', key: 'model_quantity_purchased'},
            {title: '产品名称', key: 'product'}
            // {title: '款式', key: 'model_style'}
            // {title: '单价预估', key: 'unitPrice'}
            // {title: '产品图片(有logo)', key: 'image', type: 'image'},
        ]

        console.log('list', list)

        table2excel({
            column,
            data: list,
            excelName: `A262微微 采购单 ${moment(Date.now()).format('YYYY-MM-DD')}`,
            captionName: '采购单'
        })

        // workbook = sheet2Workbook(XLSX.utils.json_to_sheet(list, {header: ['产品名称', 'cost', 'name', 'address']}))
        // XLSX.writeFile(workbook, 'upload-products.xlsx')
    },
    generateRemark (item) {
        const status = this.selectedOrderListMap[item.order_sn][item.model_sku].status
        if (status === 10) {
            return '只拿配件'
        } else if (status === 11) {
            return '只拿单壳'
        } else {
            return ''
        }
    },
    handleBindFirstMile (type, data) {
        // getChannelIdList({
        //     shop_id: shopIdInShopee[this.currentOrderDetail.region]
        // }).then(data => {
        //     console.log(data, 'getChannelIdList')
        // })
        if (!this.firstMileTrackingNumber) {
            this.$message.error('请生成当日揽货批次号')
            return
        }

        let shopId
        let orderSn

        if (data && data.shopId) {
            shopId = data.shopId
            orderSn = data.orderSn
        } else {
            shopId = this.currentOrderDetail.shop_id || shopIdInShopee[this.currentOrderDetail.region]
            orderSn = this.currentOrderDetail.order_sn
        }

        if (type === 'downloadWaybill') {
             this.handleDownloadWaybill(data)
        }

        // if (!this.currentOrderDetail.waybill_download_num) {
        //     this.$message.error('请先下载面单')
        //     return
        // }

        bindFirstMile({
            shop_id: shopId,
            first_mile_tracking_number: this.firstMileTrackingNumber,
            logistics_channel_id: 813,
            order_list: [{
                order_sn: orderSn
            }]
        }).then(data => {
            if (data.code === 1) {
                this.$message.error(data.message)
            }

            if (!data.error && data.response.first_mile_tracking_number) {
                this.$message.success(`绑定成功 ${data.response.first_mile_tracking_number}`)
            } else {
                this.$message.error(data.error)
            }
        })
    },
    handleDownloadWaybill (info) {
        // TODO 考虑加入查询订单是否已打包

        let shopId
        let orderSn
        let region
        if (info && info.shopId && info.orderSn) {
            shopId = info.shopId
            orderSn = info.orderSn
            region = info.region
        } else {
            shopId = this.currentOrderDetail.shop_id
            orderSn = this.currentOrderDetail.order_sn
            region = this.currentOrderDetail.region
        }
        getTrackingNumber({
            shop_id: shopId,
            order_sn: orderSn
        }).then(data => {
            if (!data || !data.tracking_number) {
                this.$message.error('获取 tracking_number 出错')
                return
            }

            const trackingNumber = data.tracking_number

            createShippingDocument({
                shop_id: shopId,
                order_list: [{
                    order_sn: orderSn,
                    tracking_number: data.tracking_number
                }]
            }).then(data => {
                if (data.error) {
                    this.$message.error(data.response.result_list[0].fail_message)
                } else {
                    getShippingDocumentResult({
                        shop_id: shopId,
                        order_list: [{
                            order_sn: orderSn
                        }]
                    }).then(data => {
                        if (data.error) {
                            this.$message.error(data.error)
                        } else {
                            downloadShippingDocument({
                                shop_id: shopId,
                                order_list: [{
                                    order_sn: orderSn
                                }]
                            }).then(data => {
                                if (data.size < 10000) {
                                    this.$message.warning('面单为空，正在重新下载，请确认面单文件')
                                    this.handleDownloadWaybill(info)
                                    // return
                                }
                                const href = URL.createObjectURL(data)
                                const box = document.createElement('a')
                                box.download = `${region}_${orderSn}_${trackingNumber}.pdf`
                                box.href = href
                                box.click()
                            })
                        }
                    })
                }
            })
        })
    },
    handleDownloadWaybillFromAliyun (way) {
        getOrder({_id: this.currentOrderDetail.order_sn}).then(data => {
            if (!way && (this.role === 2 && data.data[0].status === 3)) {
                this.$message.error('订单已打包，不能继续打印面单')
            } else {
                window.open(`https://images-zerowidth.oss-cn-shenzhen.aliyuncs.com/waybill/${this.currentOrderDetail.region}/${this.currentOrderDetail.order_sn}.pdf`)
            }
        })
    },
    handleGenerateFirstMileTrackingNumber () {
        if (this.firstMileTrackingNumber) {
            window.open(`https://seller.shopee.cn/api/v3/shipment/get_first_mile_code_waybill/?fm_codes=${this.firstMileTrackingNumber}&cnsc_shop_id=${shopIdInShopee['VN_2']}`, '_blank')
        } else {
            this.generateTrackingNumber()
        }
    },
    copyFirstMileTrackingNumber () {
        let number = this.firstMileTrackingNumber
        let oInput = document.createElement('input')
        oInput.value = number
        document.body.appendChild(oInput)
        oInput.select() // 选择对象
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message({
            message: '复制成功',
            type: 'success'
        })
        oInput.remove()
        this.reGenerateFirstMileTrackingNumber()
    },
    generateTrackingNumber () {
        generateFirstMileTrackingNumber({
            shop_id: shopIdInShopee['VN_2'],
            quantity: 1,
            declare_date: moment(Date.now()).format('YYYY-MM-DD')
        }).then(data => {
            if (data.code === 0 && !data.data.error) {
                location.reload()
            }
        })
    },
    reGenerateFirstMileTrackingNumber () {
        this.$confirm(`是否确定当前揽货批次号已扫描，并重新生成揽货批次号?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.generateTrackingNumber()
        })
    },
    searchFirstMileTrackingNumber () {
        getFirstMileTrackingNumber({
            declare_date: moment(Date.now()).format('YYYY-MM-DD')
        }).then(data => {
            if (data.length) {
                this.firstMileTrackingNumber = data[data.length - 1].first_mile_tracking_number
            } else {
                this.generateTrackingNumber()
            }
        })
    },
    cutOff () {
        const cutOff = this.generateCutOffTag()
        this.$confirm(`是否标记表格中全部商品为截单 ${cutOff}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            const pickingListMap = {}
            this.pickingList.forEach(item => {
                item.items.forEach(subItem => {
                    if (!pickingListMap[subItem.order_sn]) pickingListMap[subItem.order_sn] = []
                    pickingListMap[subItem.order_sn].push(subItem)
                })
            })

            addPurchaseNote({
                picking_list: this.pickingList,
                cutoff: cutOff,
                start_time: this.buyStartTime,
                return_time: this.buyReturnTime
            }).then(data => {
                if (data.data.upsertedId) {
                    this.$message.success(`截单成功 ${data.data.upsertedId}`)

                    let tempList = []

                    this.selectedOrderList.map((item, key) => {
                        const orderExist = pickingListMap[item._id]
                        let orderCutOff = item.cutoff
                        if (orderExist) {
                            let cutOffItems = []
                            // 如果orderExist里面有item
                            orderExist.forEach(orderItem => {
                                cutOffItems.push(orderItem.item_id)
                            })
                            let orderItems = item.items.map(orderItem => {
                                if (cutOffItems.indexOf(orderItem.item_id) >= 0) {
                                    if (!orderItem.cutOff) orderItem.cutOff = []
                                    orderItem.cutOff.push(cutOff)
                                    return orderItem
                                } else {
                                    return orderItem
                                }
                            })

                            if (!orderCutOff) orderCutOff = []
                            orderCutOff.push(cutOff)

                            tempList.push({
                                ...item,
                                cutoff: orderCutOff,
                                items: orderItems
                            })
                        }
                    })

                    editOrderBatch({
                        order_list: tempList
                    }).then(data => {
                        console.log(data)
                    })
                } else {
                    this.$message.error('截单失败')
                }
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消截单'
            })
        })
    },
    generateCutOffTag () {
        const todayDate = moment(Date.now()).format('YYYY-MM-DD')
        if (!this.cutOffTag.length || this.cutOffTag.length === 1) return `${todayDate}/1`
        let batchId = 1
        this.cutOffTag.forEach(item => {
            const itemArr = item.split('/')
            if (itemArr[0] === todayDate) {
                if (Number(itemArr[1]) >= batchId) {
                    batchId = Number(itemArr[1]) + 1
                }
            }
        })
        return `${todayDate}/${batchId}`
    },
    getPurchasingReport () {
        getPurchaseNote({
            cutoff: this.selectedCutOffTag
        }).then(data => {
            if (!data.data.length) {
                this.$message.error('无数据')
                return
            }
            this.pickingList = data.data[0].picking_list
            this.dialogPickingVisible = true
        })
    },
    generatePurchasingReport () {
        let purchasingReportPickingList = []
        let actualTotalCost = 0
        purchasingReportPickingList = this.pickingList.map(item => {
            let actualPayment = 0
            let newItems = item.items.map(subItem => {
                const status = this.selectedOrderListMap[subItem.order_sn][subItem.model_sku].status

                if ([2, 4, 9].indexOf(status) >= 0) {
                    actualPayment += subItem.unitPrice * subItem.model_quantity_purchased
                }

                return {
                    ...subItem,
                    status
                }
            })

            actualTotalCost += actualPayment
            return {
                ...item,
                items: newItems,
                actualPayment
            }
        })

        editPurchaseNote({
            picking_list: purchasingReportPickingList,
            total_cost: actualTotalCost,
            cutoff: this.selectedCutOffTag,
            start_time: this.buyStartTime,
            return_time: this.buyReturnTime
        }).then(data => {
            console.log(data)
        })
    },
    openOrder (orderId) {
        this.viewOrderDetail(this.orderListMap[orderId])
    },
    checkAccount (data) {
        let actualPayment = 0
        data.items.forEach(item => {
            const orderItemDetail = this.selectedOrderListMap[item.order_sn][item.model_sku]
            if ([2, 4, 9].indexOf(orderItemDetail.status) >= 0) {
                actualPayment += item.unitPrice * item.model_quantity_purchased
            }
        })
        this.$message.info(`实际支付: ${actualPayment}`)
    },
    handleGetShippingDocumentDataInfo () {
        getShippingDocumentDataInfo({
            shop_id: this.currentOrderDetail.shop_id,
            order_sn: this.currentOrderDetail.order_sn
        }).then(data => {
            console.log(data)
        })
    },
    handleShipOrder () {
        shipOrder({
            order_sn: this.currentOrderDetail.order_sn,
            shop_id: this.currentOrderDetail.shop_id,
            dropoff: {
                // tracking_number: trackingno
            }
        }).then(result => {
            console.log(result)
            if (result.code === 0) {
                this.$message.success('出货成功')
            }
        })
    },
    sentAll () {
        editOrderBatch({
            order_list: this.selectedOrderList.map(item => {
                item.status = 18
                item.transport_timestamp = Date.now()
                return item
            })
        }).then(data => {
            console.log(data)
        })
    },
    adoptModel (model) {
        return model.replace(/สูงสุด/, 'Max')
    },
    generateNumber () {
        console.log('ing')
    },
    listenProfit (profit) {
        if (profit && profit >= 30) {
            this.gift = '请送礼物'
        }
    },
    closeRemark () {
        this.shippingRemark = ''
        this.dialogRemarkVisible = false
    },
    openRemark () {
        this.shippingRemark = this.currentOrderDetail.shippingRemark
        this.dialogRemarkVisible = true
    },
    handleUpdateRemark () {
        editOrder({
            _id: this.currentOrderDetail.order_sn,
            shippingRemark: this.shippingRemark
        }).then(data => {
            if (data.code === 0) {
                this.$message.success(`发货备注更新成功`)
            } else {
                this.$message.success('发货备注更新失败')
            }
        })
    },
    printTypeTag (data, mode) {
        const type = data.model_name.split(',')[1]
        let docName = ''
        let text = ''
        switch (type) {
            case 'iPhone 12 Pro Max':
                text = '12PM/13PM'
                docName = '12promax'
                break
            case 'iPhone 13':
            case 'iPhone 14':
                text = '13/14'
                docName = '1314'
                break
            case 'iPhone 14 Plus':
            case 'iPhone 15 Plus':
                text = '14Plus/15Plus'
                docName = '1415plus'
                break
        }

        let LODOP = getLodop()

        let systemType = getSystemType()
        if (systemType === 'windows' && mode === 1) {
            LODOP.PRINT_INIT('miniTag')
            LODOP.SET_PRINT_PAGESIZE(1, 400, 300, 'miniTag')
            LODOP.SET_PRINT_STYLE('FontSize', 10)
            LODOP.ADD_PRINT_TEXT(50, 10, 400, 20, text)
            LODOP.NewPageA()
            LODOP.SET_PRINTER_INDEX('HPRT D35')
            LODOP.PREVIEW()
            this.closeTagsDialog()
        } else {
            if (docName) {
                window.open(`https://images-zerowidth.oss-cn-shenzhen.aliyuncs.com/tag/${docName}.pdf`)
            } else {
                this.$message.error('请检查型号是否需要通用标')
            }
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gc-weight {
    text-align: center;
}
.gc-red {
    background-color: red;
    color: #fff;
    font-weight: bolder;
}
.gc-error {
    color: red;
}

@media print {
  @page {
    margin: 0;
    size: 30mm 20mm;
  }
  body {
    border: 1px solid #999;
  }
  .gc-single-tag {
    page-break-before: always;
    font-size: 10px;
  }
}

.gc-link {
    margin: 5px 0;
}

</style>

<style>
.el-table .gc-row-shopee {
    background-color: rgb(225, 243, 216);
}
.el-table .gc-row-lazada {
    background-color: rgb(250, 236, 216);
}
.el-table .gc-back-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center center;
    mask: linear-gradient(-45deg, transparent 30px, #fff 0)
}
.el-table .gc-back-image-detail {
    width: 200px;
    height: 200px;
    background-size: cover;
    background-position: center center;
    mask: linear-gradient(-45deg, transparent 60px, #fff 0)
}
</style>
