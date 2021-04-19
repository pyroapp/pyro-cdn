const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const uploadFile = require('./helpers/helpers.js');

const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload());

app.post('/upload', async (req, res) => {
  try {
    const { uid, ember } = req.body;
    const { file } = req.files;
	const { data, name, size } = file;
	const limit = ember ? 50 : 8;

	// Check if file is larger than 100mb
	if (size > limit * 1024 * 1024) res.status(418).send({
		success: false,
		message: "File size exceeds limit."
	});

    const url = await uploadFile(data, name, uid);

    res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        url: url
    });
  } catch (error) {
    res.status(418).json({
        success: false,
        message: error.message
    });
  }
});

app.listen(8080, () => {
  console.log('Uploader listning on port 8080')
});
