const express = require('express');
const fileRoutes = require('./routes/files');
const adminRoutes = require('./routes/admin');
const searchRoutes = require('./routes/search');

const app = express();

app.use(express.json());
app.use('/files', fileRoutes);
app.use('/admin', adminRoutes);
app.use('/search', searchRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
