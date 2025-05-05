const fs = require('fs')
const compressing = require('compressing')
const unzipper = require('unzipper')
const AdmZip = require('adm-zip')
const iconv = require('iconv-lite')
const unrar = require('node-unrar-js')

function unzipSync (fileName, mbDir, mimetype) {
  return new Promise((resolve, reject) => {
    if (mimetype.split('/')[1] === 'zip') {
      compressing.zip.uncompress(fileName, mbDir, {zipFileNameEncoding: 'gbk'}).then(res => {
        resolve('解压成功')
      }).catch(err => {
        console.log(err)
        reject('解压失败', err)
      })
    } else {
      // rar
      extractRar(fileName, mbDir)
      resolve('解压成功', 'rar')
    }
  })
}

async function extractRar(rarPath, outputDir) {
  // 读取 RAR 文件内容
  const extractor = await unrar.createExtractorFromFile({
    filepath: rarPath,
    targetPath: outputDir
  })
  const result = extractor.extract()
  console.log(result)
}

// function unzipSync (fileName, mbDir) {
//   return new Promise((resolve, reject) => {
//     const zip = new AdmZip(fileName)

//     const zipEntries = zip.getEntries()
//     for (var i = 0; i < zipEntries.length; i++) {
//       var entry = zipEntries[i]
//       entry.entryName = iconv.decode(entry.rawEntryName, 'gbk')
//     }

//     zip.extractAllTo(mbDir, true)
//     resolve('解压成功')
//   })
// }

// function unzipSync (fileName, mbDir) {
//   return new Promise((resolve, reject) => {
//     // compressing.tgz.uncompress(fileName, mbDir, {zipFileNameEncoding: 'gbk'}).then(res => {
//     //   resolve('解压成功')
//     // }).catch(err => {
//     //   console.log(err)
//     //   reject('解压失败', err)
//     // })
//     fs.createReadStream(fileName)
//       .pipe(unzipper.Extract({path: mbDir}))
//       .on('close', () => {
//         resolve('解压成功')
//       })
//   })
// }

module.exports = {
    unzipSync
}