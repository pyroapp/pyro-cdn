const gc = require('../config');
const path = require('path');
const bucket = gc.bucket('pyro-uploads');

/**
 * 
 * @returns 
 */
 function generateRandomName() {
  return Math.random().toString(36).substr(2, 9);
}


/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
 const uploadFile = (file, name, uid, type) => new Promise((resolve, reject) => {
  let blob;
    if (type == 'avatar') {
      console.log('avatar')
      if (path.parse(name).ext == '.png' | path.parse(name).ext == '.gif') {
        blob = bucket.file(`avatar/${uid + path.parse(name).ext}`)
      } else {
        throw 'Avatar must be of type png or type gif'
      }
    }
    if (type == 'userUpload') {
      console.log('userUpload')
      blob = bucket.file(`userUploads/${uid}/${generateRandomName() + path.parse(name).ext}`)
    }

  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true
  });

  blobStream.on('finish', () => {
    resolve(`https://cdn.pyrochat.app/${blob.name}`);
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`);
  })
  .end(file)
});

module.exports = uploadFile;