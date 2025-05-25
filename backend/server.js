const express = require('express');
const cors = require('cors');
const connection = require('./database');
const proxyRouter = require('./routes/proxy');

const app = express();
let server;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

connection;

app.use('/api', proxyRouter);

app.get('/', (req, res) => {
  res.send('Welcome to your Postman backend!');
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

function startServer(port) {
  server = app.listen(port, '0.0.0.0', () => {
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
