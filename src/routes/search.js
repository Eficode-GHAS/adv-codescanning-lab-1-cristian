const express = require('express');

const router = express.Router();

router.get('/render', (req, res) => {
  const message = req.query.message || 'Welcome attendee';

  res.type('html').send(`
    <html>
      <body>
        <h1>Search Preview</h1>
        <div>${message}</div>
      </body>
    </html>
  `);
});

module.exports = router;
