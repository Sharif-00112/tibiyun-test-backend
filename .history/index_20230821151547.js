const express = require('express')
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3010;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Tibiyun! Wish me luck! (Md Sharif Hossain)')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})