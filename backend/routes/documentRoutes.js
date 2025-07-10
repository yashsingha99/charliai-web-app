const express = require('express');
const { askQuestion, getPreviousQAs, getPreviousQAsByCharacter } = require('../controllers/documentController');
const { createCharacter, getCharacters } = require('../controllers/character.controller');

const router = express.Router();

router.post('/chat', askQuestion);
router.get('/previous', getPreviousQAs);
router.get('/previousById', getPreviousQAsByCharacter);
router.post('/createCharacter', createCharacter );
router.get('/getCharacters', getCharacters);
module.exports = router;
