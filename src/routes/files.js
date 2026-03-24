const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/download', (req, res) => {
  const requestedPath = req.query.path || 'hello.txt';
  const targetPath = path.join(process.cwd(), 'storage', requestedPath);

  res.sendFile(targetPath);
});

module.exports = router;
