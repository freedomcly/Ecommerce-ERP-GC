import {
    // boxContentPhone,
    // boxContentPhoneTW,
    // boxContentAirpods,
    // boxContentAirpodsTW,
    // boxContentScreenProtector,
    // boxContentScreenProtectorTW,
    shopInfo,
    shopInfoTW,
    shopInfoFlip,
    shopeeTail,
    shopeeTailTW,
    hardness
} from '@/constants/description'
// import {imageDomain, waterPrint} from '@/constants/aliyun'
// import {getPlatform, getCountry} from '@/utils/env'
// import {isScreenProtector} from '@/utils/index'

let hardnessMap = {}
hardness.forEach(item => {
    hardnessMap[item.value] = item.label
})

export function generateDescription (item, library, shop, isGeneral) {
    const librarySet = {}
    const librarySetTW = {}

    if (!Object.keys(library).length) return

    library.forEach(item => {
        librarySet[item.short] = item.long
        librarySetTW[item.short] = {
            long_trans_traditional: item.long_trans_traditional,
            short_trans_traditional: item.short_trans_traditional
        }
    })
    // const platform = getPlatform(stationId)
    // Features
    let featuresWord = ``
    let featuresWordTW = ``

    if (item.features[0] !== '0') {
        item.features.forEach((item, index) => {
            if (shop && shop.region === 'CL') {
                featuresWord = `${item} - ${librarySet[item]}\n` + featuresWord
            } else {
                featuresWord = `🚩 [ ${item} ]\n${librarySet[item]}\n` + featuresWord
            }
            if (librarySetTW[item] && librarySetTW[item].short_trans_traditional) {
                featuresWordTW = `🚩 [ ${librarySetTW[item].short_trans_traditional} ]\n${librarySetTW[item].long_trans_traditional}\n` + featuresWordTW
            }
        })
    } else {
        featuresWord = ''
        featuresWordTW = ''
    }

    // let featuresList = item.features.join('\n🚩')
    // featuresWord += `${featuresList}`

    // TechnicalSpecifications
    let technicalSpecifications = ''
    let technicalSpecificationsTW = ''
    let materialWords = `Material:\n${item.material.join(' + ')}`
    let materialWordsTW = `材質:\n${item.material.join(' + ')}`

    technicalSpecifications = `${materialWords}`
    technicalSpecificationsTW = `${materialWordsTW}`

    // Thickness
    let thickness = item.thickness
    if (thickness) {
        technicalSpecifications += `\n\nThickness:\n${thickness}mm`
        technicalSpecificationsTW += `\n\n厚度:\n${thickness}mm`
    }

    // Hardness
    let hardnessWord = ''
    if (item.hardness) {
        hardnessWord = `\n\nHardness:\n${hardnessMap[item.hardness]}`
        technicalSpecifications += hardnessWord
        technicalSpecificationsTW += `\n\n硬度:\n${hardnessMap[item.hardness]}`
    }

    // Compatible with
    // let compatibleWith = 'Compatible with:'
    // let compatibleWithTW = '適用於:'

    // if (item.sku_model) {
    //     const options = JSON.parse(item.sku_model)[1].model_options

    //     options.forEach(item => {
    //         // compatibleWith += `\n#${item}`
    //         // compatibleWithTW += `\n#${item}`
    //     })
    // }

    // if (item.brand_compatibility_id === '0') {
    //     compatibleWith += '\nFor other models, please look at <Other iPhone Type> in the store Category or contact us.'
    // } else {
    //     compatibleWith += '\nFor other models or other styles in the picture, please contact us.'
    // }

    let shopInfoWords = ''

    if (item.theme) {
        shopInfoFlip.forEach(item => {
            shopInfoWords += `${item}\n`
        })
    } else {
        shopInfo.forEach(item => {
            shopInfoWords += `${item}\n`
        })
    }

    let shopInfoWordsTW = ''
    shopInfoTW.forEach(item => {
        shopInfoWordsTW += `${item}\n`
    })

    // if (getCountry(stationId) === 'TW') {
    //     return '手機殼'
    // }

    let description

    // let boxContent
    // let boxContentTW
    // if (isScreenProtector(item)) {
    //     boxContent = boxContentScreenProtector
    //     boxContentTW = boxContentScreenProtectorTW
    // } else {
    //     if (item.brand_compatibility_id === '6') {
    //         boxContent = boxContentAirpods
    //         boxContentTW = boxContentAirpodsTW
    //     } if (item.category === 100490) {
    //         boxContent = boxContentPhone
    //         boxContentTW = boxContentPhoneTW
    //     } else {
    //         boxContent = ''
    //         boxContentTW = ''
    //     }
    // }

    if (shop && shop.region === 'TW') {
        // description = `${featuresWordTW}\n${technicalSpecificationsTW}\n\n${boxContentTW ? `${boxContentTW}\n\n` : ''}${compatibleWithTW}\n\n${shopInfoWordsTW}${shopeeTailTW}`
        description = `產品特點:\n${featuresWordTW}\n${technicalSpecificationsTW}\n\n${shopInfoWordsTW}${shopeeTailTW}`
    } else if (shop && shop.region === 'CL') {
        // description = `${featuresWord}\n${technicalSpecifications}\n\n${boxContent ? `${boxContent}\n\n` : ''}${compatibleWith}\n\n${shopInfoWords}${shopeeTail}`
        description = `Features:\n${featuresWord}\n${technicalSpecifications}`
    } else {
        description = `Features:\n${featuresWord}\n${technicalSpecifications}\n\n${shopInfoWords}${shopeeTail}`
    }

    if (isGeneral) {
        description = `${featuresWord}\n${technicalSpecifications}\n\n${shopInfoWords}${shopeeTail}`
    }

    return description
}

export function generateShortDescription (features, library) {
    const librarySet = {}
    library.forEach(item => {
        librarySet[item.short] = item.long
    })
    const li = features.map(item => {
        return `<li> [${item}] - ${librarySet[item]}</li>`
    })

    return `<ul>${li.join('')}</ul>`
}

export function generateDescriptionInLazada (images, noTail) {
    let shopInfoWords = ''
    shopInfo.slice(1).forEach(item => {
        shopInfoWords += `<div>${item}</div>`
    })
    const imagesHtml = images.map(item => `<img src="${item}" />`).join('')

    if (noTail) {
        return `${imagesHtml}<br>`
    }

    return `${imagesHtml}<br><div>${shopInfoWords}</div>`
}

// function insertHTML (words, tag) {
//     return `<${tag}>${words}<${tag}/>`
// }

// function generateHTMLDescription (item, options) {
//     let features = insertHTML('Features:', 'div')

//     for (let i = 0; i < item.features.length; i++) {
//         features += insertHTML(`🚩${item.features[i]}`, 'div')
//     }

//     let material = insertHTML('Material:', 'div')
//     material += insertHTML(item.material, 'div')

//     let thickness = ''
//     if (item.thickness) {
//         thickness += insertHTML('Thickness:', 'div')
//         thickness += insertHTML(item.thickness, 'div')
//         thickness += '<br>'
//     }

//     let packageContent = insertHTML('What\'s in the box:', 'div')
//     packageContent += insertHTML('1 x Phone Case', 'div')
//     packageContent += insertHTML('1 x Random Gift', 'div')

//     let compatibleWith = insertHTML('Compatible with:', 'div')
//     options.forEach(option => {
//         compatibleWith += insertHTML(option, 'div')
//     })

//     let shopInfoWords = ''
//     shopInfo.forEach(line => {
//         console.log(line)
//         shopInfoWords += insertHTML(line, 'div')
//     })

//     const productId = String(item._id).slice(6)
//     const imagePathUrl = `${imageDomain}${item.supplier_id}/${productId}/`
//     let images = '<div>'
//     for (let i = 0; i < 9; i++) {
//         images += `<img src="${imagePathUrl}${i + 1}.jpg${waterPrint}">`
//     }
//     images += '</div>'

//     return `<div style="font-family: -apple-system, 'Roboto', 'Helvetica Neue', 'PingFang SC', 'Noto Sans CJK SC', sans-serif;font-size: 16px;">${features}<br>${material}<br>${thickness}${packageContent}<br>${compatibleWith}<br>${shopInfoWords}<br>${images}</div>`
// }
