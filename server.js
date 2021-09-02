const express = require('express')
const PORT = process.env.PORT || 5000
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.DBURI

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.once('open', function () {
  console.log('Connected Successfully')
  app.listen(PORT, () => {
    console.log('Server running on ' + PORT)
  })
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,Context-Type,X-Requested-With,Accept,Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'PUT,POST,PATCH,DELETE,GET')
    return res.status(200).json({})
  }
  next()
})

const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/products', productRouter)
app.use('/orders', orderRouter)

// route Not found error middleware
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// Any other error middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})
