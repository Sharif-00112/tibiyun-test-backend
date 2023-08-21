const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3010;

app.get('/', (req, res) => {
  res.send('Hello Tibiyun! Wish me luck!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})