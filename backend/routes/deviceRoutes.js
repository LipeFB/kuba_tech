const express = require('express');
const router = express.Router();
const controller = require('../controllers/deviceController');

router.post('/', controller.createDevice);
router.get('/', controller.getAllDevices);
router.put('/:id', controller.updateDevice);
router.delete('/:id', controller.deleteDevice);

module.exports = router;