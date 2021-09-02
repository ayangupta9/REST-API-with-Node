const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')
const Product = require('../models/product')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, new Date().getTime().toString() + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              productImage: doc.productImage ?? '',
              request: {
                type: 'GET',
                url: 'http://localhost:5000/products/' + doc._id
              }
            }
          })
        }
        res.status(200).json(response)
      } else {
        res.status(404).json({
          error: 'Not Found'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file)

  const name = req.body.name
  const price = req.body.price

  console.log(name, price)
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: name,
    price: price,
    productImage: req.file.path
  })

  product
    .save()
    .then(result => {
      const response = {
        message: 'Created New Product',
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/products/' + result._id
          }
        }
      }

      console.log(response)
      res.status(201).json(response)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_PRODUCTS',
            url: 'http://localhost:5000/products/'
          }
        })
      } else {
        res.status(404).json({ error: 'Not Found' })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })

  res.status(200).json({
    message: 'Deleted product'
  })
})

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + id
        }
      })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
})

module.exports = router
