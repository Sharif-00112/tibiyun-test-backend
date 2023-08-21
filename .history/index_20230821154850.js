const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 3010;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//database connection info
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mz96imw.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      console.log('Database Connected');
      
      // Test DB connection
    //   const testDatabase = client.db("test_DB");
    //   const testCollection1 = testDatabase.collection("test_1");
      
      // Real DB connection
      const database = client.db("tibiyun_DB");
      const tibiyunTestCollection = database.collection("test");
  
      //CRUD API(s)

  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Tibiyun! Wish me luck! (Md Sharif Hossain)')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})