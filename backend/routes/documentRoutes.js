const express = require('express');
const { askQuestion, getPreviousQAs, getPreviousQAsByCharacter, getPreviousQsByCharacter, getChatName, deleteChat,editChat } = require('../controllers/documentController');
const { createCharacter, getCharacters } = require('../controllers/character.controller');

const router = express.Router();

router.post('/chat', askQuestion);
router.get('/previous', getPreviousQAs);
router.get('/previousById', getPreviousQAsByCharacter);
router.get('/previousQuestions', getPreviousQsByCharacter);
router.post('/createCharacter', createCharacter );
router.get('/getCharacters', getCharacters);
router.get('/getChatName', getChatName);
router.delete('/deleteChat', deleteChat);
router.patch('/editChat', editChat);
module.exports = router;
