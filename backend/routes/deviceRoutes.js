const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/', async (req, res) => {
    const { serial_number, customer_cpf, type } = req.body;
    try {
        await db.query('INSERT INTO devices (serial_number, customer_cpf, type) VALUES (?, ?, ?)', [serial_number, customer_cpf, type]);
        res.status(201).json({ message: 'Dispositivo cadastrado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM devices');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:serial', async (req, res) => {
    const { customer_cpf, type } = req.body;
    try {
        await db.query('UPDATE devices SET customer_cpf=?, type=? WHERE serial_number=?', [customer_cpf, type, req.params.serial]);
        res.json({ message: 'Dispositivo atualizado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:serial', async (req, res) => {
    try {
        await db.query('DELETE FROM devices WHERE serial_number=?', [req.params.serial]);
        res.json({ message: 'Dispositivo deletado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;