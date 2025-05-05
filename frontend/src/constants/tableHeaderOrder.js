export const shopeeTableOrder = [
  'categoryId',
  'name',
  'description',
  'id',
  'skuId', // 整合规格编号
  'skuName1',
  'skuValue1',
  'skuImage1',
  'skuName2',
  'skuValue2',
  'price',
  'stock',
  'number', // 商品货号
  'mainImage',
  'image2',
  'image3',
  'image4',
  'image5',
  'image6',
  'image7',
  'image8',
  'image9',
  'weight',
  'length',
  'width',
  'height',
  'delivery',
  'dts'
]

let placeholders166 = []
for (let i = 0; i < 166; i++) {
  placeholders166.push('placeholder')
}

let placeholder19 = []
for (let i = 0; i < 19; i++) {
  placeholder19.push('placeholder')
}

let tableOrder = []

let tableHead = [
  'categoryId',
  'model',
  'brand',
  'placeholder',
  'placeholder',
  'brandCompatibility'
]

tableHead = tableHead.concat(placeholders166)

let tableBody = [
  'material',
  'type'
]

tableBody = tableBody.concat(placeholder19)

let tableFoot = [
  'name',
  'description',
  'description',
  'dangerousGoods',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'id',
  'skuName1',
  'packageContent',
  'length',
  'width',
  'height',
  'weight',
  'mainImage',
  'image2',
  'image3',
  'image4',
  'image5',
  'image6',
  'image7',
  'image8',
  'stock',
  'originalPrice',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'salePrice',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'color',
  'skuValue1',
  'placeholder',
  'placeholder',
  'placeholder',
  'skuValue2',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder'
]

tableOrder = tableHead.concat(tableBody, tableFoot)

export const lazadaTableOrder = tableOrder

export const lazadaTableOrderMY = [
  'id',
  'placeholder',
  'name',
  'mainImage',
  'image2',
  'image3',
  'image4',
  'image5',
  'image6',
  'image7',
  'image8',
  'imageWithoutWaterPrintWhiteBg',
  'placeholder',
  'placeholder',
  'placeholder',
  'brand',
  'material',
  'brandCompatibility',
  'type',
  'model',
  'description',
  'placeholder',
  'packageContent',
  'placeholder',
  'placeholder',
  'placeholder',
  'dangerousGoods',
  'placeholder',
  'skuValue1',
  'skuValue2',
  'placeholder',
  'skuImage1',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'width',
  'height',
  'length',
  'weight',
  'placeholder',
  'price',
  'placeholder',
  'placeholder',
  'placeholder',
  'placeholder',
  'stock'
]
