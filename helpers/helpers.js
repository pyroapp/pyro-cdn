const path = require('path')
const gc = require('../config')
const bucket = gc.bucket('pyro-uploads') // should be your bucket name

var genFileName = function () {
    return Math.random().toString(36).substr(2, 9);
  };

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
const uploadImage = (file, userid) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  let filename = genFileName() + path.parse(originalname).ext

  const blob = bucket.file(`${userid}/${filename}`)
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true
    
  })
  blobStream.on('finish', () => {
    const rawPublicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    const publicUrl = `https://cdn.pyrochat.app/${blob.name}`
    resolve({rawUrl: rawPublicUrl, url: publicUrl})
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

module.exports = uploadImage