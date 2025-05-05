import {rateInShopee, shippingInShopee} from '@/constants/shopee.js'
import {rateInLazada} from '@/constants/lazada.js'
// import {exchangeRate} from '@/constants/exchange.js'

export function getProfit (exchangeRate, price, region, weight, cost, buyerShiping, coupon, bill) {
    let realPrice = price
    let sst = 0
    if (coupon) {
        realPrice = price - coupon
    }
    if (bill && bill.sales_tax_on_lvg) {
        realPrice = realPrice - bill.sales_tax_on_lvg
    }
    if (bill && bill.shipping_fee_sst) {
        sst = bill.shipping_fee_sst
    }
    let buyerPaysShipping = buyerShiping !== undefined ? buyerShiping : shippingInShopee[region].buyerPaysShipping
    let commissionPart = realPrice * rateInShopee[region].commission / 100
    let transactionPart = (realPrice + buyerPaysShipping) * rateInShopee[region].transaction / 100
    let servicePart = realPrice * rateInShopee[region].service / 100
    let sellerPaysShipping = calculateShipping(region, weight)
    if (['VN', 'TH', 'PH'].indexOf(region) >= 0) {
        commissionPart = Math.round(commissionPart)
        transactionPart = Math.round(transactionPart)
        servicePart = Math.round(servicePart)
    }
    return {
        commissionPart,
        transactionPart,
        servicePart,
        sellerPaysShipping,
        income: realPrice - commissionPart - transactionPart - servicePart - sellerPaysShipping - sst,
        profit: realPrice - commissionPart - transactionPart - servicePart - sellerPaysShipping - sst - cost * exchangeRate[region]
    }
}

function calculateShipping (region, weight) {
    const currentShippingInfo = shippingInShopee[region]
    const continuedWeight = weight - currentShippingInfo.startWeight
    const isExceedsStart = Boolean(continuedWeight > 0)
    let shipping = 0
    if (isExceedsStart) {
        const times = Math.ceil(continuedWeight / currentShippingInfo.unitWeight)
        shipping = currentShippingInfo.startShipping + times * currentShippingInfo.unitShipping
    } else {
        shipping = currentShippingInfo.startShipping
    }

    return shipping
}

export function getLazadaBill (data) {
    let bill = {
        item_price_credit: 0,
        commission: 0,
        payment_fee: 0,
        international_shipping_fees: 0,
        domestic_shipping_fees: 0,
        shipping_fee: 0,
        income: 0
    }
    data.forEach(item => {
        bill.income += formatAmount(item.amount)

        switch (item.fee_type) {
            case '13':
                bill.item_price_credit += formatAmount(item.amount)
                break
            case '16':
                bill.commission += formatAmount(item.amount)
                break
            case '3':
                bill.payment_fee += formatAmount(item.amount)
                break
            case '1029':
                bill.international_shipping_fees += formatAmount(item.amount)
                break
            case '1032':
                bill.domestic_shipping_fees += formatAmount(item.amount)
                break
            case '8':
                bill.shipping_fee += formatAmount(item.amount)
                break
        }
    })

    return bill
}

function formatAmount (origin) {
    return Number(origin.split(',').join(''))
}

export function getProfitLazada (price, region, buyerShipping) {
    const paymentFee = rateInLazada[region].transaction * (price + buyerShipping) / 100 * (1 + rateInLazada[region].VAT / 100)
    const commissionFee = rateInLazada[region].commission * price * (1 + rateInLazada[region].VAT / 100) / 100

    return {
        paymentFee,
        commissionFee
    }
}
