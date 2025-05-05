import {
  outboundShippingTimeDay,
  NAME_PHONE_CASE
} from '@/constants/coupang.js'
// import {dropNumber} from '@/utils/index.js'
import {priceKR} from '@/utils/generate/generatePrice.js'

export function generateCoupangAttribute (style, type) {
  return [{
    attributeTypeName: 'Style',
    attributeValueName: style,
    exposed: 'EXPOSED',
    editable: true
  },
  {
    attributeTypeName: 'Type',
    attributeValueName: type,
    exposed: 'EXPOSED',
    editable: true
  }]
}

export function generateCoupangImages (images) {
  let coupangImages = []
  images.forEach((item, index) => {
    if (index === 0) {
      coupangImages.push({
        imageOrder: index,
        imageType: 'REPRESENTATION',
        vendorPath: item.url
      })
    } else {
      coupangImages.push({
        imageOrder: index,
        imageType: 'DETAIL',
        vendorPath: item.url
      })
    }
  })
  return coupangImages
}

export function generateCoupangItems (form) {
  let price = priceKR(form.cost_price, form.price_orientation)
  let items = []
  let detailImages = []
  form.images.forEach((item, index) => {
    if (index) {
      detailImages.push({
        imageOrder: index - 1,
        imageType: 'DETAIL',
        vendorPath: item.url
      })
    }
  })
  form.styles.forEach((style, styleIndex) => {
    if (form.multi_cost_price.length) {
      price = priceKR(form.multi_cost_price[styleIndex], form.price_orientation)
    }

    form.types.forEach((type, typeIndex) => {
      items.push({
        outboundShippingTimeDay,
        offerCondition: 'NEW',
        offerDescription: '',
        itemName: `${style} ${type}`,
        originalPrice: price * 2,
        salePrice: price,
        maximumBuyCount: 10,
        maximumBuyForPerson: 10,
        maximumBuyForPersonPeriod: 10,
        unitCount: 1,
        adultOnly: 'EVERYONE',
        parallelImported: 'NOT_PARALLEL_IMPORTED',
        overseasPurchased: 'OVERSEAS_PURCHASED',
        externalVendorSku: `${form._id}-${styleIndex}-${typeIndex}`,
        pccNeeded: true,
        emptyBarcode: true,
        emptyBarcodeReason: '',
        barcode: '',
        modelNo: 'a',
        // images: generateCoupangImages(form.images),
        images: [{
          imageOrder: 0,
          imageType: 'REPRESENTATION',
          vendorPath: form.images_sku[styleIndex].url
        }, ...detailImages],
        notices: [{
          noticeCategoryName: '기타 재화',
          noticeCategoryDetailName: '품명 및 모델명', // 品名及型号
          content: 'mobile phone case/shell'
        }, {
          noticeCategoryName: '기타 재화',
          noticeCategoryDetailName: '인증/허가 사항', // 认证许可事项
          content: 'no'
        }, {
          noticeCategoryName: '기타 재화',
          noticeCategoryDetailName: '제조국(원산지)', // 制造国
          content: 'China'
        }, {
          noticeCategoryName: '기타 재화',
          noticeCategoryDetailName: '제조자(수입자)', // 制造者（进口商）
          content: 'zerowidth'
        }, {
          noticeCategoryName: '기타 재화',
          noticeCategoryDetailName: '소비자상담 관련 전화번호', // 有关消费者咨询的电话号码
          content: '+8618221669006'
        }],
        attributes: generateCoupangAttribute(style, type),
        contents: [{
          contentsType: 'IMAGE_NO_SPACE',
          contentDetails: form.images.map(item => {
            return {
              content: item.url,
              detailType: 'IMAGE'
            }
          })
        }],
        certifications: [{
          certificationType: 'NOT_REQUIRED',
          certificationCode: ''}
        ],
        extraProperties: null,
        searchTags: [type, NAME_PHONE_CASE],
        skuInfo: {
          fragile: false,
          height: form.parcel_size_height * 10,
          length: form.parcel_size_length * 10,
          width: form.parcel_size_width * 10,
          weight: form.weight * 1000 + 10,
          quantityPerBox: 1,
          netWeight: form.weight * 1000
        },
        skuId: null,
        globalInfo: {
          brandName: '',
          brandType: 'NO_BRAND',
          productUrl: null,
          manufacturedCountry: 'China',
          plugItem: false,
          plugType: null,
          battery: false,
          batteryUtilized: '',
          lithiumBatteryType: '',
          batteryWeightType: '',
          batteryQuantityType: '',
          batteryComposition: '',
          batteryWattType: '',
          lithiumWeightType: '',
          batteryType: '',
          productRegulationInfo: false,
          material: {},
          invoiceName: '手机配件',
          localProductName: form.selling_point_traditional,
          productNameEng: `${style} ${type}`
        }
      })
    })
  })
  return items
}
