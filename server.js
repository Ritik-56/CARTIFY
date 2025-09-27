const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/cartify", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ DB Error:", err));

// ✅ Schema
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  category: String,
  quantity: {type: Number,default: 1}
});
const Product = mongoose.model("Product", productSchema);

// ✅ Add product
app.post("/cart", async (req, res) => {
  try {
    const { title, price, image, category } = req.body;

    // Check if product already exists
    const existing = await Product.findOne({ title });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json({ message: "Quantity increased", product: existing });
    }

    const product = new Product({ title, price, image, category });
    await product.save();
    res.json({ message: "Product added", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// ✅ Get all products
app.get("/cart", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

// ✅ Delete product by ID
app.delete("/cart/:id", async (req, res) => {
  try {
    console.log("🛑 Deleting product with ID:", req.params.id); // 👈 log incoming ID

    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "🗑️ Product removed", deleted });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to remove product" });
  }
});
app.patch("/cart/:id/quantity", async (req, res) => {
  try {
    const { change } = req.body; // +1 or -1
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.quantity += change;
    if (product.quantity < 1) {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: "Product removed" });
    }

    await product.save();
    res.json({ message: "Quantity updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update quantity" });
  }
});
