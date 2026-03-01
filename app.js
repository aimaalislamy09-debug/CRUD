const express = require("express");
const connectDB = require("./config/connection");
const productRoutes = require("./routes/index");
const errorHandler = require("./middleware/index");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/products", productRoutes);

// error handler harus paling bawah
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});