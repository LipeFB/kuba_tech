const db = require('../config/database');

exports.createServiceOrder = (req, res) => {
    const { device_id, problem_description, status, price, entry_date, exit_date } = req.body;

    if (!device_id || !problem_description || !entry_date) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const sql = `
        INSERT INTO service_orders 
        (device_id, problem_description, status, price, entry_date, exit_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [device_id, problem_description, status, price, entry_date, exit_date], (error) => {
        if (error) return res.status(500).json(error);

        res.status(201).json({ message: 'Service order created successfully.' });
    });
};

exports.getAllServiceOrders = (req, res) => {
    const sql = `
        SELECT 
            service_orders.*,
            devices.type,
            devices.brand,
            devices.model,
            customers.name AS customer_name
        FROM service_orders
        JOIN devices ON service_orders.device_id = devices.id
        JOIN customers ON devices.customer_id = customers.id
    `;

    db.query(sql, (error, results) => {
        if (error) return res.status(500).json(error);

        res.json(results);
    });
};

exports.updateServiceOrder = (req, res) => {
    const { id } = req.params;
    const { status, price, exit_date } = req.body;

    const sql = `
        UPDATE service_orders
        SET status=?, price=?, exit_date=?
        WHERE id=?
    `;

    db.query(sql, [status, price, exit_date, id], (error) => {
        if (error) return res.status(500).json(error);

        res.json({ message: 'Service order updated successfully.' });
    });
};

exports.deleteServiceOrder = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM service_orders WHERE id=?', [id], (error) => {
        if (error) return res.status(500).json(error);

        res.json({ message: 'Service order deleted successfully.' });
    });
};