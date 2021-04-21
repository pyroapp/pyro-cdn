const gc = require('../config');
const path = require('path');
const bucket = gc.bucket('pyro-uploads');

 function generateRandomName() {
  return Math.random().toString(36).substr(2, 9);
}

 const uploadFile = (uid, fileName, type, limit) => new Promise((resolve, reject) => {
  try {
    let file
    if (type == 'avatar') {
      file = bucket.file(`avatars/${uid + path.parse(fileName).ext}`);
    } else {
      file = bucket.file(`userUploads/${uid}/${generateRandomName() + path.parse(fileName).ext}`);
    }

    let oldDate = new Date()
    let date = new Date(oldDate.getTime() + 5*60000);
 
    const options = {
      expires: date.toISOString(),
      conditions: [
        ['content-length-range', 0, limit * 1024 * 1024],
      ],
      fields: {
        acl: 'public-read'
      }
    };

    file.generateSignedPostPolicyV4(options).then(function(data) {
      const response = data[0];
      resolve(response)

});
  } catch (err) {
    reject(err)
  }
});

module.exports = uploadFile;