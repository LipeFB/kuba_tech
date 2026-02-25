const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceOrderController');

router.post('/', controller.createServiceOrder);
router.get('/', controller.getAllServiceOrders);
router.put('/:id', controller.updateServiceOrder);
router.delete('/:id', controller.deleteServiceOrder);

module.exports = router;