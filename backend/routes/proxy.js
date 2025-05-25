const express = require('express');
const axios = require('axios');
const RequestHistory = require('../models/request');
const connection = require('../database');

const router = express.Router();

connection;

router.all('/proxy', async (req, res) => {
  console.log('Received proxy request:', req.body);
  const { url, method, headers, body } = req.body;

  try {
    new URL(url); // Validate URL
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL' }); // Send JSON error
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

module.exports = router;