export function sheet2Workbook (sheet, opts) { // eslint-disable-line
    var n = opts && opts.sheet ? opts.sheet : 'Sheet1'
    var sheets = {}
    sheets[n] = sheet
    return {SheetNames: [n], Sheets: sheets}
}
