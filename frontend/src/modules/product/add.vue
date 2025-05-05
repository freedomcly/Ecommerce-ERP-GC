<template>
  <div class="page-content">
    <el-card class="gc-card">
      <div slot="header">
        <span>{{isEdit ? '编辑': '新建'}}商品</span>
        <span v-if="isEdit && _id">{{_id}}</span>
        <span v-if="isEdit && form.global_item_id && role !== 2" style="margin-left: 20px;">全球商品ID: <el-link @click="toGlobalItem">{{form.global_item_id}}</el-link>
        <el-button @click="clearShopeeGlobalId" size="mini">清除shopee全球商品ID</el-button></span>

        <span v-if="isEdit && form.global_item_id && globalItemShopee.pre_order && globalItemShopee.pre_order.days_to_ship">出货天数</span>

        <el-popover
          v-if="isEdit && form.global_item_id && globalItemShopee.pre_order && globalItemShopee.pre_order.days_to_ship"
          placement="right"
          width="400"
          trigger="click">
          <div>
            <el-input v-model="daysShip" placeholder="请填写出货天数" size="mini"></el-input>
            <el-button @click="modifyDaysShip" size="mini">确认</el-button>
          </div>
          <el-button :type="globalItemShopee.pre_order.days_to_ship > 2 ? 'danger': 'normal'" slot="reference" size="mini">{{globalItemShopee.pre_order.days_to_ship}}
          </el-button>
        </el-popover>

        <el-tag class="gc-status" :type="statusColor[form.status]" @click="openDialogStatus(status[form.status])">{{status[form.status]}}</el-tag>
      </div>
      <el-radio-group v-model="tabChooser" style="margin-bottom: 30px;" @change="changeTabChooser">
        <el-radio-button :label="categoryIdShopeePhoneCase">手机壳(耳机壳/贴膜)</el-radio-button>
        <el-radio-button :label="categoryIdShopeeAirpodsCase">耳机壳</el-radio-button>
        <el-radio-button :label="categoryIdShopeeTabletCase">平板壳</el-radio-button>
        <el-radio-button :label="categoryIdShopeeScreenProtector">贴膜</el-radio-button>
        <el-radio-button :label="categoryIdShopeeCable">数据线</el-radio-button>
        <el-radio-button :label="categoryIdShopeeCableProtector">数据线保护套</el-radio-button>
        <el-radio-button :label="categoryIdShopeePhoneStrap">手机挂绳</el-radio-button>
        <el-radio-button :label="categoryIdShopeeHolderPopsocket">手机支架</el-radio-button>
        <el-radio-button :label="categoryIdShopeeCarPhoneHolder">车载手机支架</el-radio-button>
        <el-radio-button :label="categoryIdShopeePhoneBag">手机包</el-radio-button>
        <el-radio-button :label="categoryIdShopeeGameAccessory">主机游戏配件</el-radio-button>
        <el-radio-button :label="categoryIdShopeeSticker">贴纸</el-radio-button>
        <el-radio-button :label="categoryIdShopeeFan">USB手持风扇</el-radio-button>
        <el-radio-button :label="categoryIdShopeePortableLamp">USB便携式灯</el-radio-button>
        <el-radio-button :label="categoryIdShopeeWatchband">表带</el-radio-button>
        <el-radio-button label="general">通用</el-radio-button>
      </el-radio-group>

      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item v-if="tabChooser === 'general'" label="类目" prop="category">
          <el-input v-model="form.category" :disabled="isEdit" type="number" @blur="inputCategoryId"></el-input>
        </el-form-item>

        <el-form-item label="供应商" prop="supplier_id">
          <el-select v-model="form.supplier_id" :disabled="Boolean(form.supplier_id)" filterable placeholder="请选择供应商" @change="changeSupplier">
            <el-option v-for="item in supplierList" :key="item.serial" :label="item.name" :value="item.serial"></el-option>
          </el-select>

          <el-upload
            v-loading.fullscreen.lock="isVideoLoading"
            element-loading-text="正在上传文件..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :action="uploadURLFile"
            :disabled="!form.supplier_id"
            accept="file/*"
            :limit="1"
            :data="{
              supplierId: form.supplier_id,
              productId: productId,
              id: form._id
            }"
            :before-upload="beforeFileUpload"
            :on-success="handleFileSuccess"
            :on-change="handleFileChange"
            :on-error="handleFileError">
            <el-button :disabled="!form.supplier_id" size="small" plain>点击上传商品文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item v-if="currentSupplier" label="产品系列" prop="serie">
          <el-select v-model="form.serie" :disabled="Boolean(form.serie)" filterable placeholder="请选择产品系列" @change="changeSerie">
            <el-option v-for="(item, index) in currentSupplier.series" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用品牌">
          <el-select v-model="form.brand_compatibility_id" placeholder="请选择品牌" @change="changeBrand">
            <el-option v-for="(item, index) in brandCompatibility" :key="index" :label="item" :value="Number(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.supplier_id">
          <div class="gc-images">
            <!-- 兼容以前的商品 -->
            <div v-if="isEdit && !form.images.length">
              <img v-for="item in globalImages.image_url_list" :key="item" :src="item" class="gc-global-item-image">
            </div>
            <div>
              <el-upload
                :action="uploadURL"
                list-type="picture-card"
                multiple
                accept="image/*"
                :file-list="form.images"
                :limit="30"
                :data="{
                  supplierId: form.supplier_id,
                  productId: productId
                }"
                :before-upload="beforeUploadImages"
                :on-preview="handleImagePreview"
                :on-remove="handleRemoveImage"
                :on-change="handleChangeImage"
                :on-success="handleImageSuccess"
                :on-error="handleUploadError"
                class="gc-images-main">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <el-tooltip class="item" effect="dark" placement="bottom-start">
            <div slot="content">
              <ul>
                <li v-for="(item, index) in imagePrinciple" :key="index">{{item}}</li>
              </ul>
            </div>
            <el-button type="text">图片原则</el-button>
          </el-tooltip>
          <el-button v-if="role !== 2" @click="confirmChangeMainImages" type="text">更换全球商品图片</el-button>
        </el-form-item>
        <el-form-item label="供应商产品标题" prop="name_by_supplier">
          <el-input v-model="form.name_by_supplier"></el-input>
        </el-form-item>
<!--         <el-form-item v-if="form.selling_point" label="全球标题">
          <div>{{globalItemName}} [{{globalItemName.length}}]</div>
        </el-form-item> -->
        <el-form-item label="标签" prop="">
          <el-button @click="autoSelectTag" type="text">自动匹配标签</el-button>
          <div v-if="form.tags && form.tags.length">
            <el-tag v-for="tag in form.tags" :key="tag._id" @click="generateSellingPoint(tag)" @close="deleteTag(tag)" type="success" closable>{{tag.value}}</el-tag>
          </div>
          <div v-else><el-button type="text">请在下方选择标签</el-button></div>
          <div>
            <el-button @click="toggleUnimportance2" type="text" :icon="`el-icon-caret-${isUnimportanceShow2 ? 'bottom' : 'right'}`">{{isUnimportanceShow2 ? '收起' : '展开'}}标签选择器</el-button>
          </div>
          <div v-show="isUnimportanceShow2" class="gc-unimportance">
            <div v-for="(item, key) in adoptedTags" :key="key">
              <span>{{tagTypeMap[key]}}</span>
              <el-tag v-for="subItem in item" :key="subItem._id" @click="selectTag(subItem)" type="success">{{subItem.value}}</el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="英文卖点词" prop="selling_point">
          <el-input v-model="form.selling_point"></el-input>
          <el-tooltip class="item" effect="dark" content="Splash-ink / Leopard Print / Elegant / Cute / Couple / Silicone / Transparent / with Pop Grip / Card Holder / Premium / Upgrade / Professional" placement="bottom-start">
            <el-button type="text">卖点词推荐</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="繁体中文卖点词" prop="selling_point_traditional">
          <el-input v-model="form.selling_point_traditional"></el-input>
        </el-form-item>
        <el-form-item label="型号词" prop="model_type">
          <el-input v-model="form.model_type"></el-input>
          <div>
            <el-button @click="getTypeWords" type="text">获取最新iPhone型号词</el-button>
            <el-button @click="getTypeWordsSimple" type="text">获取最新简约版iPhone型号词</el-button>
            <el-button @click="getTypeWordsZFlip" type="text">获取最新Z Flip型号词</el-button>
          </div>
        </el-form-item>

        <el-form-item label="产品描述" prop="features">
          <el-select v-model="form.features" placeholder="请选择特性描述" multiple>
            <el-option-group
              v-for="group in adoptedDescriptionList"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.short"
                :label="item.short_trans"
                :value="item.short"
                multiple>
              </el-option>
            </el-option-group>
            <el-option-group>
              <el-option label="无描述" value="0"></el-option>
            </el-option-group>
          </el-select>
          <div>
            <el-button @click="openDescriptionDialog" type="text">查看当前商品已生成的描述</el-button>
          </div>
        </el-form-item>
        <el-form-item label="产品材质" prop="material">
          <el-select v-model="form.material" multiple placeholder="请选择产品材质">
            <el-option
              v-for="(value, key) in material"
              :key="key"
              :label="value"
              :value="value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品硬度" prop="hardness">
          <el-select v-model="form.hardness" placeholder="请选择产品硬度">
            <el-option v-for="item in hardness" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <div v-if="role !== 2">
          <el-button @click="toggleUnimportance" type="text" :icon="`el-icon-caret-${isUnimportanceShow ? 'bottom' : 'right'}`">{{isUnimportanceShow ? '收起' : '展开'}}厚度/重量/包装输入框</el-button>
        </div>
        <div v-show="isUnimportanceShow" class="gc-unimportance">
          <el-form-item label="产品厚度">
            <el-input v-model="form.thickness" placeholder="单位MM"></el-input>
          </el-form-item>
          <el-form-item label="产品重量">
            <el-input v-model="form.weight" placeholder="默认0.05，单位KG"></el-input>
          </el-form-item>
          <el-form-item label="包装长度">
            <el-input v-model="form.parcel_size_length" placeholder="默认22，单位CM"></el-input>
          </el-form-item>
          <el-form-item label="包装宽度">
            <el-input v-model="form.parcel_size_width" placeholder="默认17，单位CM"></el-input>
          </el-form-item>
          <el-form-item label="包装高度">
            <el-input v-model="form.parcel_size_height" placeholder="默认4，单位CM"></el-input>
          </el-form-item>
          <el-form-item v-if="role !== 2" label="包装">
            <el-select v-model="form.outerPacking" placeholder="外包装建议" multiple>
              <el-option v-for="(item, key) in packaging" :key="key" :label="item" :value="Number(key)"></el-option>
            </el-select>
            <el-select v-model="form.otherPacking" placeholder="其他包装建议" multiple>
              <el-option v-for="(item, key) in otherPacking" :key="key" :label="item" :value="Number(key)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="role !== 2 && form.inventory" label="盘点">
            <el-select v-model="form.inventory.need" placeholder="是否需要盘点">
              <el-option v-for="(item, key) in checkStatus" :key="key" :label="item" :value="Number(key)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="role !== 2" label="质检">
            <el-select v-model="form.quality_control" placeholder="质检建议" multiple>
              <el-option v-for="(item, key) in qc" :key="key" :label="item" :value="Number(key)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="role !== 2" label="价格定位">
            <el-select v-model="form.price_orientation" placeholder="价格定位" no-data-text="平价款" no-match-text="平价款" disabled>
              <el-option v-for="(item, key) in priceOrientationMap" :key="key" :label="item.name" :value="Number(key)"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- <el-form-item label="相机形状" prop="camera_shape">
          <el-select v-model="form.camera_shape" placeholder="请选择相机形状">
            <el-option
              v-for="(value, key) in cameraShapes"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="产品成本" prop="cost_price">
          <el-input v-model="form.cost_price" :disabled="isMultiPrice" type="number"></el-input>
          <el-switch
            v-model="isMultiPrice"
            @change="changeMultiPrice"
            active-text="开启区间价">
          </el-switch>
          <div v-if="isMultiPrice">
            <el-input v-model="form.multi_cost_price[key]" v-for="(item, key) in form.styles" :key="key" :placeholder="`${item} 价格`" type="number"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="颜色/款式">
          <draggable v-model="form.styles" group="people2" @start="drag=true" @end="endStyleDrag">
            <el-tag
              :key="style"
              v-for="style in form.styles"
              closable
              :disable-transitions="false"
              @close="deleteStyle(style)"
              size="medium"
              class="gc-draggable-tag">
              {{style}}
            </el-tag>
          </draggable>
          <el-input
            class="input-new-tag"
            v-if="styleInputVisible"
            v-model="styleInputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmStyleInput"
            @blur="confirmStyleInput"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showStyleInput">新增款式</el-button>

          <el-input
            class="input-new-tag"
            v-if="styleInputVisibleGrip"
            v-model="styleInputValueGrip"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmStyleInputGrip"
            @blur="confirmStyleInputGrip"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showStyleInputGrip">新增支架款式</el-button>

          <el-input
            class="input-new-tag"
            v-if="styleInputVisibleChain"
            v-model="styleInputValueChain"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmStyleInputChain"
            @blur="confirmStyleInputChain"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showStyleInputChain">新增手链款式</el-button>

          <el-input
            class="input-new-tag"
            v-if="styleInputVisibleGripChain"
            v-model="styleInputValueGripChain"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmStyleInputGripChain"
            @blur="confirmStyleInputGripChain"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showStyleInputGripChain">新增支架手链款式</el-button>

          <el-input
            class="input-new-tag"
            v-if="styleInputVisibleOnly"
            v-model="styleInputValueOnly"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmStyleInputOnly"
            @blur="confirmStyleInputOnly"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showStyleInputOnly">新增单壳</el-button>
        </el-form-item>

        <el-form-item v-if="form.styles && form.styles.length">
          <div class="gc-images">
            <div v-if="form.images_sku && !form.images_sku.length">
              <img v-for="item in globalSkuImages" :key="item" :src="item" class="gc-global-item-image">
            </div>
              <div>
                <el-upload
                  :action="uploadURL"
                  list-type="picture-card"
                  multiple
                  accept="image/*"
                  :file-list="form.images_sku"
                  :limit="form.styles.length"
                  :data="{
                    supplierId: form.supplier_id,
                    productId: productId
                  }"
                  :before-upload="beforeUploadImagesSku"
                  :on-preview="handleImageSkuPreview"
                  :on-remove="handleRemoveImageSku"
                  :on-change="handleChangeImageSku"
                  :on-success="handleImageSkuSuccess"
                  :on-error="handleUploadError">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
          </div>
        </el-form-item>

        <el-form-item label="颜色/款式信息">
          <el-button size="small" @click="addAccessory">新增信息</el-button>
          <div>
            <div v-for="(item, key) in form.sku_info" :key="key">
              <span>{{ form.styles[key] }}</span>
              <span v-for="(subItem, subKey) in item" :key="subKey">
                <el-tag @close="deleteAccessory(subItem, subKey, item, key)" size="mini" closable>{{ skuInfoMap[subItem.type] }}</el-tag>
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="form.types" :label="`型号(${form.types.length}个)`">
          <draggable v-model="form.types" group="people" @start="drag=true" @end="endTypeDrag">
            <el-tag
              :key="type"
              v-for="type in form.types"
              closable
              :disable-transitions="false"
              @close="deleteType(type)"
              size="medium"
              class="gc-draggable-tag">
              {{type}}
            </el-tag>
          </draggable>
          <el-input
            class="input-new-tag"
            v-if="typeInputVisible"
            v-model="typeInputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmTypeInput"
            @blur="confirmTypeInput"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTypeInput">新增型号</el-button>
          <div>
            <el-button @click="importTypes" type="text">导入iPhone 16 系列型号（临时功能）</el-button>
            <el-button @click="mergeTypes('15 Plus', '14 Plus')" type="text">合并iPhone 15Plus/14Plus</el-button>
            <el-button @click="mergeTypes('14', '13')" type="text">合并iPhone 14/13</el-button>
            <el-button @click="mergeTypes('12', '12 Pro')" type="text">合并iPhone 12/12Pro</el-button>
          </div>
          <div>
            <el-button @click="importAllTypes('mini')" type="text">iPhone最小集</el-button>
            <el-button @click="importAllTypes('max')" type="text">iPhone最大集</el-button>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" placement="bottom-start">
              <div slot="content" class="gc-sku-model">{{skuModel}}</div>
              <el-button type="text">当前商品SKU模型</el-button>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item v-if="isEdit" label="视频">
          <div class="gc-video">
              <div>
                <el-upload
                  v-loading.fullscreen.lock="isVideoLoading"
                  element-loading-text="正在上传视频..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  :disabled="!isAuth"
                  :action="uploadURL"
                  accept="video/*"
                  :limit="1"
                  :data="{
                    supplierId: form.supplier_id,
                    productId: productId,
                    id: form._id
                  }"
                  :before-upload="beforeVideoUpload"
                  :on-success="handleVideoSuccess"
                  :on-change="handleVideoChange"
                  :on-error="handleVideoError">
                  <el-button size="small" plain :disabled="!isAuth">点击上传视频</el-button>
                </el-upload>
              </div>
          </div>
          <div>{{form.video_url}}</div>
          <el-button @click="deleteVideo" size="small" plain>删除视频</el-button>
        </el-form-item>
        <el-form-item v-if="attributesList.length" label="属性">
          <el-select v-for="item in attributesList" v-model="attributes[item.attribute_id]" :key="item.attribute_id" :placeholder="`请选择 ${item.display_attribute_name}`" :multiple="item.input_type === 'MULTIPLE_SELECT_COMBO_BOX'">
            <el-option v-for="subItem in item.attribute_value_list" :key="subItem.value_id" :label="subItem.original_value_name" :value="subItem.value_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="role !== 2" label="主题店">
          <el-radio-group v-model="form.theme">
            <el-radio v-for="(themeShop, key) in themeShops" :label="Number(key)" :key="key">{{themeShop}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布日期" prop="launch_time">
          <el-date-picker
            v-model="form.launch_time"
            align="right"
            type="date"
            placeholder="选择发布日期"
            value-format="timestamp"
            format="yyyy-MM-dd"
            :picker-options="launchTimePickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div>
        <el-button v-if="!isEdit" type="primary" @click="handleClickAddProduct">创建商品</el-button>
        <template v-else>
          <el-button type="primary" @click="handleClickSaveProduct">保存商品</el-button>
          <el-button v-if="role !== 2" @click="copy">复制商品</el-button>
          <!--<el-button :disabled="form.old_supplier_id" @click="change">更换供应商</el-button>-->
          <el-button v-if="role !== 2" @click="change">更换商品</el-button>
          <el-button v-if="role !== 2" @click="openPublishDialog">发布商品</el-button>
          <el-button v-if="role !== 2" @click="handleDeleteProduct" type="danger">隐藏商品</el-button>
          <el-button v-if="role !== 2" @click="viewOrders">查看订单</el-button>
        </template>
        <el-button @click="cancel">返回商品列表</el-button>
      </div>
    </el-card>

    <el-dialog :title="`${currentCategoryShop.region}分类管理`" :visible.sync="dialogCategoryVisible">
      <el-form :model="formCategory">
        <el-form-item label="分类列表" label-width="100">
          <el-select v-model="formCategory.category" placeholder="请选择分类">
            <el-option v-for="item in categoryList" :key="item.shop_category_id" :label="item.name" :value="item.shop_category_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCategory">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`${currentDiscountShop.region}价格管理`" :visible.sync="dialogDiscountVisible">
      <el-descriptions :column="2" border>
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-price-tag"></i>价格{{currentDiscountShop.region}}</template><el-tag size="small">{{currentDiscountShop.price}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-discount"></i>折扣率</template><el-tag size="small">{{currentDiscountShop.discount}}</el-tag>
        </el-descriptions-item>
        <!-- <el-descriptions-item>
          <template slot="label"><i class="el-icon-discount"></i>佣金</template><el-tag size="small">{{currentDiscountShop.commissionPart}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-discount"></i>交易手续费</template><el-tag size="small">{{currentDiscountShop.transactionPart}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-discount"></i>活动服务费</template><el-tag size="small">{{currentDiscountShop.servicePart}}</el-tag>
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-discount"></i>藏价</template><el-tag size="small">{{currentDiscountShop.sellerPaysShipping}}</el-tag>
        </el-descriptions-item>
        <!-- <el-descriptions-item v-if="currentDiscountShop.profit">
          <template slot="label"><i class="el-icon-present"></i>预估利润</template><el-tag size="small">{{currentDiscountShop.profit.toFixed(2)}}</el-tag>
          <el-tag size="small" type="danger">{{(currentDiscountShop.profit / exchangeRate[currentDiscountShop.region]).toFixed(2)}}</el-tag>
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-pie-chart"></i>预估利润率</template><el-tag size="small">{{(currentDiscountShop.profitMargin * 100).toFixed(2)}}%</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-form :model="formDiscount" v-loading="loadingDiscount" label-position="right">
        <el-form-item label="折扣列表" label-width="100">
          <el-select v-model="formDiscount.discount" placeholder="请选择折扣">
            <el-option v-for="item in discountList" :key="item.discount_id" :label="item.discount_name" :value="item.discount_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置价格" label-width="100">
          <el-input v-model="exactPrice" placeholder="请输入价格"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loadingDiscount" type="danger" @click="unbindDiscount">解绑折扣</el-button>
        <el-button :disabled="loadingDiscount || exactPrice" type="primary" @click="confirmDiscount">绑定默认折扣</el-button>
        <el-button :disabled="loadingDiscount || !exactPrice" type="primary" @click="confirmDiscount">绑定折扣</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`${currentPromotionShop.region}促销管理`" :visible.sync="dialogPromotionVisible">
      <el-table
        :data="currentPromotionData"
        style="width: 100%"
        empty-text="商品在此站点无折扣/套装/价格活动">
        <el-table-column
          prop="type"
          label="活动名称">
        </el-table-column>
        <el-table-column
          prop="promotion_id"
          label="活动id">
        </el-table-column>
        <el-table-column
          prop="models"
          label="活动model">
          <template slot-scope="scope">
            <div v-for="item in scope.row.models" :key="item.id">
              <span>{{ item.id }}</span>
              <el-tag>{{ item.price }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="removePromotion(scope.row)" type="text" size="small">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="修改商品状态"
      :visible.sync="dialogStatusVisible"
      width="30%">
        <el-select v-model="selectedStatus" placeholder="请选择">
          <el-option
            v-for="(item, key) in status"
            :key="key"
            :label="item"
            :value="key">
          </el-option>
        </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStatusVisible = false">取 消</el-button>
        <el-button type="danger" @click="confirmStatus">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="更换商品"
      :visible.sync="dialogChangeVisible"
      width="30%">
        <el-select v-model="selectedNewSupplier" placeholder="请选择新供应商" filterable>
          <el-option v-for="item in supplierList" :key="item.serial" :label="item.name" :value="item.serial"></el-option>
        </el-select>
        <div v-if="selectedNewSupplier">全球商品货号将替换为：{{_id}}-{{selectedNewSupplier}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeVisible = false">取 消</el-button>
        <el-button type="danger" @click="confirmChange">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="全球商品详情"
      :visible.sync="dialogItemDetailVisible"
      fullscreen>
        <div v-if="dialogItemDetailVisible">
          <div>
            <el-button @click="confirmProductStatus(4)" :disabled="form.status === 4">
              <span v-if="form.status === 4">测款结束: 已下架</span>
              <span v-else>一键测款结束</span>
            </el-button>
            <el-button @click="confirmProductStatus(9)" :disabled="form.status === 9">
              <span v-if="form.status === 9">待更换</span>
              <span v-else>一键待更换</span>
            </el-button>
            <el-button @click="unlistEmpty(form.global_item_id)">全部下架且库存调0</el-button>
          </div>
          <div>
            <span style="color: red;">测款建议：{{adoptSuggest === 0 ? '下架': '综合考虑' }}</span>
          </div>
          <el-table
            :data="salesList"
            border
            style="width: 100%">
            <el-table-column
              prop="region"
              label="站点">
              <template slot-scope="scope">
                <el-button @click="viewShopItemDetail({item: {shop_id: scope.row.shop_id, item_id: scope.row.item_id}, region: scope.row.region})" type="text">{{ scope.row.region }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
              <template slot-scope="scope">
                <el-tag>{{ productStatus[scope.row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="sale"
              label="销量">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.sale }}</el-tag>
                <el-link v-if="scope.row.sale" @click="viewOrders" type="success" size="mini">查看订单</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="likes"
              label="点赞">
            </el-table-column>
            <el-table-column
              prop="rating_star"
              label="评分">
              <template slot-scope="scope">
                <el-rate
                  v-model="scope.row.rating_star"
                  disabled
                  show-score
                  allow-half
                  text-color="#ff9900">
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column
              prop="views"
              label="浏览">
            </el-table-column>
          </el-table>
          <el-descriptions class="margin-top" title="线上全球商品SKU" :column="1" border>
            <template slot="extra">
              <el-button type="primary" size="small">操作</el-button>
            </template>
            <el-descriptions-item v-for="(variation, key) in globalTierVariation" :key="key">
              <template slot="label">
                {{variation.name}}
              </template>
              <div>
                <div v-for="item in variation.option_list" :key="item.option">
                  <img v-if="item.image" :src="item.image.image_url" style="width: 100px;">
                  <span>{{item.option}}</span>
                </div>
              </div>
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions v-if="form.styles" class="margin-top" title="本地SKU" :column="1" border>
            <template slot="extra">
              <el-button v-if="form.styles.length !== globalTierVariation[0].option_list.length || form.types.length !== globalTierVariation[1].option_list.length" size="mini" type="primary" @click="updateGlobalItemModel">shopee全球商品SKU修改</el-button>
            </template>
            <el-descriptions-item>
              <template slot="label">
                <span>Colors_local</span>
                <span v-if="form.styles.length !== globalTierVariation[0].option_list.length">(有变更)</span>
              </template>
              <div>
                <div v-for="(item, index) in form.styles" :key="index">
                  <img v-if="form.images_sku[index] && form.images_sku[index].url" :src="form.images_sku[index].url" style="width: 100px;">
                  <span>{{item}}</span>
                  <el-button v-if="form.styles.length !== globalTierVariation[0].option_list.length" @click="addModelSku(item, index, 0)" size="mini">新增SKU</el-button>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span>Type_local</span>
                <span v-if="form.types.length !== globalTierVariation[1].option_list.length">(有变更)</span>
              </template>
              <div>
                <div v-for="(item, index) in form.types" :key="index">
                  <span>{{item}}</span>
                  <!-- <el-button v-if="form.types.length !== globalTierVariation[1].option_list.length" @click="addModelSku(item, index, 1)" size="mini">新增SKU</el-button> -->
                  <el-button @click="addModelSku(item, index, 1)" size="mini">新增SKU</el-button>
                </div>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <div>
            <el-button @click="changeShopeeGlobalInventory(0)" type="danger" size="mini">库存全部调0</el-button>
            <el-button @click="changeShopeeGlobalInventory(100)" type="primary" size="mini">库存全部调100</el-button>
            <el-button @click="changeShopeeGlobalSku" type="primary" size="mini">更新全部SKU_ID</el-button>
          </div>
          <el-table
            :data="globalModel"
            border
            style="width: 100%">
            <el-table-column
              prop="tier_index"
              label="图片">
              <template slot-scope="scope">
                <img v-if="globalTierVariation[0].option_list[scope.row.tier_index[0]]" style="width: 100%;" :src="globalTierVariation[0].option_list[scope.row.tier_index[0]].image.image_url">
                <img v-else style="width: 100%;" :src="form.images_sku[scope.row.tier_index[0]].url">
              </template>
            </el-table-column>
            <el-table-column
              prop="tier_index"
              label="名称">
              <template slot-scope="scope">
                <span>{{globalTierVariation[0].option_list[scope.row.tier_index[0]].option}}</span>
                <span v-if="globalTierVariation[1].option_list[scope.row.tier_index[1]]">{{globalTierVariation[1].option_list[scope.row.tier_index[1]].option}}</span>
                <span v-else>{{ form.types[scope.row.tier_index[1]] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="global_model_id"
              label="model id">
            </el-table-column>
            <el-table-column
              prop="global_model_sku"
              type="string"
              label="model sku">
            </el-table-column>
            <el-table-column
              prop="tier_index"
              label="tier index">
              <template slot-scope="scope">
                {{scope.row.tier_index.join('-')}}
              </template>
            </el-table-column>
            <el-table-column
              prop="stock_info"
              label="库存">
              <template slot-scope="scope">
                <div v-if="scope.row.stock_info.length">
                  <div>现有库存<el-tag>{{scope.row.stock_info[0].current_stock}}</el-tag></div>
                  <!--<div>普通库存<el-tag>{{scope.row.stock_info[0].normal_stock}}</el-tag></div>-->
                  <div>普通库存<el-tag>{{scope.row.stock_info[0].seller_stock || scope.row.stock_info[0].normal_stock}}</el-tag></div>
                  <div>保留库存<el-tag>{{scope.row.stock_info[0].reserved_stock}}</el-tag></div>
                </div>
                <div v-else>
                  <span>暂无</span>
                </div>

              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="操作">
              <template slot-scope="scope">
                <div><el-button @click="changeShopeeGlobalInventory(0, scope.row)" type="danger" size="mini">库存调0</el-button></div>
                <div><el-button @click="changeShopeeGlobalInventory(100, scope.row)" type="primary" size="mini">库存调100</el-button></div>
                <div><el-button v-if="!scope.row.global_model_id" @click="addModel(scope.row)" size="mini">新增model</el-button></div>
                <div><el-button @click="deleteModel(scope.row)" type="danger" size="mini">删除</el-button></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogItemDetailVisible = false">取 消</el-button>
        <el-button type="danger" @click="dialogItemDetailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <ShopItemDetail
      :show="dialogShopItemDetailVisible"
      :shopItem="shopItem"
      :currentShopeeItemDetail="currentShopeeItemDetail"
      :currentDescriptionShopee="currentDescriptionShopee"
      :modelList="modelList[currentShopeeItemDetail.shopId]"
      :exchangeRate="exchangeRate"
      @close="closeDialogShopItemDetail"
      @updata-sku="handleUpdateTierVariationProduct"
    ></ShopItemDetail>
    <el-dialog
      :title="`店铺商品详情 Lazada ${currentLazadaItemDetail.region}`"
      :visible.sync="dialogLazadaItemDetailVisible"
      fullscreen>
        <div>
          <el-descriptions v-if="itemDetailLazada.attributes" :column="1" border>
            <el-descriptions-item>
              <template slot="label">商品名称</template>{{itemDetailLazada.attributes.name}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">商品短描述</template>
              <div v-html="itemDetailLazada.attributes.short_description"></div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">状态</template>
              <el-tag>{{itemDetailLazada.status}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">操作</template>
              <el-button @click="deactivateProductLazada" :disabled="itemDetailLazada.status === 'InActive'">全部下架</el-button>
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            :data="itemDetailLazada.skus"
            border
            style="width: 100%">
            <el-table-column
              prop="Images"
              label="图片">
              <template slot-scope="scope">
                <img style="width: 100%;" :src="scope.row.Images[0]">
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="名称">
              <template slot-scope="scope">
                <span>{{scope.row.color_family}}</span>
                <span>{{scope.row.compatibility_by_model}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="SkuId"
              label="model id">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="库存">
            </el-table-column>
            <el-table-column
              prop=""
              label="状态">
              <template slot-scope="scope">
                {{scope.row.Status}}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="操作">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.Status === 'inactive'" @click="changeModelStatus(scope.row)" size="mini">下架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLazadaItemDetailVisible = false">取 消</el-button>
        <el-button type="danger" @click="dialogLazadaItemDetailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发布商品" :visible.sync="dialogPublishVisible" width="70%">
      <el-tabs v-model="activePublishTab">
        <el-tab-pane label="Shopee" name="shopee">
          <div v-if="isEdit">
            <div style="margin-bottom: 10px;">
              <el-button size="mini" :disabled="Boolean(isEdit && isShopeeGlobalItem) || !isEdit" type="primary" @click="addGlobalItem2Shopee('autoPush')">shopee全球商品上传(并排期)</el-button>
              <el-button size="mini" :disabled="Boolean(isEdit && isShopeeGlobalItem) || !isEdit" type="primary" @click="addGlobalItem2Shopee">shopee全球商品上传(仅上传，手动发布到各站点)</el-button>
              <el-tag v-if="isGlobalUploadSuccess" type="success">上传成功</el-tag>
            </div>
            <div style="margin-bottom: 10px;">
              <el-button size="mini" :disabled="!isEdit" type="primary" @click="publishGlobal">全球站点一键发布</el-button>
              <!-- <el-button size="mini" disabled type="primary" @click="publishGlobal">全球站点一键发布</el-button> -->
              <el-button size="mini" :disabled="!form.global_item_id" type="primary" @click="pushTask(form.global_item_id)">全部加入上新队列</el-button>
              <el-button size="mini" :disabled="!canDiscountGlobal" type="danger" @click="setGlobalDiscount">全球站点一键设置基础折扣</el-button>
            </div>
            <div style="margin-bottom: 10px;">
              <el-button size="mini" :disabled="!form.global_item_id" type="primary" @click="unlistEmpty(form.global_item_id)">全部下架且库存调0</el-button>
            </div>
            <div style="margin-bottom: 10px;">
              <el-button size="mini" @click="viewGlobalItemDetail">查看全球商品详情</el-button>
            </div>
          </div>
          <!--
          <div v-for="(shops, shopIndex) in themeShops" :key="shopIndex">
            <div v-if="shopIndex === Number(form.theme)">
              <div v-for="(item, key) in shopDataEchelon[form.theme]" :key="item.id">
                <el-button size="mini" :disabled="Boolean(item.published)" class="gc-publish-button" @click="publish({id: item.id, region: key})">{{key}}</el-button>
                <el-tag v-if="shopData[key].item_status" class="gc-product-status" size="mini">{{productStatus[shopData[key].item_status]}}</el-tag>
                <el-tag v-else class="gc-product-status" size="mini">UNLISTED</el-tag>
                <el-button @click="openDiscountDialog({id: item.id, region: key})" size="mini" :disabled="!canDiscountGlobal">价格管理</el-button>
                <el-button @click="openPromotionDialog({id: item.id, region: key})" size="mini" :disabled="!canDiscountGlobal">促销管理</el-button>
                <el-button @click="openCategoryDialog({id: item.id, region: key})" size="mini">分类管理</el-button>
                <el-button @click="viewShopItemDetail({item, region: key})" size="mini">查看店铺商品详情</el-button>
              </div>
            </div>
          </div>
          -->
          <div v-if="isShopeeGlobalItem" v-for="(item, key) in regionShop" :key="key">
            <el-button-group class="gc-publish-button">
              <el-button v-for="subItem in item" :key="subItem.shop_id" :disabled="publishedMap && Boolean(publishedMap[Number(subItem.shop_id)])" size="mini" @click="publish({id: Number(subItem.shop_id), region: subItem.region})">{{ subItem.region }}({{ subItem.theme_id }})</el-button>
            </el-button-group>
            <span v-for="subItem in item" :key="subItem.shop_id">
              <span v-if="publishedMap && Boolean(publishedMap[Number(subItem.shop_id)])">
                <el-tag v-if="publishedMap[subItem.shop_id].item_status" class="gc-product-status" size="mini">{{productStatus[publishedMap[subItem.shop_id].item_status]}}</el-tag>
                <el-tag v-else class="gc-product-status" size="mini">UNLISTED</el-tag>
                <el-button @click="openDiscountDialog({id: publishedMap[subItem.shop_id].item_id, region: publishedMap[subItem.shop_id].shop_region.toUpperCase(), shop_id: subItem.shop_id})" size="mini" :disabled="!canDiscountGlobal">价格管理</el-button>
                <el-button @click="openPromotionDialog({id: publishedMap[subItem.shop_id].item_id, region: publishedMap[subItem.shop_id].shop_region.toUpperCase(), shop_id: subItem.shop_id})" size="mini" :disabled="!canDiscountGlobal">促销管理</el-button>
                <el-button @click="openCategoryDialog({id: publishedMap[subItem.shop_id].item_id, region: publishedMap[subItem.shop_id].shop_region.toUpperCase(), shop_id: subItem.shop_id})" size="mini">分类管理</el-button>
                <el-button @click="list({id: publishedMap[subItem.shop_id].item_id, region: publishedMap[subItem.shop_id].shop_region.toUpperCase(), shop_id: subItem.shop_id})" size="mini">上架</el-button>
                <el-button @click="unlist({id: publishedMap[subItem.shop_id].item_id, region: publishedMap[subItem.shop_id].shop_region.toUpperCase(), shop_id: subItem.shop_id})" size="mini">下架</el-button>
                <el-button @click="handleDeleteItem({id: publishedMap[subItem.shop_id].item_id, region: publishedMap[subItem.shop_id].shop_region.toUpperCase(), shop_id: subItem.shop_id})" size="mini">删除</el-button>
                <el-button @click="viewShopItemDetail({item: {shop_id: subItem.shop_id, item_id: publishedMap[subItem.shop_id].item_id}, region: publishedMap[subItem.shop_id].shop_region.toUpperCase()})" size="mini">查看店铺商品详情</el-button>
              </span>
            </span>
          </div>

        </el-tab-pane>
        <el-tab-pane label="Lazada" name="lazada">
<!--           <div>
            <el-button @click="publishAllLazada" size="mini">lazada 各站点一键发布</el-button>
          </div> -->
          <div v-for="item in shopInLazada" :key="item.id">
            <el-button size="mini" class="gc-publish-button" @click="publishItem2Lazada({region: item})" :disabled="Boolean(form.item_id_in_lazada && form.item_id_in_lazada[item])">{{item}}</el-button>
            <span v-if="form.item_id_in_lazada">{{form.item_id_in_lazada[item]}}</span>
            <el-button size="mini" @click="viewShopItemDetailLazada(item)">查看店铺商品详情</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Tiktok" name="tiktok">
          <div style="margin-bottom: 10px;">
            <el-button v-if="form.global_item_id_in_tiktok" @click="handleGetGlobalProduct" size="mini">查看 Tiktok 全球商品详情</el-button>
            <el-button v-else @click="addProductTiktok" size="mini">tiktok全球商品上传</el-button>
            <el-tag v-if="resultGlobalProductTiktok" type="success" size="mini">上传成功</el-tag>
          </div>
          <div>
            <el-button v-if="form.global_item_id_in_tiktok" @click="publishProductTiktok('all')" size="mini">tiktok全球站点一健发布</el-button>
          </div>
          <div v-if="form.global_item_id_in_tiktok">
            <div v-for="item in shopInTiktok" :key="item">
              <el-button @click="publishProductTiktok(item)" :disabled="publishedTiktok[item]" class="gc-publish-button" size="mini">{{item}}</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Coupang" name="coupang">
          <div v-if="!form.item_id_in_coupang">
            <el-button @click="coupangAddProduct" size="mini">新建商品</el-button>
            <el-button @click="testProductSearch" size="mini">测试查询商品</el-button>
            <!-- <el-button @click="testCategory" size="mini">测试查询分类</el-button> -->
          </div>
          <div v-else>
            <el-tag size="mini">{{form.item_id_in_coupang}}</el-tag>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="已生成描述" :visible.sync="dialogDescriptionVisible" width="70%">
      <el-tabs v-model="activeDescriptionTab">
        <el-tab-pane label="Shopee" name="shopee">
          <div class="gc-description gc-description-detail">{{currentDescriptionShopee}}</div>
        </el-tab-pane>
        <el-tab-pane label="Lazada" name="lazada">
          <div class="gc-description gc-description-detail" v-html="currentDescriptionLazada"></div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <ImagePreview
      :show="dialogImagePreviewVisible"
      :index="imagePreviewIndex"
      :images="currentImages"
      :current="currentPreviewImage"
      @close="closeDialogImagePreview"
      @main="setMainImage"
      @last="setLastImage"
      @forward="forwardImage"
      @backward="backwardImage"
      @option="setOptionImage"
    ></ImagePreview>
    <el-dialog
      title="颜色款式信息编辑"
      :visible.sync="dialogAccessoryVisible"
      width="50%">
      <div v-if="form.styles">
        <el-form ref="formAccessory" :model="accessory" label-width="80px" size="mini">
          <el-form-item label="颜色/款式">
            <el-select v-model="accessory.main" placeholder="请选择颜色/款式">
              <el-option v-for="(value, index) in form.styles" :label="value" :value="index" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="信息类型">
            <el-select v-model="accessory.type" placeholder="请选择信息" multiple filterable>
              <el-option-group label="配件">
                <el-option v-for="(value, key) in accessoryType" :label="value" :value="key" :key="key"></el-option>
              </el-option-group>
              <el-option-group label="颜色">
                <el-option v-for="(value, key) in color" :label="value" :value="key" :key="key"></el-option>
              </el-option-group>
              <el-option-group label="材质">
                <el-option v-for="(value, key) in texture" :label="value" :value="key" :key="key"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAccessoryDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="addAccessoryAction" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import _ from 'lodash'
import ShopItemDetail from '@/components/ShopItemDetail.vue'
import ImagePreview from '@/components/ImagePreview.vue'

import {
  categoryIdShopeePhoneCase,
  categoryIdShopeeTabletCase,
  categoryIdShopeeAirpodsCase,
  categoryIdShopeeScreenProtector,
  categoryIdShopeeCable,
  categoryIdShopeeSticker,
  categoryIdShopeePhoneStrap,
  categoryIdShopeeHolderPopsocket,
  categoryIdShopeePhoneBag,
  categoryIdShopeeGameAccessory,
  categoryIdShopeeCarPhoneHolder,
  categoryIdShopeeFan,
  categoryIdShopeePortableLamp,
  categoryIdShopeeWatchband,
  categoryIdShopeeCableProtector,
  accessories
} from '@/constants/categoryIds'
import {baseURL} from '@/constants/url'
import brandCompatibility, {
  brandCompatibilityInLazada,
  iPhoneType,
  iPhoneTypeMini,
  iPadType,
  SAMSUNGType,
  HUAWEIType,
  // XiaomiType,
  AirPodsType,
  POCOType,
  OnePlusType,
  SonyXperiaType,
  GooglePixelType,
  MotorolaType,
  iWatchType,
  iPhoneTypeInTitle,
  iPhoneTypeInTitleSimple,
  SamsungTypeInTitleZFlip,
  iPadTypeInTitle,
  SamsungTypeInTitle,
  HuaweiTypeInTitle,
  // XiaomiTypeInTitle,
  AirPodsTypeInTitle,
  POCOTypeInTitle,
  OnePlusInTitle,
  SonyXperiaInTitle,
  GooglePixelInTitle,
  MotorolaInTitle,
  iWatchInTitle
} from '@/constants/brandCompatibility'
import station from '@/constants/station.js'
import {
  shopIdInShopee,
  logisticIdShopee,
  nameLength,
  productStatus,
  // shopBasicDiscountInShopee,
  // basicDiscountIdInShopee,
  promotionNames
  // themeShops
} from '@/constants/shopee.js'
import {shopInLazada, shopBasicDiscountInLazada} from '@/constants/lazada.js'
import {
  vendorId,
  vendorUserId,
  saleEndedAt,
  registrationType,
  categoryIdPhoneCase,
  categoryIdEarphoneCase,
  NAME_PHONE_CASE
} from '@/constants/coupang.js'

import {material, cameraShapes, hardness} from '@/constants/description.js'
import {imagePrinciple, themeShops, checkStatus, priceOrientationMap, tagTypeMap} from '@/constants/normal'
import {
    packaging,
    otherPacking,
    qc
} from '@/constants/packaging.js'
import {accessoryType, color, texture} from '@/constants/product'
import {getBrandCompatibilityId, adoptedPromotion} from '@/utils/index.js'
import {getAttributeList, genereateLazadaCaseFunction} from '@/utils/attributes.js'
import {getProfit} from '@/utils/profit.js'
import {generatePrice, generateMoney} from '@/utils/generate/generatePrice'
import {generateCategoryId, generateCategoryIdLazada} from '@/utils/generate/generateCategoryId'
import {imageDomain, waters} from '@/constants/aliyun'
import {getProducts, addProduct, editProduct, editProductStatus, getNewId, editAttribute, editProductVideo} from '@/apis/product.js'
import {getDescriptions} from '@/apis/description.js'
import {getSupplier} from '@/apis/supplier.js'
import {getShops} from '@/apis/shop.js'
import {addTask, editTask} from '@/apis/task.js'
import {getTag} from '@/apis/tag.js'
import {getType} from '@/apis/type.js'

import {addProductCP, searchProduct, searchCategory} from '@/apis/coupang.js'
import {
  createProductTiktok,
  publishProductTiktok,
  uploadImageTikTok,
  getGlobalProductTiktok
} from '@/apis/tiktok/product'

import status from '@/constants/status.js'
import {shopInTiktok} from '@/constants/tiktok'
import {
  generateCoupangItems
} from '@/utils/coupang/index.js'
// import {exchangeRate} from '@/constants/exchange.js'

import {
  addGlobalItem,
  uploadImage,
  initTierVariation,
  updateTierVariation,
  getPublishedList,
  // getPublishableShop,
  getGlobalItemInfo,
  getGlobalModelList,
  // getChannelList,
  createPublishTask,
  getPublishTaskResult,
  getShopCategoryList,
  addItemListToShopCategory,
  getDiscountList,
  addDiscountItem,
  getModelList,
  deleteDiscountItem,
  getAttributes,
  getItemPromotion,
  deleteBundleDealItem,
  deleteAddOnDealMainItem,
  deleteAddOnDealSubItem,
  getItemBaseInfo,
  getItemExtraInfo,
  updateGlobalItemStock,
  updateGlobalItem,
  updateGlobalModel,
  addGlobalModel,
  deleteGlobalModel,
  unlistItems,
  deleteItem,
  updateTierVariationProduct,
  updateShopItem
} from '@/apis/shopee.js'
import {
  createProduct,
  imageMigrate,
  productItemGet,
  deactivateProduct
} from '@/apis/productLazada.js'
import {
  getDefaultDiscount
} from '@/apis/activity.js'
import {generateDescription, generateShortDescription, generateDescriptionInLazada} from '@/utils/generate/generateDescription'
import {generateShopProductTitle} from '@/utils/generate/generateTitle'

export default {
  name: 'Add',
  components: {
    draggable,
    ShopItemDetail,
    ImagePreview
  },
  props: ['username', 'role', 'exchangeRate'],
  data () {
    return {
      shopInTiktok,
      selectedTags: [],
      tagTypeMap,
      accessoryType,
      color,
      texture,
      skuInfoMap: {...accessoryType, ...color, ...texture},
      imagePrinciple,
      categoryIdShopeePhoneCase,
      categoryIdShopeeTabletCase,
      categoryIdShopeeAirpodsCase,
      categoryIdShopeeScreenProtector,
      categoryIdShopeeCable,
      categoryIdShopeeSticker,
      categoryIdShopeePhoneStrap,
      categoryIdShopeeHolderPopsocket,
      categoryIdShopeePhoneBag,
      categoryIdShopeeGameAccessory,
      categoryIdShopeeCarPhoneHolder,
      categoryIdShopeeFan,
      categoryIdShopeePortableLamp,
      categoryIdShopeeWatchband,
      categoryIdShopeeCableProtector,
      uploadURL: `${baseURL}/product/upload`,
      uploadURLFile: `${baseURL}/product/uploadFile`,
      imageDomain,
      brandCompatibility,
      station,
      material,
      form: {
        styles: [],
        types: [],
        material: [
          'Thermoplastic Polyurethane (TPU)'
        ],
        model_type: '',
        multi_cost_price: [],
        launch_time: Date.now(),
        theme: 0,
        features: [
          'Precise Cutouts',
          'Exquisite Tactile Button',
          'Easy to Install',
          'Novel Design'
        ],
        images: [],
        images_sku: [],
        cost_price: 0,
        hardness: 0,
        inventory: {
          need: 1
        },
        outerPacking: '',
        otherPacking: '',
        quality_control: [],
        price_orientation: 0,
        sku_info: {}
      },
      rules: {
        // id: {required: true},
        // name_by_supplier: {required: true},
        supplier_id: {required: true},
        // brand_compatibility_id: {required: true},
        // cost_price: {required: true},
        material: {required: true},
        features: {required: true}
      },
      isEdit: false,
      isCopy: false,
      styleInputVisible: false,
      styleInputVisibleGrip: false,
      styleInputVisibleChain: false,
      styleInputVisibleGripChain: false,
      styleInputVisibleOnly: false,
      styleInputValue: '',
      styleInputValueGrip: '&grip',
      styleInputValueChain: '&chain',
      styleInputValueGripChain: '&grip&chain',
      styleInputValueOnly: 'only case',
      typeInputVisible: false,
      typeInputValue: '',
      skuModel: 'SKU未输入',
      dialogImagePreviewVisible: false,
      productId: '',
      uploadData: {

      },
      descriptionLibary: [],
      adoptedDescriptionList: [],

      code: '',
      accessToken: '',

      shopData: {},
      isShopeeGlobalItem: false,
      globalImages: [],
      globalSkuImages: [],
      globalTierVariation: [],
      globalModel: [],

      shopInLazada,
      // series: [],
      supplierList: [],
      dialogCategoryVisible: false,
      formCategory: {},
      categoryList: [],
      currentCategoryShop: {},
      productStatus,
      currentDiscountShop: {},
      currentPromotionData: [],
      currentPromotionShop: {},
      formDiscount: {},
      dialogDiscountVisible: false,
      dialogPromotionVisible: false,
      dialogAccessoryVisible: false,
      discountList: [],
      modelList: {},

      loadingDiscount: true,
      canDiscountGlobal: false,

      tabChooser: categoryIdShopeePhoneCase,
      exactPrice: undefined,
      attributesList: [],
      attributes: {},
      status,
      statusColor: {
        1: 'success',
        2: 'danger',
        3: 'info'
      },
      dialogStatusVisible: false,
      selectedStatus: undefined,
      // exchangeRate,
      isMultiPrice: false,

      launchTimePickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      globalItemShopee: {},
      dialogItemDetailVisible: false,
      dialogShopItemDetailVisible: false,
      dialogLazadaItemDetailVisible: false,
      currentShopeeItemDetail: {},
      currentLazadaItemDetail: {},
      itemDetailLazada: {},
      shopItem: {},
      shopeeThemeShop: '',
      themeShops,
      dialogChangeVisible: false,
      selectedNewSupplier: '',
      cameraShapes,
      dialogPublishVisible: false,
      activePublishTab: 'shopee',
      dialogDescriptionVisible: false,
      activeDescriptionTab: 'shopee',
      isUnimportanceShow: false,
      isUnimportanceShow2: false,
      imagePreviewIndex: undefined,
      currentPreviewImage: null,
      currentImages: [],
      isVideoLoading: false,
      isAuth: false,
      basicDiscountIdInShopee: null,
      hardness,
      shops: [],
      regionShop: null,
      publishedMap: null,
      salesList: [],
      checkStatus,
      packaging,
      otherPacking,
      qc,
      priceOrientationMap,
      accessory: {
        main: '',
        type: ''
      },
      tagsMap: {
        1: '绿色'
      },
      tags: [],
      adoptedTags: [],
      isGlobalUploadSuccess: false,
      daysShip: 2,
      productDataTiktok: {},
      publishedTiktok: {},
      resultGlobalProductTiktok: ''
    }
  },
  created () {
    this.initSupplier()
    getDescriptions().then(data => {
      this.descriptionLibary = data

      let tmpMap = {}
      data.forEach(item => {
        if (!tmpMap[item.type]) tmpMap[item.type] = []
        tmpMap[item.type].push(item)
      })

      let adoptedDescriptionList = []

      Object.keys(tmpMap).forEach(item => {
        adoptedDescriptionList.push({
          label: item,
          options: tmpMap[item]
        })
      })

      this.adoptedDescriptionList = adoptedDescriptionList
    })
    if (this.$route.query.id) {
      const id = this.$route.query.id
      this.isEdit = true

      this.initProduct(id)
      this.initShop()
    }
    if (this.$route.query.origin && this.$route.query.target) {
      const origin = this.$route.query.origin
      this.isCopy = true
      this.initProduct(origin)
    }
    getTag().then(data => {
      this.tags = data
      let adoptedTags = []
      data.forEach(item => {
        if (!adoptedTags[item.type]) adoptedTags[item.type] = []
        adoptedTags[item.type].push(item)
      })
      this.adoptedTags = adoptedTags
    })
  },
  computed: {
    adoptSuggest () {
      let saleMax = 0
      let saleTotal = 0
      let viewsMax = 0
      let viewsTotal = 0
      let likesMax = 0
      let likesTotal = 0
      this.salesList.forEach(item => {
        if (item.sale) {
          saleTotal += item.sale
          if (item.sale > saleMax) {
            saleMax = item.sale
          }
        }
        if (item.views) {
          viewsTotal += item.views
          if (item.views > viewsMax) {
            viewsMax = item.views
          }
        }
        if (item.likes) {
          likesTotal += item.likes
          if (item.likes > likesMax) {
            likesMax = item.likes
          }
        }
      })

      if (viewsMax < 10 && viewsTotal < 20 && likesMax < 5 && likesTotal < 10 && saleMax < 2 && saleTotal < 4) {
        return 0
      } else {
        return 1
      }
    },
    computedImageName () {
      return this.form.images.length
    },
    globalItemName () {
      if (Number(this.tabChooser) === categoryIdShopeeHolderPopsocket) return `${this.form.selling_point} Phone Stand`
      if (this.isGeneral) return this.form.selling_point
      return `${this.form.selling_point} for ${brandCompatibility[this.form.brand_compatibility_id]}`
    },
    _id () {
      if (this.form._id) return this.form._id.toString()
      if (!this.form.brand_compatibility_id) return `100${this.form.supplier_id}${this.productId}`
      return `20${this.form.brand_compatibility_id}${this.form.supplier_id}${this.productId}`
    },
    currentSupplier () {
      let current = this.supplierList.find(item => {
        return item.serial === this.form.supplier_id
      })
      if (current && current.series) {
        current.series = current.series.sort(() => -1)
      }
      return current
    },
    isGeneral () {
      return [
        categoryIdShopeePhoneCase,
        categoryIdShopeeTabletCase,
        categoryIdShopeeAirpodsCase,
        categoryIdShopeeScreenProtector,
        categoryIdShopeeWatchband
      ].indexOf(this.tabChooser) < 0
    },
    shopDataEchelon () {
      const shopDataEchelon = {}
      Object.keys(this.shopData).forEach(item => {
        if (item.length === 2) {
          if (!shopDataEchelon[0]) {
            shopDataEchelon[0] = {}
          }
          shopDataEchelon[0][item] = this.shopData[item]
        } else {
          const serial = item.split('_')[1]
          if (!shopDataEchelon[serial]) {
            shopDataEchelon[serial] = {}
          }
          shopDataEchelon[serial][item] = this.shopData[item]
        }
      })
      return shopDataEchelon
    },
    currentDescriptionShopee () {
      return generateDescription(this.form, this.descriptionLibary, undefined, this.isGeneral)
    },
    currentDescriptionLazada () {
      return generateShortDescription(this.form.features, this.descriptionLibary)
    },
    water () {
      return waters[0]
      // return waters[this.form.theme]
    }
  },
  watch: {
    'form.styles' (value, oldValue) {
      this.updateSkuModel()
    },
    'form.types' () {
      this.updateSkuModel()
    },
    tabChooser () {
      this.form.category = this.tabChooser
    },
    'form.tags' (value, oldValue) {
      let formFeatures = this.form.features
      value.map(item => {
        console.log(item.features)
        if (item.features) {
          const features = item.features.split(',')
          formFeatures = formFeatures.concat(features)
        }
      })
      formFeatures = Array.from(new Set(formFeatures))
      this.form.features = formFeatures
      this.$forceUpdate()
    },
    activePublishTab (value) {
      if (value === 'tiktok' && this.form.global_item_id_in_tiktok) {
        getGlobalProductTiktok({global_product_id: this.form.global_item_id_in_tiktok}).then(data => {
          this.productDataTiktok = data.data
          this.productDataTiktok.products.forEach(item => {
            this.publishedTiktok[item.region] = true
          })
          this.$forceUpdate()
        })
      }
    }
  },
  methods: {
    publishProductTiktok (region) {
      let publishTarget = []

      getGlobalProductTiktok({global_product_id: this.form.global_item_id_in_tiktok}).then(data => {
        if (region === 'all') {
          shopInTiktok.forEach(shop => {
            publishTarget.push({
              region: shop,
              skus: data.data.skus.map(item => {
                return {
                  related_global_sku_id: item.id,
                  inventory: {
                    quantity: 500
                  }
                }
              })
            })
          })
        } else {
          publishTarget.push({
            region,
            skus: data.data.skus.map(item => {
              return {
                related_global_sku_id: item.id,
                inventory: {
                  quantity: 500
                }
              }
            })
          })
        }

        publishProductTiktok({
          global_product_id: this.form.global_item_id_in_tiktok,
          publish_target: publishTarget
        }).then(data => {
          if (data.data.publish_result.length) {
            this.$message.success(data.data.publish_result)
          }
        })
      })
    },
    handleGetGlobalProduct () {
      getGlobalProductTiktok({global_product_id: this.form.global_item_id_in_tiktok}).then(data => {
        console.log(data)
      })
    },
    generateUSDPrice (cost) {
      return String((cost * 3 * this.exchangeRate['US']).toFixed(3))
    },
    addProductTiktok () {
      const imagePromises = this.form.images.slice(0, 9).map(item => {
        let tmp = item.url.split('?')
        let tmp2 = tmp[0].split('/')

        return new Promise(resolve => {
          uploadImageTikTok({
            supplierId: this.form.supplier_id,
            productId: this.productId,
            name: tmp2[tmp2.length - 1],
            water: this.water
          }).then(data => {
            resolve(data.data)
          })
        })
      })
      const imageSkuPromises = this.form.images_sku.map(item => {
        let tmp = item.url.split('?')
        let tmp2 = tmp[0].split('/')
        return new Promise(resolve => {
          uploadImageTikTok({
            supplierId: this.form.supplier_id,
            productId: this.productId,
            name: tmp2[tmp2.length - 1],
            water: this.water
          }).then(data => {
            resolve(data.data)
          })
        })
      })

      Promise.all([
        ...imagePromises,
        ...imageSkuPromises
      ]).then(data => {
        this.$message.success('终于完成了图片上传')
        let shopProductTitle = generateShopProductTitle({
          region: 'TK',
          brand: brandCompatibility[this.form.brand_compatibility_id],
          sellingPoint: this.form.selling_point,
          model: this.form.model_type,
          supplier_id: this.form.supplier_id,
          main_type: JSON.parse(this.form.sku_model)[1].model_options[0]
        }, this.isGeneral)

        const skuModel = JSON.parse(this.form.sku_model)
        let skuTikTok = []
        const skuImages = data.slice(imagePromises.length)

        skuModel[0].model_options.forEach((item, index) => {
          skuModel[1].model_options.forEach((subItem, subIndex) => {
            let skuItem = {}
            skuItem.price = {
              amount: this.generateUSDPrice(this.form.multi_cost_price.length ? this.form.multi_cost_price[index] : this.form.cost_price),
              currency: 'USD'
            }
            skuItem.global_quantity = 5000
            skuItem.seller_sku = `${this._id}_${index}_${subIndex}`
            skuItem.sales_attributes = [{
              name: skuModel[0].model_name,
              value_name: item,
              sku_img: {
                uri: skuImages[index].uri
              }
            }, {
              name: skuModel[1].model_name,
              value_name: subItem
            }]
            skuTikTok.push(skuItem)
          })
        })

        createProductTiktok({
          _id: this.form._id,
          title: shopProductTitle,
          description: generateDescriptionInLazada(data.map(item => item.url), true),
          category_id: '601925',
          main_images: data.slice(0, 9).map(item => {
            return {
              uri: item.uri
            }
          }),
          skus: skuTikTok,
          package_weight: {
            value: '0.05',
            unit: 'KILOGRAM'
          },
          package_dimensions: {
            length: '25',
            width: '21',
            height: '5',
            unit: 'CENTIMETER'
          }
        }).then(result => {
          if (result.code !== 0) {
            this.$message.error(result.data)
            return
          }
          if (result.data.global_product_id) {
            this.$message.success(`Tiktok 全球商品上传成功 ${result.data.global_product_id}`)
            this.resultGlobalProductTiktok = true
          }
        })
      })
    },
    autoSelectTag () {
      const text = this.form.name_by_supplier
      let tags = []
      this.adoptedTags.forEach(group => {
        group.forEach(item => {
          let synonymFind = false
          if (item.synonym) {
            const synonymGroup = item.synonym.split(',')
            synonymFind = synonymGroup.some(item => {
              return text.indexOf(item) >= 0
            })
          }

          if (item.value && (text.indexOf(item.value) >= 0 || synonymFind)) {
            tags.push(item)
          }
        })
      })
      this.form.tags = tags
      this.$forceUpdate()
    },
    setOptionImage () {
      this.form.images_sku.push(this.currentImages[this.imagePreviewIndex])
    },
    modifyDaysShip () {
      updateGlobalItem({
        global_item_id: this.form.global_item_id,
        pre_order: {
          days_to_ship: this.daysShip
        }
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('Shopee 全球商品出货天数更新成功')
        }
      })
    },
    noLogo (data) {
      let tmp = _.cloneDeep(data)
      return tmp.map(item => {
        if (item.url.indexOf('?x-oss-process=style') >= 0) {
          item.url = item.url.split('?x-oss-process=style')[0]
        }
        return item
      })
    },
    viewOrders () {
      let url = this.$router.resolve({
        name: 'order-delivery',
        query: {productId: this._id}
      })
      window.open(url.href, '_blank')
    },
    unlistEmpty () {
      // 库存调0
      this.changeShopeeGlobalInventory(0)

      Object.keys(this.publishedMap).map(item => {
        this.unlist({id: this.publishedMap[item].item_id, region: this.publishedMap[item].shop_region.toUpperCase(), shop_id: item})
      })
    },
    handleDeleteItem (params) {
      this.$confirm('是否确定删除站点线上商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem({shop_id: params.shop_id, item_id: params.id}).then(data => {
          console.log(data)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDeleteProduct () {
      this.$confirm('此操作将从商品库隐藏该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          editProductStatus({
            _id: this._id,
            status: 3
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '隐藏成功',
                type: 'success'
              })
              // location.reload()
            } else {
              this.$message.error('隐藏失败')
            }
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    unlist (params) {
      unlistItems({
        item_list: [{item_id: params.id, unlist: true}],
        shop_id: params.shop_id,
        region: params.region
      }).then(data => {
        console.log(data)
        if (data.failure_list.length === 0 && data.success_list.length === 1) {
          this.$message.success('下架成功')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    list (params) {
      updateShopItem({
        shop_id: params.shop_id,
        item: {
          item_status: 'NORMAL',
          item_id: params.id
        }
      }).then((data) => {
        if (data) {
          this.$message.success('上架成功')
        }
      })
    },
    initShop () {
      getShops().then(data => {
        this.shops = data
        let regionShop = {}
        data.forEach(item => {
          if (!regionShop[item.region]) regionShop[item.region] = []
          regionShop[item.region].push(item)
        })

        Object.keys(regionShop).forEach(item => {
          regionShop[item].sort((a, b) => {
            return a.theme_id - b.theme_id
          })
        })

        this.regionShop = regionShop
      })
    },
    async initProduct (id) {
      const productsResult = await getProducts({data: {_id: id}})
      const product = productsResult.data[0]
      // product.supplier_id = String(product.supplier_id)
      this.form = product

      if (!this.form.price_orientation) {
        this.form.price_orientation = 0
      }
      this.productId = this.form.product_id

      if (!this.form.brand_compatibility_id) {
        this.form.brand_compatibility_id = accessories.indexOf(this.form.category) >= 0 ? getBrandCompatibilityId(id, this.form.product_id) : undefined
      }
      // if (!this.form.model_type) {
      //   this.form.model_type = iPhoneTypeInTitle
      // }

      if (this.form.category) {
        this.initCategory()
      }

      this.initSKU()
      this.initImages()

      this.initMultiPrice()

      if (!this.isShopeeGlobalItem) {
        this.initGlobalItemInfo()
      }
    },
    initMultiPrice () {
      if (this.form.multi_cost_price.length) {
        this.isMultiPrice = true
      }
    },
    initCategory () {
      const categories = [
        categoryIdShopeePhoneCase,
        categoryIdShopeeTabletCase,
        categoryIdShopeeAirpodsCase,
        categoryIdShopeeScreenProtector,
        categoryIdShopeeCable,
        categoryIdShopeeSticker,
        categoryIdShopeePhoneStrap,
        categoryIdShopeeHolderPopsocket,
        categoryIdShopeePhoneBag,
        categoryIdShopeeGameAccessory,
        categoryIdShopeeCarPhoneHolder,
        categoryIdShopeeFan,
        categoryIdShopeePortableLamp,
        categoryIdShopeeWatchband
      ]

      const finded = categories.find(item => {
        return item === this.form.category
      })

      this.tabChooser = finded ? this.form.category : 'general'
      this.handleGetAttributes(this.form.category)
    },
    initSupplier () {
      getSupplier().then(data => {
        this.supplierList = data
      })
    },
    initGlobalItemInfo () {
      getGlobalItemInfo({global_item_id_list: [Number(this.form.global_item_id)]}).then(data => {
        if (data.code === 1 && data.data === '请重新授权') {
          this.isAuth = false
        } else {
          this.isAuth = true
        }
        if (!data.data) {
          this.isShopeeGlobalItem = false
        } else {
          this.isShopeeGlobalItem = true
          this.globalImages = data.data.global_item_list[0].image
          this.globalItemShopee = data.data.global_item_list[0]
        }
      })

      getGlobalModelList({global_item_id: this.form.global_item_id}).then(data => {
        if (data.data) {
          this.globalSkuImages = data.data.tier_variation[0].option_list.map(item => item.image.image_url)
          this.globalTierVariation = data.data.tier_variation
          this.globalModel = data.data.global_model
        }
      })
    },

    getRegionShopModel (globalModel, region) {
      return globalModel.map(item => {
        const price = this.isMultiPrice ? generatePrice(this.form.multi_cost_price[item.tier_index[0]], region, this.form.price_orientation) : generatePrice(this.form.cost_price, region, this.form.price_orientation)

        return {
          tier_index: item.tier_index,
          original_price: price
        }
      })
    },
    getPublishParams (shop, globalId) {
      let skuModel = JSON.parse(this.form.sku_model)
      let tierVariation = this.isShopeeGlobalItem ? this.globalTierVariation : this.getTierVariation(skuModel, this.form.images_sku)
      let globalModel = this.isShopeeGlobalItem ? this.getRegionShopModel(this.globalModel, shop.region) : this.getGlobalModel(skuModel, shop.region)

      let shopProductTitle = generateShopProductTitle({
        region: shop.region,
        brand: brandCompatibility[this.form.brand_compatibility_id],
        sellingPoint: this.form.selling_point,
        sellingPointT: this.form.selling_point_traditional,
        model: this.form.model_type,
        supplier_id: this.form.supplier_id,
        main_type: JSON.parse(this.form.sku_model)[1].model_options[0],
        category: this.form.category
      }, this.isGeneral)

      if (shopProductTitle.length > nameLength[shop.region]) {
        this.$message({
          type: 'error',
          message: `卖点词长度超过限制 ${shop.region}`
        })
        return false
      }

      const params = {
        global_item_id: globalId || this.form.global_item_id,
        shop_id: shop.id,
        shop_region: shop.region.slice(0, 2),

        item: {
          item_name: shopProductTitle,
          description: generateDescription(this.form, this.descriptionLibary, shop, this.isGeneral),
          item_status: 'NORMAL',
          // original_price: 100,
          image: {
            image_id_list: this.globalImages.image_id_list
          },
          category_id: Number(this.form.category) || generateCategoryId(this.form),
          tier_variation: tierVariation,
          model: globalModel,
          logistic: logisticIdShopee[shop.region].map(item => ({logistic_id: item, enabled: true})),
          pre_order: {
            is_pre_order: false,
            days_to_ship: 2
          }
        }
      }

      return params
    },
    publish (shop) {
      if (!this.checkPrice()) return

      createPublishTask(this.getPublishParams(shop)).then(data => {
        // this.getPublishResult(data.data.response.publish_task_id)
      })
    },

    getPublishResult (id) {
      getPublishTaskResult({
        publish_task_id: id
      }).then(data => {
        console.log(data)

        if (data.data.response.publish_status === 'processing') {
          setTimeout(() => {
            this.getPublishResult(id)
          }, 3000)
        } else {
          console.log('发布错误')
        }
      })
    },

    initPublishedList () {
      const shops = shopIdInShopee
      const shopData = {}
      const shopIdMap = {}

      Object.keys(shops).forEach(item => {
          shopData[item] = {}
          shopData[item].id = shopIdInShopee[item]
          shopIdMap[shopData[item].id] = item
      })

      return new Promise(resolve => {
        getPublishedList({
          global_item_id: this.form.global_item_id
        }).then(data => {
          const publishedList = data.data.published_item
          let publishedMap = {}
          publishedList.forEach(item => {
            const shopName = shopIdMap[item.shop_id]
            shopData[shopName].published = true
            shopData[shopName].item_id = item.item_id
            shopData[shopName].item_status = item.item_status

            publishedMap[item.shop_id] = item
          })

          this.publishedMap = publishedMap
          this.shopData = shopData
          resolve(true)
        })
      })
    },
    initImages () {
      // const supplierId = this.form.old_supplier_id || this.form.supplier_id
      // if (this.role !== 2) {
      //   this.form.images.slice(0, 9).forEach(item => {
      //     if (item.url.indexOf('?x-oss-process=style') < 0) {
      //       item.url = `${item.url}?x-oss-process=style/${this.water}`
      //     }
      //   })
      //   this.form.images_sku.forEach(item => {
      //     if (item.url.indexOf('?x-oss-process=style') < 0) {
      //       item.url = `${item.url}?x-oss-process=style/${this.water}`
      //     }
      //   })
      // } else {
        this.form.images.forEach(item => {
          if (item.url.indexOf('?x-oss-process=style') >= 0) {
            let urlTemp = item.url.split('?')
            item.url = `${urlTemp[0]}?x-oss-process=style/compress`
          }
        })
        this.form.images_sku.forEach(item => {
          if (item.url.indexOf('?x-oss-process=style') >= 0) {
            let urlTemp = item.url.split('?')
            item.url = `${urlTemp[0]}?x-oss-process=style/compress`
          }
        })
      // }
    },
    handleClickAddProduct () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.afterValidate()) return false

          _.merge(this.form, { // eslint-disable-line
            _id: this._id
          })
          // this.form.published = this.form.published.sort()
          this.form.sku_model = this.skuModel

          if (!this.form.category) {
            // this.form.category = generateCategoryId(this.form)
            this.form.category = this.tabChooser
          }

          if (!this.form.inventory.need) {
            this.form.inventory.need = 1
          } else {
            this.form.inventory.need = Number(this.form.inventory.need)
          }

          if (this.isCopy) {
            this.form._id = this.$route.query.target
            delete this.form.global_item_id
            delete this.form.item_id_in_lazada
          }

          addProduct(this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              // this.toProduct()
              // location.reload()
              this.$router.push({ name: 'edit', query: {id: this.form._id} })
            } else {
              this.createFail()
            }
          }).catch(err => {
            console.log(err)
            this.createFail()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClickSaveProduct () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.afterValidate()) return false

          // this.form.published = this.form.published.sort()
          this.form.sku_model = this.skuModel

          if (!this.form.category) {
            // this.form.category = generateCategoryId(this.form)
            this.form.category = this.tabChooser
          }

          this.form.inventory.need = Number(this.form.inventory.need)

          editProduct(this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              // this.toProduct()
              location.reload()
            } else {
              this.createFail()
            }
          }).catch(err => {
            console.log(err)
            this.createFail()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    afterValidate () {
      // if (this.form.styles.length * this.form.types.length > 50) {
      //   this.$message({
      //     type: 'error',
      //     message: 'SKU 数量超过50'
      //   })
      //   return false
      // } else
      if (!this.globalItemName) {
        this.$message({
          type: 'error',
          message: '请输入英文卖点词'
        })
        return false
      }
      if (this.globalItemName.length > 120) {
        this.$message({
          type: 'error',
          message: '标题长度超过120'
        })
        return false
      } else if (this.isMultiPrice && this.form.multi_cost_price.length < 2) {
        this.$message({
          type: 'error',
          message: '请输入多价格'
        })
        return false
      } else if (this.form.images.slice(0, 9).find(item => item.status !== 'success') || this.form.images_sku.find(item => item.status !== 'success')) {
        this.$message.error('图片上传未完成，请稍等')
      } else {
        return true
      }
    },

    createFail () {
      this.$message({
        message: '创建失败',
        type: 'error'
      })
    },
    cancel () {
      this.toProduct()
    },
    toProduct () {
      this.$router.push({ name: 'product' })
    },

    // style
    showStyleInput () {
      this.styleInputVisible = true
    },
    showStyleInputGrip () {
      this.styleInputVisibleGrip = true
      this.styleInputValueGrip = '&grip'
    },
    showStyleInputChain () {
      this.styleInputVisibleChain = true
      this.styleInputValueChain = '&chain'
    },
    showStyleInputGripChain () {
      this.styleInputVisibleGripChain = true
      this.styleInputValueGripChain = '&grip&chain'
    },
    showStyleInputOnly () {
      this.styleInputVisibleOnly = true
      this.styleInputValueOnly = 'only case'
    },
    confirmStyleInput () {
      let styleInputValue = this.styleInputValue.trim()
      if (styleInputValue) {
        if (!this.form.styles) this.form.styles = []
        if (this.form.styles.indexOf(styleInputValue) >= 0) {
          this.$message.error('SKU 名称重复')
          return
        }
        this.form.styles.push(styleInputValue)
        this.updateSkuModel()
      }
      this.styleInputVisible = false
      this.styleInputValue = ''
    },
    confirmStyleInputOnly () {
      let styleInputValueOnly = this.styleInputValueOnly.trim()
      if (styleInputValueOnly) {
        if (!this.form.styles) this.form.styles = []
        if (this.form.styles.indexOf(styleInputValueOnly) >= 0) {
          this.$message.error('SKU 名称重复')
          return
        }
        this.form.styles.push(styleInputValueOnly)
        this.updateSkuModel()
      }
      this.styleInputVisibleOnly = false
      this.styleInputValueOnly = ''
    },
    confirmStyleInputGrip () {
      let styleInputValueGrip = this.styleInputValueGrip.trim()
      if (styleInputValueGrip) {
        if (!this.form.styles) this.form.styles = []
        if (this.form.styles.indexOf(styleInputValueGrip) >= 0) {
          this.$message.error('SKU 名称重复')
          return
        }
        let length = this.form.styles.length
        this.form.styles.push(styleInputValueGrip)
        if (!this.form.sku_info[length]) this.form.sku_info[length] = []
        this.form.sku_info[length].push({type: 1})
        this.updateSkuModel()
      }
      this.styleInputVisibleGrip = false
      this.styleInputValueGrip = ''
    },
    confirmStyleInputChain () {
      let styleInputValueChain = this.styleInputValueChain.trim()
      if (styleInputValueChain) {
        if (!this.form.styles) this.form.styles = []
        if (this.form.styles.indexOf(styleInputValueChain) >= 0) {
          this.$message.error('SKU 名称重复')
          return
        }
        let length = this.form.styles.length
        this.form.styles.push(styleInputValueChain)
        if (!this.form.sku_info[length]) this.form.sku_info[length] = []
        this.form.sku_info[length].push({type: 23})
        this.updateSkuModel()
      }
      this.styleInputVisibleChain = false
      this.styleInputValueChain = ''
    },
    confirmStyleInputGripChain () {
      let styleInputValueGripChain = this.styleInputValueGripChain.trim()
      if (styleInputValueGripChain) {
        if (!this.form.styles) this.form.styles = []
        if (this.form.styles.indexOf(styleInputValueGripChain) >= 0) {
          this.$message.error('SKU 名称重复')
          return
        }
        let length = this.form.styles.length
        this.form.styles.push(styleInputValueGripChain)
        if (!this.form.sku_info[length]) this.form.sku_info[length] = []
        this.form.sku_info[length].push({type: 1}, {type: 23})
        this.updateSkuModel()
      }
      this.styleInputVisibleGripChain = false
      this.styleInputValueGripChain = ''
    },
    deleteStyle (style) {
      this.form.styles.splice(this.form.styles.indexOf(style), 1)
      this.$forceUpdate()
      this.updateSkuModel()
    },
    // type
    showTypeInput () {
      this.typeInputVisible = true
      // this.$nextTick(_ => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },
    confirmTypeInput () {
      let typeInputValue = this.typeInputValue.trim()
      if (typeInputValue) {
        if (this.form.types.indexOf(typeInputValue) >= 0) {
          this.$message.error('SKU 名称重复')
          return
        }
        this.form.types.push(typeInputValue)
        this.updateSkuModel()
      }
      this.typeInputVisible = false
      this.typeInputValue = ''
    },
    deleteType (type) {
      this.form.types.splice(this.form.types.indexOf(type), 1)
      this.$forceUpdate()
      this.updateSkuModel()
    },

    initSKU () {
      if (!this.form.sku_model) return

      let skuModel = JSON.parse(this.form.sku_model)

      this.form.styles = skuModel[0].model_options
      this.form.types = skuModel[1].model_options
      this.skuModel = this.form.sku_model
    },

    updateSkuModel () {
      this.skuModel = JSON.stringify([{
        model_name: 'Color',
        model_options: this.form.styles
      }, {
        model_name: 'Type',
        model_options: this.form.types
      }])
    },
    changeBrand (value) {
      getType({brand: value}).then(data => {
        let types = data.map(item => item.name)
        if (!this.form.serie) {
          this.form.types = types
        }
        switch (value) {
          case 0:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = iPhoneType
            }
            this.form.model_type = iPhoneTypeInTitleSimple
            break
          case 1:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = SAMSUNGType
            }
            this.form.model_type = SamsungTypeInTitle
            break
          case 2:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = HUAWEIType
            }
            this.form.model_type = HuaweiTypeInTitle
            break
          case 3:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = iPadType
            }
            this.form.model_type = iPadTypeInTitle
            break
          case 6:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = AirPodsType
            }
            this.form.model_type = AirPodsTypeInTitle
            break
          case 7:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = POCOType
            }
            this.form.model_type = POCOTypeInTitle
            break
          case 8:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = MotorolaType
            }
            this.form.model_type = MotorolaInTitle
            break
          case 9:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = OnePlusType
            }
            this.form.model_type = OnePlusInTitle
            break
          case 5:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = SonyXperiaType
            }
            this.form.model_type = SonyXperiaInTitle
            break
          case 4:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = GooglePixelType
            }
            this.form.model_type = GooglePixelInTitle
            break
          case 10:
            if (!this.form.serie && !this.form.types.length) {
              this.form.types = iWatchType
            }
            this.form.model_type = iWatchInTitle
            break
        }
      })

      this.$forceUpdate()
    },
    changeSupplier (value) {
      getNewId({
        supplier_id: this.form.supplier_id
      }).then(res => {
        this.productId = res.data.newId
      })

      // this.currentSupplier = this.supplierList.find(item => {
      //   return item.serial === value
      // })

      // this.series = this.currentSupplier.series
    },
    changeSerie (value) {
      const currentSerie = this.currentSupplier.series.find(item => item.name === value)
      this.form.types = currentSerie.models
      if (currentSerie.price) {
        this.form.cost_price = currentSerie.price
      }
    },
    handleRemoveImage (file, fileList) {
      this.form.images = fileList
    },
    handleChangeImage (file, fileList) {
      this.form.images = fileList
      this.$forceUpdate()
    },
    handleRemoveImageSku (file, fileList) {
      this.form.images_sku = fileList
    },
    handleChangeImageSku (file, fileList) {
      this.form.images_sku = fileList
    },
    handleImagePreview (file) {
      this.currentPreviewImage = file
      this.dialogImagePreviewVisible = true
      this.currentImages = this.form.images

      this.imagePreviewIndex = this.form.images.slice(0, 9).indexOf(file)
    },
    handleImageSkuPreview (file) {
      this.currentPreviewImage = file
      this.dialogImagePreviewVisible = true
      this.currentImages = this.form.images_sku

      this.imagePreviewIndex = this.form.images_sku.indexOf(file)
    },

    handleVideoChange (file, fileList) {
      console.log('handleVideoChange')
      // this.form.video = fileList
      // this.isVideoLoading = false
    },

    handleFileChange (file, fileList) {
      console.log('handleFileChange')
      // this.form.video = fileList
      // this.isVideoLoading = false
      console.log(file, fileList)
      // this.isFileLoading = false
      // console.log(data)
      // if (data.id) {
      //   let url = this.$router.resolve({
      //     name: 'edit',
      //     query: {id: data.id}
      //   })
      //   window.open(url.href, '_blank')
      // }
    },

    getTierVariation (skuModel, imagesSku) {
      let tierVariation = skuModel.map((item, index) => {
        return {
          name: item.model_name,
          option_list: item.model_options.map((subItem, subIndex) => {
            const innerData = {
                option: subItem
            }

            if (index === 0) {
              innerData.image = {}
              // innerData.image.image_id = this.globalSkuImages[subIndex].split('/').pop() // 店铺商品用
              innerData.image.image_id = imagesSku[subIndex].imageId // 全球商品用
            }
            return innerData
          })
        }
      })
      return tierVariation
    },
    getStock (typeOneItem, typeTwoItem) {
      let stock = 500
      if (typeOneItem.indexOf('no case') >= 0 && typeTwoItem.indexOf('no case') < 0) {
        stock = 0
      } else if (typeOneItem.indexOf('no case') < 0 && typeTwoItem.indexOf('no case') >= 0) {
        stock = 0
      }
      return stock
    },
    getGlobalModel (skuModel, region) {
      let globalModel = []

      skuModel[0].model_options.forEach((typeOneItem, typeOneIndex) => {
          const price = this.isMultiPrice ? generatePrice(this.form.multi_cost_price[typeOneIndex], region, this.form.price_orientation) : generatePrice(this.form.cost_price, region, this.form.price_orientation)

          skuModel[1].model_options.forEach((typeTwoItem, typeTwoIndex) => {
              let modelData = {
                  original_price: region === 'global' ? (this.form.cost_price || this.form.multi_cost_price[0]) * 10 : price,
                  normal_stock: this.getStock(typeOneItem, typeTwoItem),
                  tier_index: [typeOneIndex, typeTwoIndex],
                  global_model_sku: region === 'global' ? `${this.form._id}-${typeOneIndex}-${typeTwoIndex}` : 'shop'
              }

              globalModel.push(modelData)
          })
      })

      return globalModel
    },
    checkPrice () {
      if (this.form.cost_price === 0 || this.form.multi_cost_price.indexOf('0') >= 0) {
        this.$message.error('价格不能为0')
        return false
      }
      return true
    },
    checkTitle () {
      if (!this.form.selling_point || !this.form.selling_point_traditional || !this.form.model_type) {
        this.$message.error('卖点词或型号词不能为空')
        return false
      }
      return true
    },
    addGlobalItem2Shopee (type) {
      if (!this.checkPrice()) {
        return
      }
      if (!this.checkTitle()) {
        return
      }

      if (this.form.styles.length !== this.form.images_sku.length) {
        this.$message({
          type: 'error',
          message: '选项和选项图数量不对应'
        })
        return
      }

      if (this.form.styles.length * this.form.types.length > 100) {
        this.$message({
          type: 'error',
          message: 'SKU 数量超过100'
        })
        return
      }

      const imagePromises = this.form.images.slice(0, 9).map(item => {
        let tmp = item.url.split('?')
        let tmp2 = tmp[0].split('/')

        return new Promise(resolve => {
          uploadImage({
            supplierId: this.form.supplier_id,
            productId: this.productId,
            name: tmp2[tmp2.length - 1],
            water: this.water
          }).then(data => {
            console.log(data)
            item.imageId = data.data.imageId
            resolve(data.code)
          })
        })
      })

      const imageSkuPromises = this.form.images_sku.map(item => {
        let tmp = item.url.split('?')
        let tmp2 = tmp[0].split('/')
        return new Promise(resolve => {
          uploadImage({
            supplierId: this.form.supplier_id,
            productId: this.productId,
            name: tmp2[tmp2.length - 1],
            water: this.water
          }).then(data => {
            console.log(data)
            item.imageId = data.data.imageId
            resolve(data.code)
          })
        })
      })

      Promise.all([
        ...imagePromises,
        ...imageSkuPromises
      ]).then(data => {
        console.log(data)
        const isImageSuccess = data.every(item => item === 0)

        if (!isImageSuccess) {
          this.$message.error('图片上传错误')
          return
        }
        this.$message.success('终于完成了图片上传')

        let globalItem = {
          category_id: Number(this.form.category) || generateCategoryId(this.form),
          global_item_name: this.globalItemName,
          description: generateDescription(this.form, this.descriptionLibary, undefined, this.isGeneral),
          global_item_sku: this._id,
          image: {
            image_id_list: this.form.images.slice(0, 9).map(item => item.imageId)
          },
          // image_sku: this.form.images_sku,
          original_price: this.form.cost_price * 10,
          normal_stock: 5000,
          // seller_stock: 500,
          weight: 0.05,
          dimension: {
            package_length: 25,
            package_width: 21,
            package_height: 5
          },
          pre_order: {days_to_ship: 2},
          condition: 'NEW',
          attribute_list: this.tabChooser === categoryIdShopeePhoneCase || this.tabChooser === categoryIdShopeeTabletCase ? getAttributeList(this.form) : this.getOtherCategoryAttributes(),
          brand: {
            brand_id: 0,
            original_brand_name: 'NoBrand'
          }
          // description_type: 'extended'
          // description_info: {
          //   extended_description: {
          //     field_list: [{
          //       field_type: 'image',
          //       image_info: {
          //         image_id: this.form.images[0].imageId
          //       }
          //     }]
          //   }
          // }
        }

        if (this.form.video_upload_id_in_shopee) {
          globalItem.video_upload_id = [this.form.video_upload_id_in_shopee]
        }

        addGlobalItem(globalItem).then(data => {
          const globalItemId = data.data.global_item_id

          if (!globalItemId) {
            console.log('globalItemId 获取失败', data)
            return
          }

          let skuModel = JSON.parse(this.form.sku_model)

          let tierVariation = this.getTierVariation(skuModel, this.form.images_sku)

          let globalModel = this.getGlobalModel(skuModel, 'global')

          initTierVariation({
            global_item_id: globalItemId,
            tier_variation: tierVariation,
            global_model: globalModel
          }).then(result => {
            if (!JSON.parse(result.data.text).error) {
              this.$message.success('Shopee全球商品上传成功')
              const data = JSON.parse(result.data.text)
              console.log(data)
              if (type && type === 'autoPush') {
                this.pushTask(globalItemId)
              }
              this.isGlobalUploadSuccess = true
              // setTimeout(() => {
              //   location.reload()
              // }, 2000)
            }
          })
        }).catch(err => {
          console.log(err)
        })
      })
    },

    updateGlobalItemModel () {
      const imageSkuPromises = this.form.images_sku.map(item => {
        let tmp = item.url.split('?')
        let tmp2 = tmp[0].split('/')

        return new Promise(resolve => {
          uploadImage({
            supplierId: this.form.supplier_id,
            productId: this.productId,
            name: tmp2[tmp2.length - 1],
            water: this.water
          }).then(data => {
            console.log(data)
            item.imageId = data.data.imageId
            resolve(data.code)
          })
        })
      })

      Promise.all([
        ...imageSkuPromises
      ]).then(data => {
        const isImageSuccess = data.every(item => item === 0)

        if (!isImageSuccess) {
          this.$message.error('图片上传错误')
          return
        }
        this.$message.success('终于完成了图片上传')

        let skuModel = JSON.parse(this.form.sku_model)

        let tierVariation = this.getTierVariation(skuModel, this.form.images_sku)

        // let globalModel = this.getGlobalModel(skuModel, this.form.cost_price, 'global')

        updateTierVariation({
          global_item_id: this.form.global_item_id,
          tier_variation: tierVariation
          // global_model: globalModel
        }).then(result => {
          if (!JSON.parse(result.data.text).error) {
            this.$message.success('全球商品SKU更新成功')

            Object.keys(shopIdInShopee).forEach(item => {
              // updateTierVariationProduct({
              //   shop_id: shopIdInShopee[item],
              //   region: item,
              //   tier_variation: this.getTierVariation(skuModel, this.form.images_sku)
              // })
            })
          }
        })
      })
    },

    publishItem2Lazada (shop) {
      const that = this
      if (!this.checkPrice()) return
      const imagePromises = this.form.images.map(item => {
        let imageUrl = item.url
        if (item.url.split(':')[0] === 'blob') {
          imageUrl = `${item.response.data.result.url}?x-oss-process=style/${this.water}`
        }

        return new Promise(resolve => {
          imageMigrate({
            payload: {
              Request: {
                Image: {
                  Url: imageUrl
                }
              }
            },
            country: shop.region
          }).then(data => {
            resolve(data.data.result.data.image.url)
          })
        })
      })

      const imageSkuPromises = this.form.images_sku.map(item => {
        let imageUrl = item.url
        if (item.url.split(':')[0] === 'blob') {
          imageUrl = `${item.response.data.result.url}?x-oss-process=style/${this.water}`
        }

        return new Promise(resolve => {
          imageMigrate({
            payload: {
              Request: {
                Image: {
                  Url: imageUrl
                }
              }
            },
            country: shop.region
          }).then(data => {
            resolve(data.data.result.data.image.url)
          })
        })
      })

      let shopProductTitle = generateShopProductTitle({
        region: shop.region,
        brand: brandCompatibility[this.form.brand_compatibility_id],
        sellingPoint: this.form.selling_point,
        model: this.form.model_type,
        supplier_id: this.form.supplier_id,
        main_type: JSON.parse(this.form.sku_model)[1].model_options[0],
        category: this.form.category
      }, this.isGeneral)

      const skuModel = JSON.parse(this.form.sku_model)

      Promise.all([
        ...imagePromises,
        ...imageSkuPromises
      ]).then(images => {
        console.log(images)
        const skuImages = images.slice(images.length - this.form.images_sku.length, images.length)
        console.log(skuImages)
        let skuList = generateSkuListLazada(skuModel, this.form._id, this.isMultiPrice, this.form.multi_cost_price, this.form.cost_price)

        function generateSkuListLazada (skuModel, globalId, isMultiPrice, multiCostPrice, costPrice) {
          let skuList = []

          skuModel[0].model_options.forEach((item, index) => {
            skuModel[1].model_options.forEach((subItem, subIndex) => {
              console.log(skuImages[index])
              let sku = {}

              let price = isMultiPrice ? generatePrice(multiCostPrice[index], shop.region) : generatePrice(costPrice, shop.region)
              let specialPrice = price * (1 - shopBasicDiscountInLazada[shop.region] / 100)

              if (shop.region === 'VN') {
                price = Math.floor(price)
                specialPrice = Math.floor(specialPrice)
              }

              sku.SellerSku = `${globalId}_${index}_${subIndex}`
              // sku.color_family = item
              // sku.compatibility_by_model = subItem
              sku.saleProp = {
                style: item,
                model: subItem
              }
              // sku.styletype = item
              // sku.modeltype = subItem
              sku.price = String(price)
              sku.special_price = String(specialPrice)
              sku.quantity = String(that.getStock(item, subItem))
              sku.package_length = '25'
              sku.package_width = '21'
              sku.package_height = '5'
              sku.package_weight = '0.05'
              sku.package_content = '1 x Case'

              sku.Images = {
                Image: [skuImages[index]]
              }

              skuList.push(sku)
            })
          })

          return skuList
        }

        let item = {
          Request: {
            Product: {
              PrimaryCategory: generateCategoryIdLazada(this.form)[shop.region],
              SPUId: this.form._id,
              // AssociatedSku: 0,
              Attributes: {
                name: shopProductTitle,
                short_description: generateShortDescription(this.form.features, this.descriptionLibary),
                description: generateDescriptionInLazada(images),
                brand: 'No Brand',
                brand_compatibility: brandCompatibilityInLazada[this.form.brand_compatibility_id],
                model: `For ${brandCompatibilityInLazada[this.form.brand_compatibility_id]}`,
                case_function: genereateLazadaCaseFunction(this.form.features)
              },
              Images: {
                Image: images.slice(0, 8)
              },
              Skus: {
                Sku: skuList
              },
              variation: {
                variation1: {
                  customize: true,
                  hasImage: true,
                  label: 'style',
                  name: 'style',
                  options: {
                    option: skuModel[0].model_options
                  }
                },
                variation2: {
                  customize: true,
                  hasImage: false,
                  label: 'model',
                  name: 'model',
                  options: {
                    option: skuModel[1].model_options
                  }
                }
              }
            }
          }
        }

        createProduct({
          payload: item,
          country: shop.region
        }).then(data => {
          if (data.code === 0 && data.data.result.data.item_id) {
            this.$message.success(`Lazada ${shop.region} Published`)
          }
        })
      })
    },

    openCategoryDialog (params) {
      this.formCategory = {}
      this.dialogCategoryVisible = true
      this.currentCategoryShop = {
        shop_id: params.shop_id,
        region: params.region
      }

      getShopCategoryList({
        shop_id: params.shop_id,
        region: params.region
      }).then(data => {
        console.log(data)
        this.categoryList = data.shop_categorys
      })
    },
    confirmCategory () {
      this.dialogCategoryVisible = false

      addItemListToShopCategory({
        region: this.currentCategoryShop.region,
        shop_id: this.currentCategoryShop.shop_id,
        item_list: [this.shopData[this.currentCategoryShop.region].item_id],
        shop_category_id: this.formCategory.category,
        // shop_category_name: this.formCategory.category,
        global_item_sku: this.form._id
      }).then(data => {
        if (data.data.global_item_id && !data.data.global_item_id.invalid_item_id_list) {
          this.$message.success('设置分类成功')
          return
        }
        if (data.data.global_item_id.invalid_item_id_list.length) {
          this.$message.error('设置分类未成功')
        }
      })
    },
    openDiscountDialog (params) {
      this.formDiscount = {}
      this.dialogDiscountVisible = true
      this.loadingDiscount = true
      this.exactPrice = undefined

      const currentModelList = this.modelList[params.shop_id].model
      let lowestPrice = 0
      let highestPrice = 0
      currentModelList.forEach(item => {
        const currentItemPrice = item.price_info[0].current_price
        if (!lowestPrice) lowestPrice = currentItemPrice
        if (!highestPrice) highestPrice = currentItemPrice
        if (currentItemPrice < lowestPrice) lowestPrice = currentItemPrice
        if (currentItemPrice > highestPrice) highestPrice = currentItemPrice
      })

      let currentPrice = lowestPrice
      let originalPrice = currentModelList[0].price_info[0].original_price // TODO 不准确
      let discount = lowestPrice / originalPrice

      if (lowestPrice !== highestPrice) {
        currentPrice = `${lowestPrice} - ${highestPrice}`
        discount = `${discount} - ${highestPrice / originalPrice}`
      }

      const profitProcess = getProfit(this.exchangeRate, currentPrice, params.region, this.form.weight * 1000, this.form.cost_price)

      this.currentDiscountShop = {
        shop_id: params.shop_id,
        region: params.region,
        price: currentPrice,
        discount: discount,
        commissionPart: profitProcess.commissionPart,
        transactionPart: profitProcess.transactionPart,
        servicePart: profitProcess.servicePart,
        sellerPaysShipping: profitProcess.sellerPaysShipping,
        profit: profitProcess.profit,
        profitMargin: profitProcess.profit / currentPrice
      }

      const promiseDiscountList = new Promise(resolve => {
        getDiscountList({
          shop_id: params.shop_id,
          region: params.region
        }).then(data => {
          console.log(data)
          this.discountList = data.discount_list
          this.formDiscount.discount = this.modelList[this.currentDiscountShop.shop_id].model[0].promotion_id
          resolve(true)
        })
      })

      const promiseModelList = new Promise(resolve => {
        getModelList({
          item_id: this.shopData[this.currentDiscountShop.region].item_id,
          shop_id: params.shop_id,
          region: this.currentDiscountShop.region
        }).then(data => {
          console.log(data)
          // this.modelList = data.model
          resolve(true)
        })
      })

      Promise.all([promiseDiscountList, promiseModelList]).then(data => {
        this.loadingDiscount = false
      })
    },
    openPromotionDialog (params) {
      // empty
      this.currentPromotionData = []
      this.currentPromotionShop = {}

      getItemPromotion({
        item_id: params.id,
        shop_id: params.shop_id,
        region: params.region
      }).then(data => {
        const promotion = data.success_list[0].promotion
        if (!promotion) {
          this.$message.error('促销信息获取错误')
          return
        }
        this.currentPromotionData = adoptedPromotion(promotion)

        this.currentPromotionShop = {
          shop_id: params.shop_id,
          region: params.region
        }
        this.dialogPromotionVisible = true
      })
    },
    confirmDiscount () {
      // if (this.modelList[0].price_info[0].current_price !== this.modelList[0].price_info[0].original_price) {
      //   this.$message({
      //     type: 'error',
      //     message: '商品已有折扣'
      //   })
      //   return
      // }

      this.setDiscount(this.currentDiscountShop.region, this.formDiscount.discount, this.currentDiscountShop.shop_id)
    },
    setDiscount (region, discountId, originShopId) {
      const shopId = originShopId || shopIdInShopee[region]
      const regionModelList = this.modelList[shopId].model
      if (!regionModelList) {
        console.log('没有model', region)
        return
      }

      const paramsModelList = this.modelList[shopId].model.map(item => {
        let defaultPrice
        if (!this.exactPrice) {
          // defaultPrice = item.price_info[0].original_price * (100 - shopBasicDiscountInShopee[region]) / 100
          let discount = priceOrientationMap[this.form.price_orientation].discount
          if (region.slice(0, 2) === 'VN') {
            discount = 30
          }
          defaultPrice = item.price_info[0].original_price * (100 - discount) / 100
        } else {
          defaultPrice = this.exactPrice
        }

        return {
          model_id: item.model_id,
          model_promotion_price: defaultPrice
        }
      })

      let realParamsModelList = paramsModelList

      // 先只测试TH/VN/MY
      if (this.form.brand_compatibility_id === '0') {
        if (['TH', 'MY', 'PH', 'SG', 'TW'].indexOf(region) >= 0) {
          realParamsModelList = generateMoney(region, paramsModelList, this.modelList[shopId].model)
        }
      }

      addDiscountItem({
        region: region,
        shop_id: Number(shopId),
        item_list: [{
          item_id: this.shopData[region].item_id,
          purchase_limit: 0,
          model_list: realParamsModelList
        }],
        discount_id: discountId,
        global_item_sku: this.form._id
      }).then(data => {
        if (Object.keys(data).length === 0) {
          console.log(data)
          this.$message.error(`${region}未返回结果`)
          return
        }
        if (data.error_list && data.error_list.length) {
          this.$message.error(`${region}包含折扣设置未成功商品`)
          if (data.error_list[0].fail_error === 'discount.item_in_promotion_too_many') {
            this.$alert(`${region}折扣商品数已满`, '折扣未成功原因', {
              confirmButtonText: '确定',
              callback: action => {
                console.log('已确认')
              }
            })
          } else if (data.error_list[0].fail_error === 'discount.model_in_promotion') {
            this.$alert(`${region}折扣已设置，请勿重复设置`, '折扣未成功原因', {
              confirmButtonText: '确定',
              callback: action => {
                console.log('已确认')
              }
            })
          } else {
            this.$alert(`${region} ${data.error_list[0].fail_message}`, '折扣未成功原因', {
              confirmButtonText: '确定',
              callback: action => {
                console.log('已确认')
              }
            })
          }
          console.log(`${region}未成功商品：`, data.error_list)
        } else {
          // 修改任務狀態
          editTask({
              _id: `${this.form.global_item_id}${shopId}`,
              status: 2
          }).then(result => {
              if (result.code === 0) {
                  this.$message.success('任务状态更新成功')
              } else {
                  this.$message.error('任务状态更新失败')
              }
          })
        }
        if (data.warning) {
          console.log('警告：', data.warning)
        }
      })
    },
    unbindDiscount () {
      // 价格管理中的解绑
      // if (this.modelList[0].price_info[0].current_price === this.modelList[0].price_info[0].original_price) {
      //   this.$message({
      //     type: 'error',
      //     message: '商品没有折扣'
      //   })
      //   return
      // }
      deleteDiscountItem({
        region: this.currentDiscountShop.region,
        shop_id: Number(this.currentDiscountShop.shop_id),
        item_id: this.publishedMap[this.currentDiscountShop.shop_id].item_id,
        discount_id: this.formDiscount.discount,
        // model_id: item.model_id,
        // shop_category_name: this.formCategory.category,
        global_item_sku: this.form._id
      }).then(data => {
        console.log(data)
        if (data.discount_id) {
          this.$message.success('解绑折扣成功')
        }
      })
    },
    publishGlobal () {
      this.getShopeeShops().forEach(item => {
        this.publish({id: Number(item.shop_id), region: item.region})
      })
      // Object.keys(this.shopDataEchelon[this.form.theme]).forEach(item => {
      //   this.publish({id: shopIdInShopee[item], region: item})
      // })
    },
    initModelItem () {
      const modelPromises = Object.keys(shopIdInShopee).map(item => {
        const itemId = this.shopData[item].item_id
        const shopId = shopIdInShopee[item]

        return new Promise(resolve => {
          if (item === 'CL') resolve(true)
          getModelList({
            item_id: itemId,
            shop_id: shopId,
            region: item
          }).then(data => {
            this.modelList[shopId] = data
            resolve(data.model)
          }).catch(err => {
            console.log(err)
          })
        })
      })

      Promise.all(modelPromises).then(() => {
        this.canDiscountGlobal = true
      })
    },
    setGlobalDiscount () {
      Object.keys(shopIdInShopee).map(item => {
        this.setDiscount(item, this.basicDiscountIdInShopee[item])
      })
    },
    changeTabChooser (value) {
      if (typeof value === 'number') {
        this.handleGetAttributes(value)
      }
      this.attributes = {}

      if (value === categoryIdShopeeAirpodsCase) {
        this.form.features = [
          'Drop Impact Protection',
          'Easy to Install',
          'Novel Design'
        ]
      }
    },
    inputCategoryId () {
      if (this.form.category) {
        this.handleGetAttributes(this.form.category)
      }
    },
    handleGetAttributes (category) {
      getAttributes({
        category_id: category
      }).then(data => {
        this.attributesList = data.data.attribute_list.filter(item => {
          return item.is_mandatory
        })
      })
    },

    getOtherCategoryAttributes () {
      return Object.keys(this.attributes).map((item, key) => {
        return {
          attribute_id: Number(item),
          attribute_value_list: this.attributes[item].map(subItem => {
            return {
              value_id: subItem
            }
          })
        }
      })
    },

    openDialogStatus (status) {
      this.selectedStatus = String(status)
      this.dialogStatusVisible = true
    },
    confirmProductStatus (status) {
      if (status === 4) {
        this.unlistEmpty(this.form.global_item_id)
        this.selectedStatus = status
        this.confirmStatus()
      }
      if (status === 9) {
        this.selectedStatus = status
        this.confirmStatus()
      }
    },
    confirmStatus () {
      editProductStatus({
        _id: this._id,
        status: Number(this.selectedStatus)
      }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '编辑商品状态成功',
            type: 'success'
          })
          // location.reload()
        } else {
          this.createFail()
        }
      }).catch(err => {
        console.log(err)
      })
    },

    removePromotion (data) {
      switch (data.type) {
        case promotionNames.discount:
          this.removeDiscount(data)
          break
        case promotionNames.bundle:
          this.removeBundle(data)
          break
        case promotionNames.addon:
        case promotionNames.gift:
          if (data.models && data.models.length) {
            this.removeAddonSubItem(data)
          } else {
            this.removeAddonMainItem(data)
          }
          break
      }
    },
    removeDiscount (data) {
      const publishedMap = JSON.parse(JSON.stringify(this.publishedMap))
      deleteDiscountItem({
        region: this.currentPromotionShop.region,
        shop_id: Number(this.currentPromotionShop.shop_id),
        item_id: publishedMap[this.currentPromotionShop.shop_id].item_id,
        discount_id: data.promotion_id,
        global_item_sku: this.form._id
      }).then(data => {
        if ((data.error_list && !data.error_list.length) || !data.error_list) {
          this.$message.success('解绑成功')
        }
      })
    },
    removeBundle (data) {
      deleteBundleDealItem({
        region: this.currentPromotionShop.region,
        shop_id: this.currentPromotionShop.shop_id,
        item_id: this.shopData[this.currentPromotionShop.region].item_id,
        bundle_deal_id: data.promotion_id
      }).then(data => {
        if (data.failed_list && !data.failed_list.length) {
          this.$message.success('解绑成功')
        }
      })
    },
    removeAddonMainItem (data) {
      deleteAddOnDealMainItem({
        region: this.currentPromotionShop.region,
        shop_id: this.currentPromotionShop.shop_id,
        item_id: this.shopData[this.currentPromotionShop.region].item_id,
        add_on_deal_id: data.promotion_id
      }).then(data => {
        if (data.main_item_list && data.main_item_list.length) {
          this.$message.success('解绑成功')
        }
      })
    },
    removeAddonSubItem (data) {
      deleteAddOnDealSubItem({
        region: this.currentPromotionShop.region,
        shop_id: this.currentPromotionShop.shop_id,
        item_id: this.shopData[this.currentPromotionShop.region].item_id,
        add_on_deal_id: data.promotion_id,
        model_id_list: data.models.map(item => item.id)
      }).then(data => {
        if (data.sub_item_list && data.sub_item_list.length) {
          this.$message.success('解绑成功')
        }
      })
    },
    viewGlobalItemDetail () {
      this.dialogItemDetailVisible = true
      this.salesList = []

      Object.keys(this.publishedMap).forEach(item => {
        // getItemBaseInfo({
        //   shop_id: item.shop_id,
        //   item_id_list: [item.item_id],
        //   region: item.shop_region.toUpperCase()
        // }).then(result => {
        //   console.log(result)
        // })

        getItemExtraInfo({
          shop_id: this.publishedMap[item].shop_id,
          item_id_list: [this.publishedMap[item].item_id],
          region: this.publishedMap[item].shop_region.toUpperCase()
        }).then(result => {
          if (result.item_list && result.item_list.length) {
            result.item_list[0].region = this.publishedMap[item].shop_region.toUpperCase()
            result.item_list[0].status = this.publishedMap[item].item_status
            result.item_list[0].shop_id = this.publishedMap[item].shop_id
            this.salesList.push(result.item_list[0])
          }
        })
      })

      if (this.globalModel.length !== this.form.styles.length * this.form.types.length) {
        let globalModelMap = {}
        this.globalModel.forEach(item => {
          globalModelMap[`${item.tier_index[0]}${item.tier_index[1]}`] = item
        })

        this.form.styles.forEach((styleItem, styleIndex) => {
          this.form.types.forEach((typeItem, typeIndex) => {
            if (!globalModelMap[`${styleIndex}${typeIndex}`]) {
              // TODO 不知道是干什么的
              // this.globalModel.push({
              //   global_model_id: '',
              //   global_model_sku: `${this._id}-${styleIndex}-${typeIndex}`,
              //   price_info: {},
              //   stock_info: [],
              //   tier_index: [styleIndex, typeIndex]
              // })
            }
          })
        })
      }
    },
    viewShopItemDetail (data) {
      this.currentShopeeItemDetail = {}
      this.shopItem = {}
      getItemBaseInfo({
        shop_id: data.item.shop_id,
        item_id_list: [data.item.item_id],
        region: data.region
      }).then(result => {
        console.log(result)
        this.shopItem = result.item_list[0]
        this.dialogShopItemDetailVisible = true

        this.currentShopeeItemDetail = {
          region: data.region,
          shopId: data.item.shop_id
        }
      })

      getItemExtraInfo({
        shop_id: data.item.shop_id,
        item_id_list: [data.item.item_id],
        region: data.region
      }).then(result => {
        console.log(result)
      })
    },
    changeShopeeGlobalInventory (inventory, model) {
      let stockList
      if (!model) {
        stockList = this.globalModel.map(item => {
          return {
            global_model_id: item.global_model_id,
            normal_stock: inventory
            // seller_stock: inventory
          }
        })
      } else {
        stockList = [{
          global_model_id: model.global_model_id,
          normal_stock: inventory
          // seller_stock: inventory
        }]
      }

      updateGlobalItemStock({
        global_item_id: this.form.global_item_id,
        stock_list: stockList
      }).then(data => {
        if (data.code === 0) {
          this.$message.success('调整成功')
        }
      })
    },
    deactivateProductLazada () {
      deactivateProduct({
        country: this.currentLazadaItemDetail.region,
        apiRequestBody: {
          Request: {
            Product: {
              ItemId: Number(this.itemDetailLazada.item_id)
            }
          }
        }
      }).then(result => {
        if (JSON.parse(result.text).code === '0') {
          this.$message.success('下架成功')
        }
      })
    },
    viewShopItemDetailLazada (data) {
      productItemGet({
        country: data,
        item_id: this.form.item_id_in_lazada[data]
      }).then(result => {
        if (result.code === 'IllegalAccessToken') {
          this.$message.error('请重新授权 [Lazada]')
          return
        }
        this.dialogLazadaItemDetailVisible = true
        this.itemDetailLazada = result.data
        this.currentLazadaItemDetail.region = data
      })
    },
    changeModelStatus (model) {
      deactivateProduct({
        country: this.currentLazadaItemDetail.region,
        apiRequestBody: {
          Request: {
            Product: {
              ItemId: Number(this.itemDetailLazada.item_id),
              Skus: [{
                SellerSku: model.SellerSku
              }]
            }
          }
        }
      }).then(result => {
        if (JSON.parse(result.text).code === '0') {
          this.$message.success('下架成功')
        }
      })
    },
    closeDialogShopItemDetail () {
      this.dialogShopItemDetailVisible = false
    },
    copy () {
      let newId = `3${this._id.slice(1)}`
      let url = this.$router.resolve({
        name: 'add',
        query: {target: newId, origin: this._id}
      })
      window.open(url.href, '_blank')
    },
    change () {
      this.dialogChangeVisible = true
    },
    confirmChange () {
      const newId = `${this._id}-${this.selectedNewSupplier}`
      editAttribute({
        old_supplier_id: this.form.supplier_id,
        supplier_id: this.selectedNewSupplier,
        _id: Number(this._id)
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('本地商品信息更新成功')
        } else {
          this.createFail()
        }
      }).catch(err => {
        console.log(err)
        this.createFail()
      })

      updateGlobalItem({
        global_item_id: this.form.global_item_id,
        global_item_sku: newId
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('Shopee 商品信息更新成功')
        }
      })
    },
    initDefaultDiscount () {
      getDefaultDiscount().then(data => {
        this.basicDiscountIdInShopee = {}
        data.data.forEach(item => {
          this.basicDiscountIdInShopee[item.region] = item._id
        })
      })
    },
    openPublishDialog () {
      if (!this.shopData.length) {
        this.initPublishedList().then(() => {
          this.initModelItem()
        })
      }

      if (!this.isShopeeGlobalItem) {
        this.initGlobalItemInfo()
      }

      if (!this.basicDiscountIdInShopee) {
        this.initDefaultDiscount()
      }

      this.dialogPublishVisible = true
    },
    openDescriptionDialog () {
      this.dialogDescriptionVisible = true
    },
    toggleUnimportance () {
      this.isUnimportanceShow = !this.isUnimportanceShow
    },
    toggleUnimportance2 () {
      this.isUnimportanceShow2 = !this.isUnimportanceShow2
    },
    setMainImage () {
      this.currentImages.splice(this.imagePreviewIndex, 1)
      this.currentImages.unshift(this.currentPreviewImage)
      this.dialogImagePreviewVisible = false
    },
    forwardImage () {
      this.currentImages[this.imagePreviewIndex] = this.currentImages.splice(this.imagePreviewIndex - 1, 1, this.currentPreviewImage)[0]
      this.dialogImagePreviewVisible = false
    },
    backwardImage () {
      this.currentImages[this.imagePreviewIndex] = this.currentImages.splice(this.imagePreviewIndex + 1, 1, this.currentPreviewImage)[0]
      this.dialogImagePreviewVisible = false
    },
    setLastImage () {
      this.currentImages.splice(this.imagePreviewIndex, 1)
      this.currentImages.push(this.currentPreviewImage)
      this.dialogImagePreviewVisible = false
    },
    handleUploadError (file) {
      this.$message.error('上传错误')
    },
    handleVideoError (data) {
      this.isVideoLoading = false
      this.$message.error(data.message)
    },
    handleFileError (data) {
      this.isFileLoading = false
      this.$message.error(data.message)
    },
    beforeUploadImages (file) {
      let imagesNameExist = false

      imagesNameExist = this.form.images.slice(0, 9).find(item => {
        return item.uid !== file.uid && item.name === file.name
      })

      if (imagesNameExist) {
        this.$message.error('图片名称重复')
        return false
      }
      return true
    },
    beforeUploadImagesSku (file) {
      let imagesSkuNameExist = false

      imagesSkuNameExist = this.form.images_sku.find(item => {
        return item.uid !== file.uid && item.name === file.name
      })

      if (imagesSkuNameExist) {
        this.$message.error('图片名称重复')
        return false
      }
      return true
    },
    closeDialogImagePreview () {
      this.dialogImagePreviewVisible = false
    },
    handleImageSuccess (response, file, fileList) {
      this.form.images = fileList.map(item => {
        if (item.uid === file.uid) {
          item.url = response.data.result.url
          delete item.response
          delete item.raw
        }
        return item
      })
    },
    handleImageSkuSuccess (response, file, fileList) {
      this.form.images_sku = fileList.map(item => {
        if (item.uid === file.uid) {
          item.url = response.data.result.url
          delete item.response
          delete item.raw
        }
        return item
      })
    },
    beforeVideoUpload (file) {
      console.log(file)
      this.isVideoLoading = true
    },
    handleVideoSuccess (data) {
      console.log('handleVideoSuccess')
      console.log(data)
      this.isVideoLoading = false
    },
    beforeFileUpload (file) {
      console.log(file)
      this.isFileLoading = true
    },
    handleFileSuccess (data) {
      // this.isFileLoading = false
      if (data.code === 0 && data.id) {
        this.$router.push({ name: 'edit', query: {id: data.id} })
        location.reload()
      }
    },
    changeShopeeGlobalSku () {
      let globalModelSkuList = []
      this.globalModel.forEach((item, index) => {
        globalModelSkuList.push({
          global_model_sku: `${this.form._id}-${String(item.tier_index[0])}-${index}`,
          global_model_id: item.global_model_id
        })
      })

      updateGlobalModel({
        global_item_id: this.form.global_item_id,
        global_model: globalModelSkuList
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('更新成功')
        }
      })
    },
    pushTask (globalId) {
      const shops = this.getShopeeShops()
      shops.forEach(item => {
        // BR 暂时不上新
        // if (item.region.slice(0, 2) !== 'BR') {
          const params = this.getPublishParams({
            id: Number(item.shop_id),
            region: item.region
          }, globalId)

          let discount = priceOrientationMap[this.form.price_orientation].discount
          if (item.region.slice(0, 2) === 'VN') {
            discount = 30
          }

          if (params) {
            addTask({
              _id: `${globalId}${item.shop_id}`,
              item_sku: this._id,
              shop_id: item.shop_id,
              platform: 'shopee',
              region: item.region,
              schedule_tag: '',
              discount: Number(discount),
              params
            }).then(data => {
              console.log(data)
            })
          }
        // }
      })
    },
    getShopeeShops () {
      let shops = []
      Object.keys(this.regionShop).forEach(item => {
        let pushed = false
        const regionShopItem = this.regionShop[item]
        // if (regionShopItem.length === 1) {
        //  shops.push(regionShopItem[0])
        //  pushed = true
        // } else {
          regionShopItem.forEach(subItem => {
            if (this.form.theme === Number(subItem.theme_id)) {
              shops.push(subItem)
              pushed = true
            }
          })
        // }
        if (!pushed) {
          if (regionShopItem[1]) {
            shops.push(regionShopItem[1])
          } else {
            shops.push(regionShopItem[0])
          }
        }
      })
      return shops
    },
    addModel (data) {
      addGlobalModel({
        global_item_id: this.form.global_item_id,
        global_model: [{
          global_model_sku: `${this.form._id}-${data.tier_index[0]}-${data.tier_index[1]}`,
          tier_index: data.tier_index,
          normal_stock: 500,
          seller_stock: [{
            location_id: 'CNZ',
            stock: 100
          }],
          original_price: this.form.cost_price * 10
        }]
      }).then(result => {
        console.log(result)
      })
    },
    addModelSku (item, index, type) {
      let travel
      let tierIndex = []
      let globalModelSku = ''
      if (type === 0) {
        // 新增样式
        travel = this.form.types
      } else if (type === 1) {
        // 新增型号
        travel = this.form.styles
      }

      let globalModel = []

      travel.forEach((sku, skuIndex) => {
        if (type === 0) {
          // 新增样式
          tierIndex = [index, skuIndex]
          globalModelSku = `${this.form._id}-${index}-${skuIndex}`
        } else if (type === 1) {
          // 新增型号
          tierIndex = [skuIndex, index]
          globalModelSku = `${this.form._id}-${skuIndex}-${index}`
        }

        globalModel.push({
          global_model_sku: globalModelSku,
          tier_index: tierIndex,
          seller_stock: [{
            location_id: 'CNZ',
            stock: 500
          }],
          original_price: this.form.cost_price * 10 // TODO
        })
      })

      addGlobalModel({
        global_item_id: this.form.global_item_id,
        global_model: globalModel
      }).then(result => {
        console.log(result)
      })
    },
    deleteModel (data) {
      deleteGlobalModel({
        global_item_id: this.form.global_item_id,
        global_model_id: data.global_model_id
      }).then(result => {
        console.log(result)
      })
    },
    addAccessory () {
      this.dialogAccessoryVisible = true
    },
    addAccessoryAction () {
      if (!this.form.sku_info) {
        this.form.sku_info = {}
      }
      if (!this.form.sku_info[this.accessory.main]) {
        this.form.sku_info[this.accessory.main] = []
      }

      this.accessory.type.forEach(item => {
        this.form.sku_info[this.accessory.main].push({
          type: item
        })
      })

      this.closeAccessoryDialog()
    },
    closeAccessoryDialog () {
      this.dialogAccessoryVisible = false
      // this.accessory.main = ''
      // this.accessory.type = []
    },
    importTypes () {
      this.form.types.unshift('iPhone 16 Pro Max', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16')
      this.$forceUpdate()
    },
    importAllTypes (tag) {
      if (tag === 'max') {
        this.form.types = iPhoneType
      } else if (tag === 'mini') {
        this.form.types = iPhoneTypeMini
      }
      this.$forceUpdate()
    },
    mergeTypes (a, b) {
      const aIndex = this.form.types.indexOf(`iPhone ${a}`)
      const bIndex = this.form.types.indexOf(`iPhone ${b}`)
      if (aIndex >= 0 && bIndex >= 0) {
        this.form.types[aIndex] = `iPhone ${a}/${b}`
        this.form.types.splice(bIndex, 1)
        this.$forceUpdate()
      }
    },
    getTypeWords () {
      this.form.model_type = iPhoneTypeInTitle
    },
    getTypeWordsSimple () {
      this.form.model_type = iPhoneTypeInTitleSimple
    },
    getTypeWordsZFlip () {
      this.form.model_type = SamsungTypeInTitleZFlip
    },
    endTypeDrag () {
      this.$forceUpdate()
    },
    endStyleDrag () {
      this.$forceUpdate()
    },
    deleteAccessory (subItem, subKey, item, key) {
      this.form.sku_info[key].splice(subKey, 1)
      this.$forceUpdate()
    },
    handleUpdateTierVariationProduct (data) {
      updateTierVariationProduct({
        shop_id: data.shop_id,
        tier_variation: this.getTierVariation(JSON.parse(this.form.sku_model), this.form.images_sku),
        item_id: data.item_id
      }).then(res => {
        console.log(res)
      })
    },
    linkPrice (tag) {
      // 自动修改价格定位
      const value = this.form.tags
      for (let i = 0; i < value.length; i++) {
        if (value[i].type === 6) {
          if (value[i].value === '手工制作') {
            this.form.price_orientation = 2
            this.$message.success('价格定位有更新')
            break
          } else if (value[i].value === '繁琐的手工制作') {
            this.form.price_orientation = 3
            this.$message.success('价格定位有更新')
            break
          } else {
            this.form.price_orientation = 1
            this.$message.success('价格定位有更新')
          }
        } else if (value[i].type === 4 && ['镜面', '毛绒', '布纹', '牛仔布纹', '皮纹', '硅胶'].indexOf(value[i].value) >= 0) {
          this.form.price_orientation = 1
          this.$message.success('价格定位有更新')
        }
      }
    },
    selectTag (data) {
      if (!this.form.tags) this.form.tags = []
      this.form.tags.push(data)
      this.$forceUpdate()
      // this.linkPrice(data)
    },
    deleteTag (data) {
      const tagIndex = this.form.tags.indexOf(data)
      this.form.tags.splice(tagIndex, 1)
    },
    generateSellingPoint (tag) {
      this.form.selling_point = this.form.selling_point ? `${this.form.selling_point} ${tag.trans_en}` : tag.trans_en
      this.form.selling_point_traditional = this.form.selling_point_traditional ? `${this.form.selling_point_traditional}${tag.trans_tr}` : tag.trans_tr
      this.$forceUpdate()
    },
    publishAllLazada () {
      shopInLazada.forEach(item => {
        this.publishItem2Lazada({region: item})
      })
    },
    coupangAddProduct () {
      const coupangProduct = {
        sellerProductName: `${this.form.selling_point_traditional} ${this.form._id}`,
        displayProductName: `${NAME_PHONE_CASE} ${this.form.selling_point}`,
        vendorId,
        vendorUserId,
        saleStartedAt: '2021-07-07T17:10:54',
        saleEndedAt,
        displayCategoryCode: this.form.category === categoryIdShopeeAirpodsCase ? categoryIdEarphoneCase : categoryIdPhoneCase, // 手机壳
        brand: '',
        requested: true,
        requiredDocuments: [],
        extraInfoMessage: '',
        manufacture: '',
        registrationType,
        metaData: {
          RETURN_SHIPPING_OPTION: 'COUPANG'
        },
        items: generateCoupangItems(this.form)
      }
      addProductCP(coupangProduct).then(data => {
        if (data.code === 0) {
          const result = JSON.parse(data.data.text)
          if (result.code === 'SUCCESS') {
            this.$message.success(`发布成功 ${result.data}`)
          } else {
            this.$message.error(result)
          }
        } else {
          this.$message.error('发布错误')
        }
      })
    },
    testProductSearch () {
      searchProduct({
        product_id: 14483978554
      }).then(data => {
        console.log(JSON.parse(data.data.text))
      })
    },
    testCategory () {
      searchCategory().then(data => {
        console.log(JSON.parse(data.data.text))
      })
    },
    toGlobalItem () {
      window.open(`https://seller.shopee.cn/portal/product/mtsku/${this.form.global_item_id}`, '_blank')
    },
    clearShopeeGlobalId () {
      this.form.global_item_id = ''
      this.$forceUpdate()
    },
    deleteVideo () {
      this.$confirm('是否确定删除本站视频和shopee全球商品视频?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateGlobalItem({
          global_item_id: this.form.global_item_id,
          video_upload_id: []
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('Shopee 商品信息更新成功')
          }
        })
        editProductVideo({_id: this.form._id, video_upload_id_in_shopee: '', video_url: ''}).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '本站视频删除成功',
              type: 'success'
            })
            location.reload()
          } else {
            this.createFail()
          }
        }).catch(err => {
          console.log(err)
          this.createFail()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    confirmChangeMainImages () {
      this.$confirm('是否确定更换线上商品的图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeShopeeMainImages()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    changeShopeeMainImages () {
      const imagePromises = this.form.images.map(item => {
        let tmp = item.url.split('?')
        let tmp2 = tmp[0].split('/')

        return new Promise(resolve => {
          uploadImage({
            supplierId: this.form.supplier_id,
            productId: this.productId,
            name: tmp2[tmp2.length - 1],
            water: this.water
          }).then(data => {
            console.log(data)
            item.imageId = data.data.imageId
            resolve(data.code)
          })
        })
      })

      Promise.all([
        ...imagePromises
      ]).then(data => {
        console.log(data)
        const isImageSuccess = data.every(item => item === 0)

        if (!isImageSuccess) {
          this.$message.error('图片上传错误')
          return
        }
        this.$message.success('终于完成了图片上传')

        updateGlobalItem({
          global_item_id: this.form.global_item_id,
          image: {
            image_id_list: this.form.images.slice(0, 9).map(item => item.imageId)
          }
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('Shopee 商品信息更新成功')
          }
        })
      })
    },
    changeMultiPrice (data) {
      if (!data) {
        this.form.multi_cost_price = []
      }
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .gc-sku-images {
    width: 160px;
    height: auto;
  }

  .gc-global-item-image {
    width: 160px;
    height: auto;
    margin-right: 15px;
  }

  .gc-card {
    margin: 20px;
  }

  .gc-images {
    display: flex;
    flex-wrap: wrap;
  }

  .gc-image-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .gc-publish-button {
    margin: 10px 10px 10px 0;
    text-align: center;
  }

  .gc-video {
    width: 300px;
  }

  .gc-status {
    float: right;
  }

  .gc-price-info {
    margin-bottom: 30px;
  }

  .gc-product-status {
    text-align: center;
  }

  .gc-description {
    white-space: pre-wrap;
  }

  .gc-description-detail {
    font-size: 12px;
    line-height: 16px;
  }

  .gc-sku-model {
    max-width: 300px;
  }

  .gc-unimportance {
    border: 1px dashed #eee;
    padding: 10px;
  }

  .gc-draggable-tag {
    cursor: pointer;
  }
</style>

<style type="text/css">
  .gc-images-main .el-upload-list li:nth-child(-n+9) {
    border-width: 3px;
    border-color: #F56C6C;
  }
</style>
