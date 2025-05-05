
const disclosurePrice = {
  TH: [39, 99, 169],
  MY: [9.08, 12.71], // 9.99, 13.99
  VN: [39999, 69999, 99999, 139999, 169999],
  PH: [99, 139, 199],
  SG: [3.66, 6.11], // 3.99, 6.66
  TW: [39, 99, 169]
}

function generateMoney (region, paramsModelList, model) {
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

function adoptModel(model, data) {
  const paramsModelList = model.map(item => {
    return {
      model_id: item.model_id,
      model_promotion_price: item.price_info[0].original_price * (100 - data.discount) / 100
    }
  })

  let realParamsModelList = paramsModelList

  // 先只测试TH/VN/MY 苹果手机壳
  if (data.item_sku.slice(2, 3) === '0' && Number(data.params.item.category_id) === 100490) {
    if (['TH', 'MY', 'PH', 'SG', 'TW'].indexOf(data.region) >= 0) {
      realParamsModelList = generateMoney(data.region, paramsModelList, model)
    }
  }

  return realParamsModelList
}

module.exports = {
    adoptModel
}
