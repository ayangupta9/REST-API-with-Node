const express = require('express')
const router = express.Router()
const mmongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json({
          count: orders.length,
          orders: orders.map(order => {
            return {
              _id: order._id,
              product: order.product,
              quantity: order.quantity,
              request: {
                type: 'GET',
                url: 'http://localhost:5000/orders/' + order._id
              }
            }
          })
        })
      } else {
        res.status(404).json({ error: 'Not Orders Present' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
})

router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        res.status(404).json({
          message: 'Order Not found'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          description: 'GET_ALL_ORDERS',
          url: 'http://localhost:5000/orders/'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Product Not Found'
        })
      }

      const order = new Order({
        _id: mmongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      })

      return order.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:5000/orders/' + result._id
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router
