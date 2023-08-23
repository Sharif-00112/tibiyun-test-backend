const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const WebSocket = require('ws');
require('dotenv').config();
const port = process.env.PORT || 3010;

const app = express();

// Initialize WebSocket server:
// const wss = new WebSocket.Server({ server });
// const wss = new WebSocket.Server({ server, port: 3031 });
const httpServer = app.listen(3020, () => {
  console.log(`WebSocket server app listening on port 3020`);
});
const wss = new WebSocket.Server({ server: httpServer });


// Middleware
app.use(cors());
app.use(express.json());

// Database connection info
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mz96imw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    console.log('Database Connected');

    // DB connection
    const database = client.db("tibiyun_DB");
    // const tibiyunTestCollection = database.collection("test");
    const userCollection = database.collection("users");
    const searchResultsCollection = database.collection("searchResults");

    //CRUD API(s)

    // POST an user to database (custom sign in)
    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      // console.log(result);
      res.json(result);
    })

    // UPSERT an user to database (check if exists; then replace or add)
    app.put('/users', async(req, res) => {
      const user = req.body;
      // console.log('put', user);
      // check if the user exists
      const filter = { email: user.email };
      // create if does not match
      const options = { upsert : true };
      const updateDoc = {$set: user};
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // console.log(result);
      res.json(result);
    })
      
    // GET a single user by email API and check ADMIN
    app.get('/users/:email', async(req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })
      
    // POST an search result to database 
    // app.post('/searchResults', async (req, res) => {
    //   const searchResult = req.body;
    //   const result = await searchResultsCollection.insertOne(searchResult);
    //   // console.log(result);
    //   res.json(result);
    // })   
    
    //GET search result API (all)
    app.get('/searchResults', async(req, res) => {
      const cursor = searchResultsCollection.find({});
      const result = await cursor.toArray();
      // res.send(result);
      res.json(result);
    })

    //GET search result API by email(single)
    app.get('/selfSearchResults', async(req, res) => {
      const email = req.query.email;
      const query = {userEmail: email};
      const cursor = searchResultsCollection.find(query);
      const result = await cursor.toArray();
      // res.send(result);
      res.json(result);
    })

    // WebSocket server logic: 
    wss.on('connection', (socket) => {
      console.log('Client connected to WebSocket server');

      socket.on('close', () => {
        console.log('Client disconnected from WebSocket server');
      });
    });

    // POST a search result to database
    app.post('/searchResults', async (req, res) => {
      const searchResult = req.body;
      const result = await searchResultsCollection.insertOne(searchResult);

      // Send notification to connected clients (admins): 
      wss.clients.forEach((client) => {
        // Check if client is an admin (you need to have a method to identify admins)
        if (client.isAdmin) {
          client.send(JSON.stringify({ type: 'new_entry', searchResult }));
        }
      });

      res.json(result);
    });

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