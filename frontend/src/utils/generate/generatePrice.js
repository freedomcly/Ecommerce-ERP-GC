import {disclosurePrice} from '@/constants/price.js'

export function generatePrice (costPrice, region, orientation) {
    let discountPrice = 100
    let cost = Number(costPrice)

    switch (region) {
        case 'MY':
            discountPrice = priceMY(cost, orientation)
            return discountPrice * 2
        // case 101:
        //     discountPrice = priceMY(costPrice)
        //     break
        case 'SG':
            discountPrice = priceSG(cost, orientation)
            return discountPrice * 2
        case 'BR':
            discountPrice = priceBR(cost, orientation)
            return discountPrice * 2
        case 'BR_2':
            discountPrice = priceBR(cost, orientation)
            return discountPrice * 2
        case 'TH':
        case 'TH_1':
            discountPrice = priceTH(cost, orientation)
            return discountPrice * 2
        case 'PH':
        case 'PH_1':
            discountPrice = pricePH(cost, orientation)
            return discountPrice * 2
        case 'VN':
            discountPrice = priceVN(cost, orientation)
            return discountPrice / 0.7
        case 'VN_2':
            discountPrice = priceVN(cost, orientation)
            return discountPrice / 0.7
        case 'TW':
            discountPrice = priceTW(cost, orientation)
            return discountPrice * 2
        case 'FR':
            discountPrice = priceFR(cost, orientation)
            return discountPrice * 2
        case 'MX':
            discountPrice = priceMX(cost, orientation)
            return discountPrice * 2
        case 'MX_2':
            discountPrice = priceMX(cost, orientation)
            return discountPrice * 2
        case 'ID':
            discountPrice = priceID(cost, orientation)
            return discountPrice * 2
        case 'CO':
            discountPrice = priceCO(cost, orientation)
            return discountPrice * 2
        case 'PL':
            discountPrice = pricePL(cost, orientation)
            return discountPrice * 2
        case 'CL':
            discountPrice = priceCL(cost, orientation)
            return discountPrice * 2
    }

    return Math.floor(discountPrice / 0.3 * 100) / 100
}

function priceMY (costPrice, orientation) {
    let discountPrice = 100
    if (costPrice <= 2) {
        // discountPrice = 9.99
        discountPrice = 6.718
    } else if (costPrice <= 3) {
        // discountPrice = 10.99
        discountPrice = 6.718
    } else if (costPrice <= 4) {
        // discountPrice = 11.99
        discountPrice = 6.718
    } else if (costPrice <= 5.5) {
        // discountPrice = 12.99
        discountPrice = 9.081
    } else if (costPrice <= 6) {
        // discountPrice = 13.99
        discountPrice = 9.081
    } else if (costPrice <= 7.5) {
        // discountPrice = 15.99
        discountPrice = 13.627
    } else if (costPrice <= 9) {
        // discountPrice = 16.88
        discountPrice = 13.627
    } else if (costPrice <= 10) {
        // discountPrice = 19.88
        discountPrice = 18.17
    } else if (costPrice <= 12) {
        // discountPrice = 22.88
        discountPrice = 18.17
    } else {
        discountPrice = costPrice + 5
    }

    discountPrice = getFinalPrice(orientation, discountPrice)

    return discountPrice
}

function priceSG (costPrice, orientation) {
    let discountPrice = 50
    if (costPrice <= 2) {
        // discountPrice = 2.66
        discountPrice = 2.44
    } else if (costPrice <= 3) {
        // discountPrice = 2.99
        discountPrice = 2.74
    } else if (costPrice <= 4) {
        // discountPrice = 3.66
        discountPrice = 3.35
    } else if (costPrice <= 6) {
        // discountPrice = 3.99
        discountPrice = 3.66
    } else if (costPrice <= 6.5) {
        // discountPrice = 4.66
        discountPrice = 4.27
    } else if (costPrice <= 7.5) {
        // discountPrice = 4.99
        discountPrice = 4.57
    } else if (costPrice <= 9) {
        // discountPrice = 5.66
        discountPrice = 5.19
    } else if (costPrice <= 10) {
        // discountPrice = 5.99
        discountPrice = 5.49
    } else if (costPrice <= 11) {
        // discountPrice = 6.88
        discountPrice = 6.31
    } else {
        discountPrice = costPrice / 4.77 + 4.9
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceBR (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 16.88
    } else if (costPrice <= 3) {
        discountPrice = 18.88
    } else if (costPrice <= 4) {
        discountPrice = 19.88
    } else if (costPrice <= 5.5) {
        discountPrice = 21.99
    } else if (costPrice <= 6.5) {
        discountPrice = 23.88
    } else if (costPrice <= 7.5) {
        discountPrice = 25.88
    } else if (costPrice <= 9) {
        discountPrice = 27.88
    } else if (costPrice <= 10) {
        discountPrice = 29.88
    } else if (costPrice <= 11) {
        discountPrice = 39.99
    } else {
        discountPrice = costPrice + 30
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceTH (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 49
    } else if (costPrice <= 3) {
        discountPrice = 59
    } else if (costPrice <= 4) {
        discountPrice = 69
    } else if (costPrice <= 5.5) {
        discountPrice = 79
    } else if (costPrice <= 6.5) {
        discountPrice = 89
    } else if (costPrice <= 7.5) {
        discountPrice = 99
    } else if (costPrice <= 9) {
        discountPrice = 119
    } else if (costPrice <= 10) {
        discountPrice = 129
    } else if (costPrice <= 11) {
        discountPrice = 139
    } else {
        discountPrice = costPrice * 10 + 30
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function pricePH (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 79
    } else if (costPrice <= 3) {
        discountPrice = 89
    } else if (costPrice <= 4) {
        discountPrice = 99
    } else if (costPrice <= 5.5) {
        discountPrice = 119
    } else if (costPrice <= 6.5) {
        discountPrice = 139
    } else if (costPrice <= 7.5) {
        discountPrice = 159
    } else if (costPrice <= 9) {
        discountPrice = 169
    } else if (costPrice <= 10) {
        discountPrice = 199
    } else if (costPrice <= 11) {
        discountPrice = 219
    } else {
        discountPrice = costPrice * 20 + 30
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceVN (costPrice, orientation) {
    let discountPrice = 70000
    if (costPrice <= 2) {
        discountPrice = 33666
    } else if (costPrice <= 3) {
        discountPrice = 36666
    } else if (costPrice <= 4) {
        discountPrice = 39999
    } else if (costPrice <= 5.5) {
        discountPrice = 56666
    } else if (costPrice <= 6.5) {
        discountPrice = 59666
    } else if (costPrice <= 7.5) {
        discountPrice = 66666
    } else if (costPrice <= 9) {
        discountPrice = 79666
    } else if (costPrice <= 10) {
        discountPrice = 89666
    } else if (costPrice <= 11) {
        discountPrice = 99999
    } else {
        discountPrice = costPrice * 10000
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceID (costPrice, orientation) {
    let discountPrice = 70000
    if (costPrice <= 2) {
        discountPrice = 29666
    } else if (costPrice <= 3) {
        discountPrice = 29999
    } else if (costPrice <= 4) {
        discountPrice = 36666
    } else if (costPrice <= 5.5) {
        discountPrice = 39666
    } else if (costPrice <= 6.5) {
        discountPrice = 49666
    } else if (costPrice <= 7.5) {
        discountPrice = 59666
    } else if (costPrice <= 9) {
        discountPrice = 69666
    } else if (costPrice <= 10) {
        discountPrice = 79666
    } else if (costPrice <= 11) {
        discountPrice = 89666
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceTW (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 59
    } else if (costPrice <= 3) {
        discountPrice = 69
    } else if (costPrice <= 4) {
        discountPrice = 79
    } else if (costPrice <= 5.5) {
        discountPrice = 89
    } else if (costPrice <= 6.5) {
        discountPrice = 99
    } else if (costPrice <= 7.5) {
        discountPrice = 109
    } else if (costPrice <= 9) {
        discountPrice = 119
    } else if (costPrice <= 10) {
        discountPrice = 129
    } else if (costPrice <= 11) {
        discountPrice = 139
    } else {
        discountPrice = costPrice * 10 + 30
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceFR (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 2.99
    } else if (costPrice <= 3) {
        discountPrice = 3.66
    } else if (costPrice <= 4) {
        discountPrice = 3.99
    } else if (costPrice <= 5.5) {
        discountPrice = 4.99
    } else if (costPrice <= 6.5) {
        discountPrice = 5.66
    } else if (costPrice <= 7.5) {
        discountPrice = 5.99
    } else if (costPrice <= 9) {
        discountPrice = 6.66
    } else if (costPrice <= 10) {
        discountPrice = 6.88
    } else if (costPrice <= 11) {
        discountPrice = 6.99
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceMX (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 59
    } else if (costPrice <= 3) {
        discountPrice = 69
    } else if (costPrice <= 4) {
        discountPrice = 79
    } else if (costPrice <= 5.5) {
        discountPrice = 89
    } else if (costPrice <= 6.5) {
        discountPrice = 99
    } else if (costPrice <= 7.5) {
        discountPrice = 109
    } else if (costPrice <= 9) {
        discountPrice = 119
    } else if (costPrice <= 10) {
        discountPrice = 129
    } else if (costPrice <= 11) {
        discountPrice = 139
    } else {
        discountPrice = costPrice * 10 + 30
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceCO (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 13999
    } else if (costPrice <= 3) {
        discountPrice = 15999
    } else if (costPrice <= 4) {
        discountPrice = 16999
    } else if (costPrice <= 5.5) {
        discountPrice = 17999
    } else if (costPrice <= 6.5) {
        discountPrice = 18999
    } else if (costPrice <= 7.5) {
        discountPrice = 19999
    } else if (costPrice <= 9) {
        discountPrice = 21888
    } else if (costPrice <= 10) {
        discountPrice = 22888
    } else if (costPrice <= 11) {
        discountPrice = 23888
    } else {
        discountPrice = costPrice * 2200
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function pricePL (costPrice, orientation) {
    let discountPrice = 200
    if (costPrice <= 2) {
        discountPrice = 16.88
    } else if (costPrice <= 3) {
        discountPrice = 18.88
    } else if (costPrice <= 4) {
        discountPrice = 19.88
    } else if (costPrice <= 5.5) {
        discountPrice = 21.99
    } else if (costPrice <= 6.5) {
        discountPrice = 23.88
    } else if (costPrice <= 7.5) {
        discountPrice = 25.88
    } else if (costPrice <= 9) {
        discountPrice = 29.88
    } else if (costPrice <= 10) {
        discountPrice = 36.88
    } else if (costPrice <= 11) {
        discountPrice = 39.88
    } else {
        discountPrice = costPrice + 30
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function priceCL (costPrice, orientation) {
    let discountPrice = 20000
    if (costPrice <= 2) {
        discountPrice = 2999
    } else if (costPrice <= 3) {
        discountPrice = 3199
    } else if (costPrice <= 4) {
        discountPrice = 3599
    } else if (costPrice <= 5.5) {
        discountPrice = 3999
    } else if (costPrice <= 6.5) {
        discountPrice = 4399
    } else if (costPrice <= 7.5) {
        discountPrice = 4696
    } else if (costPrice <= 9) {
        discountPrice = 4999
    } else if (costPrice <= 10) {
        discountPrice = 5666
    } else if (costPrice <= 11) {
        discountPrice = 5999
    } else {
        discountPrice = costPrice * 100 + 7000
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

export function priceKR (costPrice, orientation) {
    let discountPrice = 9990
    if (costPrice <= 2) {
        discountPrice = 6990
    } else if (costPrice <= 3) {
        discountPrice = 7990
    } else if (costPrice <= 4) {
        discountPrice = 8990
    } else if (costPrice <= 5.5) {
        discountPrice = 9990
    } else if (costPrice <= 6.5) {
        discountPrice = 10990
    } else if (costPrice <= 7.5) {
        discountPrice = 11990
    } else if (costPrice <= 9) {
        discountPrice = 12990
    } else if (costPrice <= 10) {
        discountPrice = 13990
    } else if (costPrice <= 11) {
        discountPrice = 14990
    } else {
        discountPrice = costPrice * 1000 + 5000
    }
    discountPrice = getFinalPrice(orientation, discountPrice)
    return discountPrice
}

function getFinalPrice (orientation, discountPrice) {
    let finalPrice = discountPrice
    if (orientation) {
        finalPrice = discountPrice * (1 + orientation / 10)
    }
    return finalPrice
}

export function generateMoney (region, paramsModelList, model) {
    let targetModelId
    let lowPrice
    model.forEach(item => {
        if (!lowPrice) {
            lowPrice = item.price_info[0].original_price
        } else {
            if (lowPrice > item.price_info[0].original_price) {
                lowPrice = item.price_info[0].original_price
            }
        }
    })
    const lowPriceSet = model.filter(i => i.price_info[0].original_price === lowPrice)
    for (let i = 0; i < lowPriceSet.length; i++) {
        const phoneType = lowPriceSet[i].model_name.split(',')[1]
        switch (phoneType) {
            case 'iPhone 12 mini':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 13 mini':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 11 Pro':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone XR':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone X/XS':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 12 Pro':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 12':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 13':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 14':
                targetModelId = lowPriceSet[i].model_id
                break
            case 'iPhone 11':
                targetModelId = lowPriceSet[i].model_id
                break
        }
        if (targetModelId) break
    }

    if (!targetModelId) {
        targetModelId = lowPriceSet[0]
    }

    const price = disclosurePrice[region]
    let realParamsModelList = paramsModelList.map(item => {
        if (item.model_id === targetModelId) {
            for (let i = 0; i < price.length; i++) {
                if (item.model_promotion_price > price[price.length - 1 - i]) {
                    item.model_promotion_price = price[price.length - 1 - i]
                    break
                }
            }
        }
        return item
    })
    return realParamsModelList
}
