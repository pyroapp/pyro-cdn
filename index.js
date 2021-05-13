const express = require('express');
const bodyParser = require('body-parser');
const uploadFile = require('./helpers/helpers.js');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/', async (req, res) => {	
	try {
			// TODO: Cross check UID of user making request with that of firebase auth

			const ember = req.body.ember == 'true';
			const limit = ember ? 100 : 50;
			const { uid, file, type } = req.body;

			const data = await uploadFile(uid, file, type, limit);

			res.status(200).json({
				success: true,
				message: "File authed successfuly",
				POST: data
			});
		} catch (error) {
			res.status(418).json({
				success: false,
				error: error.message,
				usage: "file = name of the file; uid = userid; type = either avatar or userUpload"
			});

			console.error(error.message);
		}
});

app.listen(8080, () => {
	console.log('Uploader listning on port 8080')
});