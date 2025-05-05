
export const shopInLazada = [
    'SG',
    'MY',
    'VN',
    'PH',
    'TH'
    // 'ID'
]

export const shopBasicDiscountInLazada = {
    SG: 50,
    MY: 50,
    TH: 50,
    VN: 30,
    PH: 50
}

export const orderStatusLazada = [
    'unpaid',
    'pending',
    'canceled',
    'ready_to_ship',
    'delivered',
    'returned',
    'shipped',
    'failed',
    'topack',
    'toship',
    'shipping',
    'lost'
]

export const rateInLazada = {
    SG: {
        commission: 4,
        transaction: 2,
        VAT: 0
    },
    MY: {
        commission: 4,
        transaction: 2,
        VAT: 6
    },
    TH: {
        commission: 4,
        transaction: 2.8,
        VAT: 7
    },
    VN: {
        commission: 4,
        transaction: 3.84,
        VAT: 10
    },
    PH: {
        commission: 4,
        transaction: 2,
        VAT: 12
    }
}
