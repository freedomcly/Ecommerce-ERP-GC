import {promotionNames} from '@/constants/shopee.js'
import domtoimage from 'dom-to-image'

export function deleteHeaderOfSheet (sheet) {
  var keys = Object.keys(sheet)

  keys.forEach(item => {
    if (item.indexOf('!') < 0) {
      let letters = item.split('')
      let numbers = []
      let codes = []
      letters.forEach((letter, index) => {
        let toNumber = Number(letter)
        if (!isNaN(toNumber)) {
          numbers.push(toNumber)
        } else {
          codes.push(letter)
        }
      })

      const isHeader = numbers.length === 1 && numbers[0] === 1
      if (!isHeader) {
        let newNumbers = Number(numbers.join('')) - 1
        let temp = sheet[item]
        let newKey = codes.join('') + newNumbers.toString()
        sheet[newKey] = temp
        delete sheet[item]
      }
    }
  })
}

export function getBrandCompatibilityId (id, productId) {
  const productIdLength = productId.length
  const noProductId = id.slice(0, id.length - productIdLength)
  if (noProductId.length === 6) {
    return Number(noProductId.slice(2, 3))
  } else {
    return Number(noProductId.slice(2, 4))
  }
}

export function getParam (param) {
  const search = location.search.slice(1).split('&')
  const searchMap = {}
  search.map(item => {
    const tmp = item.split('=')
    searchMap[tmp[0]] = tmp[1]
  })

  return searchMap[param]
}

export function isScreenProtector (item) {
  // return String(item.supplier_id).slice(0, 1) === '8'
  return String(item.supplier_id) === '801'
}

export function adoptedPromotion (promotion) {
  let bundle = {}
  let discount = {}
  let addOn = {}

  promotion.forEach(item => {
    if (item.promotion_staging === 'ongoing') {
      switch (item.promotion_type) {
        case promotionNames.bundle:
          bundle.promotion_id = item.promotion_id
          bundle.type = item.promotion_type
          break
        case promotionNames.discount:
          discount.promotion_id = item.promotion_id
          discount.type = item.promotion_type
          if (!discount.models) discount.models = []
          discount.models.push({
            id: item.model_id,
            price: item.promotion_price_info[0].promotion_price
          })
          break
        case promotionNames.addon:
        case promotionNames.gift:
          addOn.promotion_id = item.promotion_id
          addOn.type = item.promotion_type

          if (item.model_id) {
            if (!addOn.models) addOn.models = []

            let result = {
              id: item.model_id
            }
            if (item.promotion_price_info && item.promotion_price_info.length) {
              result.price = item.promotion_price_info[0].promotion_price
            }
            addOn.models.push(result)
          }
      }
    }
  })
  return [
    bundle,
    discount,
    addOn
  ].filter(item => Object.keys(item).length > 0)
}

export function downloadPng (dom, name) {
  domtoimage.toPng(dom)
    .then(function (url) {
        const link = document.createElement('a')
        link.download = name
        link.href = url
        link.click()
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error)
    })
}

export function getDate () {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function dropNumber (str) {
  return str.replace(/[0-9]/g, '')
}

export function getSystemType () {
  let isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  let isWindows = /windows/i.test(navigator.userAgent)
  if (isMac) {
    return 'mac'
  } else if (isWindows) {
    return 'windows'
  } else {
    return 'unknown'
  }
}
