const express = require('express');
const bodyParser = require('body-parser');
const uploadFile = require('./helpers/helpers.js');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/cdn', async (req, res) => {
  try {
    let ember = (req.body.ember == 'true');
    const limit = ember ? 100 : 10
    data = await uploadFile(req.body.uid, req.body.file, req.body.type, limit);
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
    }
});

app.listen(8080, () => {
  console.log('Uploader listning on port 8080')
});
