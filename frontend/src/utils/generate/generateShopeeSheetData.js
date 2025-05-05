import {imageDomain, waterPrint} from '@/constants/aliyun'
import brandCompatibility from '@/constants/brandCompatibility'
import {getBrandCompatibilityId} from '@/utils/index'
import {generatePrice} from '@/utils/generate/generatePrice'
import {generateTitle} from '@/utils/generate/generateTitle'
import {generateDescription} from '@/utils/generate/generateDescription'
import {generateCategoryId} from '@/utils/generate/generateCategoryId'
import {getPlatform} from '@/utils/env'

export function generateShopeeSheetData (originArray, stationId) {
  const platform = getPlatform(stationId)
  let result = []
  console.log('originArray: ', originArray)

  originArray.map(item => {
    const productId = String(item._id).slice(6)
    const imagePathUrl = `${imageDomain}${item.supplier_id}/${productId}/`
    let newItem = {}
    newItem.categoryId = generateCategoryId(stationId)
    newItem.name = generateTitle(item.selling_point, stationId, getBrandCompatibilityId(item._id), item.model_type)
    newItem.id = item._id
    newItem.skuId = newItem.id
    newItem.price = generatePrice(item.cost_price, stationId)
    newItem.stock = 30
    newItem.mainImage = `${imagePathUrl}1.jpg${waterPrint}`
    newItem.image2 = `${imagePathUrl}2.jpg${waterPrint}`
    newItem.image3 = `${imagePathUrl}3.jpg${waterPrint}`
    newItem.image4 = `${imagePathUrl}4.jpg${waterPrint}`
    newItem.image5 = `${imagePathUrl}5.jpg${waterPrint}`
    newItem.image6 = `${imagePathUrl}6.jpg${waterPrint}`
    newItem.image7 = `${imagePathUrl}7.jpg${waterPrint}`
    newItem.image8 = `${imagePathUrl}8.jpg${waterPrint}`
    newItem.image9 = `${imagePathUrl}9.jpg${waterPrint}`
    newItem.weight = item.weight
    newItem.length = item.parcel_size_length
    newItem.width = item.parcel_size_width
    newItem.height = item.parcel_size_height

    let skuModelData = JSON.parse(item.sku_model)
    newItem.skuName1 = skuModelData[0].model_name
    newItem.skuName2 = skuModelData[1].model_name

    newItem.description = generateDescription(item, stationId)

    // shopee
    if (platform === 'shopee') {
      newItem.delivery = '开启'
      newItem.dts = '3'
    }

    console.log(item)
    // lazada
    // newItem.video = `${imagePathUrl}video.mp4`
    if (platform === 'lazada') {
      newItem.model = ''
      newItem.brand = 'No Brand'
      newItem.material = item.material[0]
      newItem.brandCompatibility = brandCompatibility[getBrandCompatibilityId(item._id)]
      newItem.type = 'Back Cover'
      newItem.placeholder = ''
      newItem.dangerousGoods = 'None'
      newItem.packageContent = '1 x Phone Case'
      newItem.imageWithoutWaterPrintWhiteBg = `${imagePathUrl}9.jpg?x-oss-process=style/thumbnail`

      // console.log(newItem.description)
      // newItem.originalPrice = item.cost_price * 10
      // newItem.salePrice = item.cost_price * 4
      // newItem.color = '...'
      // newItem.bundleSize = 1
      // newItem.specialPrice = (newItem.price * 0.3).toFixed(2)

      delete newItem.skuName2
      delete newItem.skuId
      // delete newItem.id
      delete newItem.skuName1
    }

    console.log(newItem)

    // #H
    skuModelData[0].model_options.forEach((model, index) => {
      skuModelData[1].model_options.forEach((model2, index2) => {
        let data = {}
        data.skuValue1 = model
        data.skuImage1 = `${imagePathUrl}${model}.jpg${waterPrint}`
        data.skuValue2 = model2

        _.assign(data, newItem) // eslint-disable-line

        result.push(data)
      })
    })
  })

  return result
}
