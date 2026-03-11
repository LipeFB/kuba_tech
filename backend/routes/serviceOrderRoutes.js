const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/', async (req, res) => {
    const { customer_cpf, device_serial, technician, opening_date } = req.body;
    try {
        await db.query('INSERT INTO service_orders (customer_cpf, device_serial, technician, opening_date) VALUES (?, ?, ?, ?)', 
        [customer_cpf, device_serial, technician, opening_date]);
        res.status(201).json({ message: 'O.S. criada!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM service_orders');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { technician, status } = req.body;
    try {
        await db.query('UPDATE service_orders SET technician=?, status=? WHERE id=?', [technician, status, req.params.id]);
        res.json({ message: 'O.S. atualizada!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM service_orders WHERE id=?', [req.params.id]);
        res.json({ message: 'O.S. deletada!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;