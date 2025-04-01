const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
let server;

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

function startServer(port) {
  server = app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
  });
  return server;
}

function stopServer() {
  if (server) {
    server.close();
  }
}

if (require.main === module) {
  const defaultPort = process.env.PORT || 3000;
  startServer(defaultPort);
}

module.exports = { app, startServer, stopServer };
