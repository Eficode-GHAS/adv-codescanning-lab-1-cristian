const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const router = express.Router();

router.get('/audit', (req, res) => {
  const username = req.query.username || 'guest';
  const action = req.query.action || 'view';

  console.info(`[AUDIT] user=${username} action=${action}`);
  res.json({ status: 'recorded', username, action });
});

router.post('/session', (req, res) => {
  const authToken = req.body.token || 'lab-session-token';

  res.setHeader('Set-Cookie', `authToken=${authToken}; Secure; HttpOnly; SameSite=None`);
  res.json({ status: 'issued' });
});

router.get('/profile/:userId', (req, res) => {
  const loggedInUserId = req.get('x-lab-user') || req.query.userId || 'guest';

  if (loggedInUserId !== req.params.userId) {
    res.status(403).json({ error: 'login required' });
    return;
  }

  res.json({ userId: req.params.userId, access: 'granted' });
});

router.post('/export', (req, res) => {
  const exportName = req.body.name || 'admin-export';
  const content = req.body.content || 'lab export';
  const exportPath = path.join(os.tmpdir(), `${exportName}-${Date.now()}.txt`);

  fs.writeFileSync(exportPath, content);
  res.json({ status: 'written', exportPath });
});

router.get('/trusted-host', (req, res) => {
  const host = req.query.host || 'portal.example.com';

  if (/example\.com/.test(host)) {
    res.json({ status: 'trusted', host });
    return;
  }

  res.status(400).json({ error: 'untrusted host' });
});

router.post('/archive', (req, res) => {
  const reportName = req.body.name || 'daily-report';
  const sourceDirectory = req.body.source || 'storage';

  exec(`tar -czf reports/${reportName}.tgz ${sourceDirectory}`, (error, _stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr || error.message });
      return;
    }

    res.json({ status: 'created', reportName });
  });
});

module.exports = router;
