
export const mobileBrandInShopee = {
    0: 2977,
    1: 2862,
    2: 2960,
    3: 2916,
    4: 2761,
    5: 3015,
    7: 2916,
    8: 2996,
    9: 2996,
    11: 2800,
    12: 2852,
    13: 2908,
    14: 2743,
    15: 2783,
    16: 2872,
    17: 2843,
    18: 2891,
    19: 2916,
    20: 2916
}

export const shopIdInShopee = {
}

export const shopIdGift = [
]

export const buyTaxPriceInShopee = {
    SG: 0.09,
    MY: 0.1,
    TH: 0,
    TW: 0,
    VN: 0,
    BR: 0,
    PH: 0,
    MX: 0,
    CO: 0,
    CL: 0
}

export const rateInShopee = {
    SG: {
        commission: 7,
        transaction: 2,
        service: 6.42
    },
    MY: {
        // commission: 9.18, // 不参与CCB
        commission: 16.2, // 参与CCB
        transaction: 3.78, // 2.16 * (1 + 8%)
        service: 0 // 参加FSS+CCB
        // service: 8 // 参加FSS
    },
    TH: {
        commission: 6.42,
        transaction: 3.21,
        service: 5.35
    },
    VN: {
        commission: 6.6,
        transaction: 3.3,
        service: 9
    },
    PH: {
        commission: 7.84,
        transaction: 2.24,
        service: 5.6
    },
    TW: {
        commission: 7,
        transaction: 2,
        service: 6
    },
    BR: {
        commission: 10,
        transaction: 2,
        service: 6
    },
    MX: {
        commission: 16,
        transaction: 2,
        service: 7
    },
    CO: {
        commission: 10,
        transaction: 2,
        service: 6
    },
    CL: {
        commission: 16,
        transaction: 2,
        service: 6
    },
    PL: {
        commission: 6,
        transaction: 2,
        service: 0
    }
}

export const shippingInShopee = {
    SG: {
        startWeight: 40,
        unitWeight: 10,
        startShipping: 0.72,
        unitShipping: 0.15,
        buyerPaysShipping: 1
    },
    MY: {
        startWeight: 10,
        unitWeight: 10,
        startShipping: 0.15,
        unitShipping: 0.15,
        buyerPaysShipping: 8
    },
    TH: {
        startWeight: 10,
        unitWeight: 10,
        startShipping: 1,
        unitShipping: 1,
        buyerPaysShipping: 79
    },
    VN: {
        startWeight: 10,
        unitWeight: 10,
        startShipping: 900,
        unitShipping: 900,
        buyerPaysShipping: 30000
    },
    PH: {
        startWeight: 50,
        unitWeight: 10,
        startShipping: 23,
        unitShipping: 4.5,
        buyerPaysShipping: 60
    },
    TW: {
        startWeight: 500,
        unitWeight: 500,
        startShipping: 25,
        unitShipping: 60,
        buyerPaysShipping: 70
    },
    BR: {
        startWeight: 30,
        unitWeight: 10,
        startShipping: 5,
        unitShipping: 1.4,
        buyerPaysShipping: 20
    },
    MX: {
        startWeight: 30,
        unitWeight: 10,
        startShipping: 20,
        unitShipping: 5,
        buyerPaysShipping: 40
    },
    CO: {
        startWeight: 30,
        unitWeight: 10,
        startShipping: 3150,
        unitShipping: 1050,
        buyerPaysShipping: 18300
    },
    CL: {
        startWeight: 30,
        unitWeight: 10,
        startShipping: 1320,
        unitShipping: 280,
        buyerPaysShipping: 2430
    },
    PL: {
        startWeight: 10,
        unitWeight: 10,
        startShipping: 1.62,
        unitShipping: 0.4,
        buyerPaysShipping: 8.93
    }
}

export const logisticIdShopee = {
    MY: [28016, 28056],
    SG: [18025, 18099],
    SG_1: [18025, 18099],
    TH: [78004],
    TH_2: [78004],
    TW: [38011, 38020, 38010, 38066, 38012, 38017, 38018],
    VN: [58007],
    VN_2: [58007],
    BR: [90001],
    BR_2: [90001],
    PH: [48002, 48008],
    PH_2: [48002, 48008],
    MX: [],
    MX_2: [],
    CO: [],
    PL: [],
    CL: []
}

export const nameLength = {
    MY: 255,
    SG: 255,
    SG_1: 255,
    TH: 255,
    TW: 60,
    VN: 255,
    VN_2: 255,
    BR: 255,
    BR_2: 255,
    PH: 255,
    PH_1: 255,
    MX: 255,
    MX_2: 255,
    CO: 350,
    PL: 255,
    CL: 255
}

export const shopBasicDiscountInShopee = {
    SG: 50,
    MY: 50,
    TH: 50,
    TH_2: 50,
    TW: 50,
    VN: 30,
    VN_2: 30,
    VN_3: 30,
    BR: 50,
    BR_2: 50,
    PH: 50,
    PH_2: 50,
    MX: 50,
    MX_2: 50,
    CO: 50,
    PL: 50,
    CL: 50
}

export const basicDiscountIdInShopee = {
    SG: 695300685695591,
    MY: 695300993982319,
    TH: 695301358885719,
    TH_1: 695309418238235,
    TW: 695309644726439,
    VN: 695301700718224,
    VN_2: 695309888000088,
    BR: 695302501829381,
    BR_2: 695310053676702,
    PH: 695302292115230,
    PH_1: 695310250807761,
    MX: 695302667507521,
    MX_2: 695310431162135,
    CO: 695302952721538, // 667318327890050
    PL: 695304139709852,
    CL: 695303634292918
}

export const productStatus = {
    0: 'DELETED',
    1: 'NORMAL',
    2: 'BANNED',
    3: 'REVIEWING',
    4: 'INVALID_1', // (Shopee Admin deleted)
    5: 'INVALID_2', // (Shopee Admin delete confirmed)
    6: 'BLACKLISTED', // (Offensive_hide)
    7: 'NORMAL_UNLIST',
    8: 'NORMAL_UNLIST'
}

export const orderStatus = [
    'UNPAID',
    'READY_TO_SHIP',
    'PROCESSED',
    'RETRY_SHIP',
    'SHIPPED',
    'TO_CONFIRM_RECEIVE',
    'IN_CANCEL',
    'CANCELLED',
    'TO_RETURN',
    'COMPLETED'
]

export const promotionNames = {
    bundle: 'Bundle Deal',
    discount: 'Discount Promotions',
    addon: 'Add-on Discount',
    gift: 'Gift with purchase'
}

export const shopeeOrderContent = [
    'buyer_user_id,buyer_username,estimated_shipping_fee,recipient_address,actual_shipping_fee,goods_to_declare,note,note_update_time,item_list,pay_time,dropshipper,dropshipper_phone,split_up,buyer_cancel_reason,cancel_by,cancel_reason,actual_shipping_fee_confirmed,buyer_cpf_id,fulfillment_flag,pickup_done_time,package_list,shipping_carrier,payment_method,total_amount,buyer_username,invoice_data,checkout_shipping_carrier,reverse_shipping_fee,order_chargeable_weight_gram'
]

// 每月更新
export const PCT = {
    SG: 5.25,
    MY: 25.29,
    TH: 238,
    VN: 148480,
    PH: 493,
    TW: 348,
    BR: 48.09,
    MX: 137.22,
    CO: 27574,
    CL: 4139,
    PL: 32.13
}

export const themeShops = [
]
