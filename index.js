const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadImage = require('./helpers/helpers.js')

const app = express()

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 100 * 1024 * 1024,
  },
})

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    const reqdata = req.body
    //console.log(reqdata.keep)
    if (reqdata.token == "kek") {
      res.status(403).json({message: "no no token no no access"})
    } else {
    const imageRes = await uploadImage(myFile, reqdata.userid)
    res
      .status(200)
      .json({
        success: true,
        message: "Upload was successful",
        rawUrl: imageRes.rawUrl,
        url: imageRes.url
      })
    }
  } catch (error) {
    //console.log(error)
    next(error)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
    success: false
  })
  next()
})

app.listen(9001, () => {
  console.log('app now listening for requests!!!')
})
