import {getPlatform, getCountry} from '@/utils/env'
import {isScreenProtector} from '@/utils/index'

import brandCompatibility, {iPhoneTypeInTitle, iPhoneMainTypeByRegion} from '../../constants/brandCompatibility'
import {
  CATEGORY_PHONE_CASE,
  CATEGORY_TABLET_CASE,
  MY_BIG_WORD_CASING,
  // MY_BIG_WORD_CASETIFY,
  MY_GENERAL_SELLING_WORD,
  MY_CHINESE_WORD,
  // MY_CHINESE_WORD_TABLET,
  // SG_BIG_WORD_CASETIFY,
  SG_GENERAL_SELLING_WORD,
  SG_CHINESE_WORD,
  // SG_CHINESE_WORD_TABLET,
  TH_BIG_WORD_APPLE_PHONE_CASE,
  TH_BIG_WORD_APPLE_PHONE_CASE2,
  TH_BIG_WORD_PHONE_CASE,
  TH_BIG_WORD_CASE,
  TW_WORD_PHONE_CASE,
  TH_BIG_WORD_APPLE_IPAD_CASE,
  // TW_BIG_WORD_PHONE_CASE,
  TW_WORD_EARPHONE_CASE,
  TW_BIG_WORD_EARPHONE_CASE,
  TW_WORD_SCREEN_PROTECTOR,
  TW_BIG_WORD_SCREEN_PROTECTOR,
  TH_GENERAL_SELLING_WORD,
  BR_BIG_WORD_CAPA,
  MX_BIG_WORD_FUNDA,
  MX_BIG_WORD_FUNDAS,
  MX_GENERAL_SELLING_WORD,
  PL_BIG_WORD_ETUI,
  BR_BIG_WORD_PULSEIRA,
  BR_BIG_WORD_CAPINHA,
  CO_BIG_WORD_FORROS,
  CL_BIG_WORD_CARCASA,
  CL_BIG_WORD_CARCASAS
} from '@/constants/words.js'
import {
  categoryIdShopeeWatchband,
  categoryIdShopeeTabletCase
} from '@/constants/categoryIds.js'

export function generateTitle (sellingPoint, stationId, brandCompatibilityId, modelType) {
  console.log(brandCompatibilityId)
  const platform = getPlatform(stationId)
  const country = getCountry(stationId)
  const brand = brandCompatibility[brandCompatibilityId]
  let prefix = '🔥Ready Stock🎁'
  let titleModelType
  let iPhoneModels = iPhoneTypeInTitle
  let chineseWords = '手機殼'
  let universalSellingPointWords = 'Ins Aesthetic Newest Fashion Retro Classic Protective Shockproof'

  let productName
  let universalProductName = 'Phone Case'

  if (stationId === 3) {
    return `${sellingPoint} ${brand} Case`
  }

  let title = ''

  if (modelType) {
    titleModelType = modelType
  } else if (brandCompatibilityId === '0') {
    titleModelType = iPhoneModels
  }

  if (brandCompatibilityId === '0') {
    chineseWords = `蘋果${chineseWords}`
  } else {
    chineseWords = `${chineseWords}`
  }

  switch (country) {
    case 'MY':
      productName = `Casing ${brand}`
      break
    default:
      productName = `${brand} Case`
  }

  if (titleModelType) {
    productName += ` ${titleModelType}`
  }

  switch (platform) {
    case 'shopee':
      if (country === 'MY' || country === 'SG') {
        title = `${prefix}${sellingPoint} ${productName} ${universalSellingPointWords} ${universalProductName} ${chineseWords}`
      } else if (country === 'TW') {
        title = '【現貨】蘋果手機殼 iPhone 15 14 13 12 11 Pro Max X XS 唯美时尚复古防撞'
      } else {
        title = `${prefix}${sellingPoint} ${productName} ${universalSellingPointWords} ${universalProductName}`
      }
      break

    case 'lazada':
      title = `${sellingPoint} ${productName} ${universalSellingPointWords} ${universalProductName}`
      break
  }

  return title
}

export function generateShopProductTitle (data, isGeneral) {
  if (isGeneral) {
    return data.sellingPoint
  }

  if (data.brand === 'AirPods') {
    switch (data.region) {
      case 'TW':
        return `${TW_WORD_EARPHONE_CASE} 兼容於 ${data.brand} ${TW_BIG_WORD_EARPHONE_CASE}`
      default:
        return `${data.sellingPoint} Case For ${data.model} Shockproof Charging Box Silicone Soft Cover`
    }
  }

  if (data.category === categoryIdShopeeWatchband) {
    switch (data.region) {
      case 'TW':
        return `表带兼容于 ${data.brand} ${data.model}`
      case 'BR':
        return `${BR_BIG_WORD_PULSEIRA} ${data.sellingPoint} Strap For Apple Watch Fashion Loop Band For ${data.model} Smartwatch`
      default:
        return `${data.sellingPoint} Watch Strap For ${data.brand} Fashion Loop Band For ${data.model} Smartwatch`
    }
  }

  if (data.category === categoryIdShopeeTabletCase) {
    switch (data.region) {
      case 'TW':
        return `平板殼兼容于 ${data.model}`
      case 'BR':
        return `${data.sellingPoint} Case ${BR_BIG_WORD_CAPA} For ${data.model}`
      case 'MY':
        return `${MY_BIG_WORD_CASING} For ${data.main_type} ${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model}`
      case 'SG':
        return `For ${data.main_type} Case ${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model}`
      case 'TH':
        return `${data.brand === 'iPad' ? `For ${TH_BIG_WORD_APPLE_IPAD_CASE} ` : ''}${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD}`
      case 'VN':
        return `Case For ${data.main_type} ${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model}`
      case 'PH':
        return `${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD}`
      case 'MX':
        return `${data.sellingPoint} ${MX_BIG_WORD_FUNDA} For ${data.model} ${MX_BIG_WORD_FUNDAS} ${CATEGORY_TABLET_CASE}`
      case 'CO':
        return `${data.sellingPoint} Case Cover Protector ${MX_BIG_WORD_FUNDA} For ${data.main_type}`
      case 'PL':
        return `Case ${PL_BIG_WORD_ETUI} For ${data.model} ${data.sellingPoint} ${MX_GENERAL_SELLING_WORD}`
      case 'CL':
        return `${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model}`
      default:
        return `${data.sellingPoint} ${CATEGORY_TABLET_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD}`
    }
  }

  if (isScreenProtector(data)) {
    switch (data.region) {
      case 'TW':
        return `${TW_WORD_SCREEN_PROTECTOR} 兼容於 ${data.brand} ${TW_BIG_WORD_SCREEN_PROTECTOR}`
      default:
        return `${data.sellingPoint} Tempered Glass Screen Protector For ${data.model}`
    }
  }

  const mainType = data.brand === 'iPhone' ? iPhoneMainTypeByRegion[data.region][0] : data.main_type

  switch (data.region) {
    case 'MY':
      return `${MY_BIG_WORD_CASING} For ${mainType} ${data.sellingPoint} ${CATEGORY_PHONE_CASE} For ${data.model} ${MY_GENERAL_SELLING_WORD} ${MY_CHINESE_WORD}`
    case 'SG':
      return `For ${mainType} Case ${data.sellingPoint} ${CATEGORY_PHONE_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD} ${SG_CHINESE_WORD}`
    case 'TH':
    case 'TH_1':
      return `For ${data.brand === 'iPhone' ? TH_BIG_WORD_APPLE_PHONE_CASE : TH_BIG_WORD_PHONE_CASE} ${data.brand === 'iPhone' ? mainType.split(' ').slice(1).join(' ') : mainType} ${data.sellingPoint} ${TH_BIG_WORD_CASE} ${CATEGORY_PHONE_CASE} For ${data.model} ${data.brand === 'iPhone' ? `For ${TH_BIG_WORD_APPLE_PHONE_CASE2}` : ''}${TH_GENERAL_SELLING_WORD}`
    case 'VN':
      return `Case For ${mainType} ${data.sellingPoint} ${CATEGORY_PHONE_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD}`
    case 'VN_2':
      return `${data.sellingPoint} Case For ${data.model} ${CATEGORY_PHONE_CASE} ${SG_GENERAL_SELLING_WORD}`
    case 'PH':
    case 'PH_1':
      return `For ${data.brand === 'iPhone' ? 'iPhone 11' : mainType} Case ${data.sellingPoint} ${CATEGORY_PHONE_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD}`
    case 'BR':
      // return `${data.sellingPoint} Case ${BR_BIG_WORD_CAPA} ${data.brand === 'iPhone' ? `For iPhone 11 ` : ''}For ${data.model}`
      return `${data.sellingPoint} Case ${BR_BIG_WORD_CAPA} ${BR_BIG_WORD_CAPINHA} For ${data.model}`
    case 'BR_2':
      return `${data.sellingPoint} ${BR_BIG_WORD_CAPA} ${BR_BIG_WORD_CAPINHA} Case For ${data.model}`
    case 'MX':
      return `${data.sellingPoint} ${MX_BIG_WORD_FUNDA} For ${data.model} ${MX_BIG_WORD_FUNDAS} ${CATEGORY_PHONE_CASE} ${MX_GENERAL_SELLING_WORD}`
    case 'MX_2':
      return `${MX_BIG_WORD_FUNDA} For ${data.model} ${MX_BIG_WORD_FUNDAS} ${data.sellingPoint} ${CATEGORY_PHONE_CASE} ${MX_GENERAL_SELLING_WORD}`
    case 'CO':
      return `${data.sellingPoint} ${CO_BIG_WORD_FORROS} Case Cover Protector ${MX_BIG_WORD_FUNDA} For ${data.brand} ${data.brand === 'iPhone' ? mainType.split(' ').slice(1).join(' ') : mainType} For ${data.model}`
    case 'PL':
      return `Case ${PL_BIG_WORD_ETUI} For ${data.model} ${data.sellingPoint}`
    case 'TW':
      return `${data.sellingPointT} ${TW_WORD_PHONE_CASE} 兼容於 ${data.model.length > 52 ? mainType : data.model}`
    case 'CL':
      return `${data.sellingPoint} ${CL_BIG_WORD_CARCASA} ${CL_BIG_WORD_CARCASAS} For ${data.model}`
    case 'TK':
      return `For ${mainType} Case ${data.sellingPoint} ${CATEGORY_PHONE_CASE} For ${data.model}`
    default:
      return `${data.sellingPoint} ${CATEGORY_PHONE_CASE} For ${data.model} ${SG_GENERAL_SELLING_WORD}`
  }
}
