const gc = require('../config');
const path = require('path');
const bucket = gc.bucket('pyro-uploads');

function genName() {
	return Math.random().toString(36).substr(2, 9);
}

const uploadFile = (uid, fileName, type, limit) => new Promise(async (resolve, reject) => {
	try {
		const extension = path.parse(fileName).ext;
		const location = type == 'avatar' ? `avatars/${uid}.gif` : `uploads/${uid}/${genName() + extension}`;
		const file = bucket.file(location);

		// Set expiration date for authentication token
		const oldDate = new Date();
		const date = new Date(oldDate.getTime() + 5 * 60000); // 5 minute expiration
	
		// Set policy document
		const options = {
			expires: date.toISOString(),
			conditions: [
				['content-length-range', 0, limit * 1024 * 1024], // Sets limit for file upload
			],
			fields: {
				acl: 'public-read' // Access Control Level
			}
		};

		// Generate policy document
		const data = await file.generateSignedPostPolicyV4(options);
		
		resolve(data[0]);
  	} catch (error) {
    	reject(error);
  	}
});

module.exports = uploadFile;