const db = require('../config/database');

exports.createDevice = (req, res) => {
    const { customer_id, type, brand, model, serial_number } = req.body;

    if (!customer_id || !type || !brand || !model) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const sql = `
        INSERT INTO devices (customer_id, type, brand, model, serial_number)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [customer_id, type, brand, model, serial_number], (error) => {
        if (error) return res.status(500).json(error);

        res.status(201).json({ message: 'Device created successfully.' });
    });
};

exports.getAllDevices = (req, res) => {
    const sql = `
        SELECT devices.*, customers.name AS customer_name
        FROM devices
        JOIN customers ON devices.customer_id = customers.id
    `;

    db.query(sql, (error, results) => {
        if (error) return res.status(500).json(error);

        res.json(results);
    });
};

exports.updateDevice = (req, res) => {
    const { id } = req.params;
    const { type, brand, model, serial_number } = req.body;

    const sql = `
        UPDATE devices
        SET type=?, brand=?, model=?, serial_number=?
        WHERE id=?
    `;

    db.query(sql, [type, brand, model, serial_number, id], (error) => {
        if (error) return res.status(500).json(error);

        res.json({ message: 'Device updated successfully.' });
    });
};

exports.deleteDevice = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM devices WHERE id=?', [id], (error) => {
        if (error) return res.status(500).json(error);

        res.json({ message: 'Device deleted successfully.' });
    });
};