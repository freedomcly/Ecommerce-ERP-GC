
const costRange = [1.5, 50]

export function generateCostList () {
    const from = costRange[0]
    const to = costRange[1]

    let costList = []
    let flag = from
    while (flag <= to) {
        costList.push(flag)
        flag = flag + 0.5
    }
    return costList
}
