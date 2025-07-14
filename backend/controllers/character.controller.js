const Character = require('../models/character');
const Session = require('../models/session');

// Create a new character
exports.createCharacter = async (req, res) => {
  
  try {
     const {sessionId, name, about = "", file = ""} = req.body;

     if(!name || !sessionId) {
       return res.status(400).json({ message: 'data is required' });
     }
 
    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(400).json({message: "restricted"})
    }
    const newCharacter = new Character({ name, about, file, sessionUser : session._id });
    await newCharacter.save();
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating character', error });
  }
}
 
exports.getCharacters = async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(400).json({message: "restricted"})
    }
    const characters = await Character.find({sessionUser : session._id}).select('name _id');
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching characters', error });
  }
}

// Get a character by ID
exports.getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).select('name _id');
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching character', error });
  }
};
