const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg');

function toMp4 (source, target) {
    const readStream = fs.createReadStream(source)
    const whiteStream = fs.createWriteStream(target)

    return new Promise(resolve => {
        ffmpeg(source)
        // .input(readStream)
        // .inputFormat('fileSuffix')
            .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
            .format('mp4')
            .on('end', function () {
                console.log('toMp4 finish')
                resolve(1)
            })
            .save(target)
    })
}

function compress (source, target) {
    return new Promise(resolve => {
        ffmpeg(source)
            .size('70%')
            .on('end', function () {
                console.log('compress finish')
                resolve(1)
            })
            .save(target)
    })
}

module.exports = {
    toMp4,
    compress
}
