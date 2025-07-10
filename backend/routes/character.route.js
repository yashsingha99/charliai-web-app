const express = require('express');
const { createCharacter, getCharacters, getCharacterById } = require('../controllers/character.controller');

const router = express.Router();

router.post('/createCharacter', createCharacter );
router.get('/getCharacters', getCharacters);
router.get('/getCharacters/:id', getCharacterById);
module.exports = router;
