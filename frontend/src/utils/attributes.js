import {
    mobileBrandInShopee
} from '@/constants/shopee.js'
import {isScreenProtector} from '@/utils/index'
import {materialMapShopee} from '@/constants/description.js'

const id100471 = {
    attribute_id: 100471,
    attribute_value_list: [{
        value_id: 2792,
        original_value_name: 'Others'
    }]
}

const id100481 = {
    attribute_id: 100481,
    attribute_value_list: [{
        value_id: 2733,
        original_value_name: 'Lightning'
    }, {
        value_id: 2752,
        original_value_name: 'Micro USB'
    }, {
        value_id: 2790,
        original_value_name: 'Type C'
    }]
}

const id100470 = {
    attribute_id: 100470,
    attribute_value_list: [{
      value_id: 2769,
      original_value_name: 'Dirt Resistant'
    }, {
      value_id: 2689,
      original_value_name: 'Dust Resistant'
    }, {
      value_id: 2832,
      original_value_name: 'Shock Resistant'
    }]
}

const id100503 = {
    attribute_id: 100503,
    attribute_value_list: [{
        value_id: 2827,
        original_value_name: 'Front'
    }]
}

const id100529 = {
    attribute_id: 100529,
    attribute_value_list: [{
        value_id: 2899,
        original_value_name: 'Clear'
    }]
}

const id100502 = {
    attribute_id: 100502,
    attribute_value_list: [{
        value_id: 2868,
        original_value_name: 'Tempered Glass'
    }]
}

const id100545 = {
    attribute_id: 100545,
    attribute_value_list: [{
        value_id: 3073,
        original_value_name: 'Switch'
    }]
}

export function getAttributeList (item) {
    let attributeList = []
    const id100488 = {
        attribute_id: 100488,
        attribute_value_list: [{
          value_id: mobileBrandInShopee[item.brand_compatibility_id]
        }]
    }

    const id100134 = {
        attribute_id: 100134,
        attribute_value_list: getAttributeListMaterial(item.material)
    }

    const id100471Flip = {
        attribute_id: 100471,
        attribute_value_list: [{
            value_id: 2722
        }]
    }

    if (isScreenProtector(item)) {
        attributeList = [
            id100488,
            id100503,
            id100529, // 透明
            id100502 // 钢化玻璃
        ]
    } else if (item.category === 100696) {
        attributeList = [
            id100545
        ]
    } else if (item.category === 100481) {
        attributeList = [
            id100481
        ]
    } else if (item.category === 101379) {
        attributeList = []
    } else if (item.category === 100280) {
        attributeList = []
    } else if (item.category === 100279) {
        attributeList = []
    } else if (item.category === 100489) {
        attributeList = [
            id100134,
            id100471Flip
        ]
    } else {
        if (item.brand_compatibility_id === '6') {
            attributeList = []
        } else {
            attributeList = [
                id100471,
                id100470,
                id100488,
                id100134
            ]
        }
    }

    return attributeList
}

function getAttributeListMaterial (material) {
    let result = material.map((item, key) => {
        const materialId = materialMapShopee[item]
        const resultItem = {}
        if (materialId) {
            resultItem.value_id = materialId
            resultItem.original_value_name = item
        } else {
            resultItem.value_id = 0
            resultItem.original_value_name = item
        }
        return resultItem
    })

    if (!result.length) {
        result = [{
            value_id: 1257,
            original_value_name: 'Others'
        }]
    }

    return result
}

export function genereateLazadaCaseFunction (features) {
    let result = 'Water / Dust / Dirt Resistant, Dirt Resistant, Shockproof'
    features.map(feature => {
        if (feature === 'Wrist Strap') {
            result += ', Wristlet case'
        } else if (feature === 'Built-in Stand') {
            result += ', Built-in Stand'
        } else if (feature === 'with Card Slot') {
            result += ', Card / Document Holder'
        } else if (feature === 'Military Grade Protection') {
            result += ', Military grade protection'
        }
    })
    return result
}
