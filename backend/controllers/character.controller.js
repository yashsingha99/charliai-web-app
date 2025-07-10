const Character = require('../models/character');

// Create a new character
exports.createCharacter = async (req, res) => {
  
  try {
    const { name, about = "", file = ""} = req.body;
    if(!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newCharacter = new Character({ name, about, file });
    await newCharacter.save();
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating character', error });
  }
}

// Get all characters
exports.getCharacters = async (req, res) => {
  try {
    const characters = await Character.find().select('name _id');
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
