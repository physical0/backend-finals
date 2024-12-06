const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require('./models/User');

const Album = require("./models/album");


dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

mongoose.connect(`mongodb://127.0.0.1:27017/musica`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post("/api/upload/library", async (req, res) => {
  console.log(req.body);

  try {
    const newAlbum = new Album(req.body);

    if (newAlbum) {
      const savedAlbum = await newAlbum.save();
      res.status(201).json({ message: "Upload successful", album: newAlbum });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/api/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const newUser = new User({ username, email, password });
  await newUser.save();
  
  res.status(201).json({ message: 'User registered successfully' });
});