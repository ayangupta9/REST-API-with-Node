const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched'
  })
})
router.get('/:orderId', (req, res, next) => {
  const orderId = req.params.orderId
  res.status(200).json({
    message: `Order ${orderId} was fetched`,
    orderId: orderId
  })
})

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  }

  res.status(201).json({
    message: 'Order was created',
    order: order
  })
})

router.delete('/:orderId', (req, res, next) => {
  const orderId = req.params.orderId
  res.json({
    message: `Order ${orderId} deleted`
  })
})

// router.put('/', (req, res, next) => {
//   res.status(201).json({
//     message: 'Order was edited'
//   })
// })

// router.patch('/', (req, res, next) => {
//   res.status(201).json({
//     message: 'Order was edited'
//   })
// })

module.exports = router
