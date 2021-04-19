const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const uploadFile = require('./helpers/helpers.js');

const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload());

app.post('/cdn', async (req, res) => {
  try {
    let { uid, ember, type } = req.body;
    console.log('emberpre ' + ember)
    ember = (ember == 'true');
    const { file } = req.files;
	  const { data, name, size } = file;
	  const limit = ember ? 100 : 10;
    
    console.log('limitbool ' + size > limit * 1024 * 1024)
    console.log('size ' + size)
    console.log('limit ' + limit)
    console.log('ember ' + ember)

    // Check if file is larger than the limit
    if (size > limit * 1024 * 1024) res.status(418).send({
      success: false,
      message: "File size exceeds limit.",
      usage: "file = {thefile}; type = {userUpload OR avatar}; uid = {userId}; ember = {true OR false} ember is assumed to be false if not specified"
    });
    let url;
    if (uid != undefined & ember != undefined & file.name != undefined) {
      url = await uploadFile(data, name, uid, type);
    } else {
      throw "null"
    }
    res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        url: url
    });
    } catch (error) {
    res.status(418).json({
        success: false,
        error: error.message,
        usage: "file = {thefile}; type = {userUpload OR avatar}; uid = {userId}; ember = {true OR false} ember is assumed to be false if not specified"
      });
    }
});

app.listen(8080, () => {
  console.log('Uploader listning on port 8080')
});
