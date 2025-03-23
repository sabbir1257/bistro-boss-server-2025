
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

// Validate required environment variables
if (!process.env.DB_USER || !process.env.DB_PASS) {
  console.error("Error: DB_USER or DB_PASS environment variable is missing.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5v9zz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// MongoClient configuration (🔥 Removed unsupported options)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    // Database & Collections
    const db = client.db("bistroDb");
    const menuCollection = db.collection("menu");
    const reviewCollection = db.collection("reviews");
    const cartCollection = db.collection("carts");

    // ✅ API Routes

    // Get all menu items
    app.get("/menu", async (req, res) => {
      try {
        const menu = await menuCollection.find().toArray();
        res.status(200).json(menu);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch menu" });
      }
    });

    // Get all reviews
    app.get("/reviews", async (req, res) => {
      try {
        const reviews = await reviewCollection.find().toArray();
        res.status(200).json(reviews);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews" });
      }
    });

    // Get user's cart items
    app.get("/carts", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const carts = await cartCollection.find({ email }).toArray();
        res.status(200).json(carts);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch carts" });
      }
    });

    // Add a cart item
    app.post("/carts", async (req, res) => {
      try {
        const cartItem = req.body;
        if (!cartItem) return res.status(400).json({ error: "Cart item is required" });

        const result = await cartCollection.insertOne(cartItem);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to add cart item" });
      }
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Start MongoDB connection & server
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
