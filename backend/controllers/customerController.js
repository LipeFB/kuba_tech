const db = require('../config/database');

exports.createCustomer = (req, res) => {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required.' });
    }

    const sql = 'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)';
    db.query(sql, [name, phone, email], (error, result) => {
        if (error) return res.status(500).json(error);

        res.status(201).json({ message: 'Customer created successfully.' });
    });
};

exports.getAllCustomers = (req, res) => {
    db.query('SELECT * FROM customers', (error, results) => {
        if (error) return res.status(500).json(error);

        res.json(results);
    });
};

exports.updateCustomer = (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    const sql = 'UPDATE customers SET name=?, phone=?, email=? WHERE id=?';
    db.query(sql, [name, phone, email, id], (error) => {
        if (error) return res.status(500).json(error);

        res.json({ message: 'Customer updated successfully.' });
    });
};

exports.deleteCustomer = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM customers WHERE id=?', [id], (error) => {
        if (error) return res.status(500).json(error);

        res.json({ message: 'Customer deleted successfully.' });
    });
};