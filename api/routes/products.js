const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Product = require('../models/product')

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        res.status(200).json(docs)
      } else {
        res.status(400).json({
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

router.post('/', (req, res, next) => {
  const name = req.body.name
  const price = req.body.price

  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: name,
    price: price
  })

  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json(result)
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
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc)
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
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
})

module.exports = router
