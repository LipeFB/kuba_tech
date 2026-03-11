const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Criar
router.post('/', async (req, res) => {
    const { cpf, name, phone, email } = req.body;
    try {
        await db.query('INSERT INTO customers (cpf, name, phone, email) VALUES (?, ?, ?, ?)', [cpf, name, phone, email]);
        res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar todos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customers');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar
router.put('/:cpf', async (req, res) => {
    const { name, phone, email } = req.body;
    try {
        await db.query('UPDATE customers SET name=?, phone=?, email=? WHERE cpf=?', [name, phone, email, req.params.cpf]);
        res.json({ message: 'Cliente atualizado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar
router.delete('/:cpf', async (req, res) => {
    try {
        await db.query('DELETE FROM customers WHERE cpf=?', [req.params.cpf]);
        res.json({ message: 'Cliente deletado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;