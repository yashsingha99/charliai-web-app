const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  sessionUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true
  },
  
  about: {
    type: String,
  },
  file: {
    type: String,
  },
  overAllDetails: {
    type: String,
  },
});

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;
