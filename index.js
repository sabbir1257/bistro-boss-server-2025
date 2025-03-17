const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing for requests

// MongoDB Connection URI
const uri = `mongodb+srv://bistro-boss:${process.env.DB_PASS}@cluster0.hb5w7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const db = client.db("bistroBoss"); // Use your database name
    const menuCollection = db.collection("menu"); // Example collection

    console.log("Connected to MongoDB successfully!");

    // Example API Endpoint to Get Menu Items
    app.get('/menu', async (req, res) => {
      try {
        const menuItems = await menuCollection.find().toArray();
        res.json(menuItems);
      } catch (error) {
        res.status(500).json({ message: "Error fetching menu", error });
      }
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});