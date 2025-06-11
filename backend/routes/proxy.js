const express = require('express');
const axios = require('axios');
const RequestHistory = require('../models/request');
const connection = require('../database');

const router = express.Router();

connection;

router.all('/', async (req, res) => {
  console.log('Received proxy request:', req.body);
  
  // Validate required fields
  if (!req.body || !req.body.url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  const { url, method = 'GET', headers = {}, body } = req.body;

  try {
    // Validate URL
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: `Invalid URL: ${url}` });
  }

  try {
    const response = await axios({
      url,
      method,
      headers,
      data: body,
      validateStatus: () => true,
    });
    const requestRecord = new RequestHistory({
      url,
      method,
      headers,
      body,
      response: response.data,
      status: response.status,
    });
    const savedRecord = await requestRecord.save();
    console.log('Request saved successfully');
    res.status(response.status).send(response.data);
    return savedRecord;
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || error.message }); // Send JSON error
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await RequestHistory.find().sort({ timestamp: -1 }).limit(25);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/history/:id', async (req, res) => {
  try {
    const history = await RequestHistory.findById(req.params.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;