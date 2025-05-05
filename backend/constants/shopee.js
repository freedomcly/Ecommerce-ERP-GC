const shopIdInShopee = {
    SG: '',
    merchant: ''
}

let shopIdInShopeeMap = {}
Object.keys(shopIdInShopee).forEach(item => {
    shopIdInShopeeMap[shopIdInShopee[item]] = item
})

const unlistIndicator = {
    viewsMax: 10,
    viewsTotal: 20,
    likesMax: 5,
    likesTotal: 10,
    saleMax: 1,
    saleTotal: 1,
    rating_star: 5,
    unlistDays: 60
}

const unlistSuggestIndicator = {
    viewsMax: 10,
    viewsTotal: 20,
    likesMax: 5,
    likesTotal: 10,
    saleMax: 1,
    saleTotal: 4,
    unlistDays: 90
}

module.exports = {
    unlistIndicator,
    unlistSuggestIndicator,
    shopIdInShopee,
    shopIdInShopeeMap
}