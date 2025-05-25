const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://root:root@mongodb:27017/postman?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(`Failed to connect to MongoDB: ${error}`);
})

module.exports = connection;