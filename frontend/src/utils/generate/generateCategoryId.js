import {
    categoryIdShopeePhoneCase,
    categoryIdShopeeAirpodsCase,
    categoryIdShopeeScreenProtector,
    categoryIdLazadaPhoneCase,
    categoryIdLazadaAirpodsCase,
    categoryIdLazadaScreenProtector
  } from '@/constants/categoryIds'

import {isScreenProtector} from '@/utils/index'

const categoryIds = {
    0: categoryIdShopeePhoneCase,
    1: categoryIdShopeePhoneCase,
    2: categoryIdShopeePhoneCase,
    3: categoryIdShopeePhoneCase,
    4: categoryIdShopeePhoneCase,
    5: categoryIdShopeePhoneCase,
    6: categoryIdShopeeAirpodsCase,
    7: categoryIdShopeePhoneCase,
    9: categoryIdShopeePhoneCase,
    10: categoryIdShopeePhoneCase
}

export function generateCategoryId (item) {
    if (isScreenProtector(item)) {
        return categoryIdShopeeScreenProtector
    }

    return categoryIds[item.brand_compatibility_id]
}

export function generateCategoryIdLazada (item) {
    const categoryIds = {
        0: categoryIdLazadaPhoneCase,
        1: categoryIdLazadaPhoneCase,
        2: categoryIdLazadaPhoneCase,
        3: categoryIdLazadaPhoneCase,
        4: categoryIdLazadaPhoneCase,
        5: categoryIdLazadaPhoneCase,
        6: categoryIdLazadaAirpodsCase,
        7: categoryIdLazadaPhoneCase,
        9: categoryIdLazadaPhoneCase,
        10: categoryIdLazadaPhoneCase
    }

    if (isScreenProtector(item)) {
        return categoryIdLazadaScreenProtector
    }

    return categoryIds[item.brand_compatibility_id]
}
