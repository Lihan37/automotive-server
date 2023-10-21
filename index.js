const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g9xsrko.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const carsCollection = client.db('carsDB').collection('cars');
    const cartCollection = client.db('carsDB').collection('cart');

    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await carsCollection.findOne(query)
      console.log(result);
      res.send(result);
    })



    app.get('/cars', async (req, res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/cars', async (req, res) => {
      const newCar = req.body;
      console.log(newCar);
      const result = await carsCollection.insertOne(newCar);
      res.send(result);
    })

    app.get('/addToCart', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/addToCart', async (req, res) => {
      
        const carDetails = req.body;
        console.log(carDetails);
        const result = await cartCollection.insertOne(carDetails);
        res.send(result);
      
      
    });

    // ...




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('automotive server is running')
})

app.listen(port, () => {
  console.log(`automotive server is running on port : ${port}`)
})