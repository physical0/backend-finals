const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    id: Number,
    title: String,
    year: Number,
    dateAdded: { type: Date, default: Date.now },
    thumb: String,
    inLibrary: Boolean
  });
  
  const Album = mongoose.model('Album', albumSchema);

  module.exports = Album;