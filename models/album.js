const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    title: String,
    artist: String,
    year: Number,
    dateAdded: { type: Date, default: Date.now },
    thumb: String,
  });
  
  const Album = mongoose.model('Album', albumSchema);

  module.exports = Album;