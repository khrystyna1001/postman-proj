const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.all('/proxy', async (req, res) => {
  const { url, method, headers, body } = req.body;
  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      validateStatus: () => true,
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || { error: error.message });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
