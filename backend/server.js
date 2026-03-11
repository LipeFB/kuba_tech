const express = require('express');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const serviceOrderRoutes = require('./routes/serviceOrderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/service-orders', serviceOrderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});