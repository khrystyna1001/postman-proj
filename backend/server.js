const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

//MongoDB Schema
const requestSchema = new mongoose.Schema({
  url: String,
  method: String,
  headers: Object,
  body: mongoose.Schema.Types.Mixed,
  response: mongoose.Schema.Types.Mixed,
  status: Number,
  timestamp: { type: Date, default: Date.now }
});

const RequestHistory = mongoose.model('RequestHistory', requestSchema);

const app = express();
let server;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//MongoDB connection
mongoose.connect('mongodb://root:root@mongodb:27017/postman?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(`Failed to connect to MongoDB: ${error}`);
})

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

app.get('/history', async (req, res) => {
  try {
    const history = await RequestHistory.find().sort({ timestamp: -1 }).limit(25);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

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
