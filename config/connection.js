const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(["1.1.1.1", "1.0.0.1"])

const uri = "mongodb+srv://Aimaweb:aima123@cluster0.4prqwer.mongodb.net/";


async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas with Mongoose");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;