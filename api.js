const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post("/api/upload/library", (req, res) => {
  console.log(req.body);
  res.json({ message: "upload testing successful" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


