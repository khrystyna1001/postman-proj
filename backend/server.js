const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to your Postman backend!');
});

app.all('/proxy', async (req, res) => {
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
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || error.message }); // Send JSON error
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
