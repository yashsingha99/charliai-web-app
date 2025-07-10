# ChatBot Documentation

## Overview
The ChatBot enables users to ask questions to their favourite Character and Responses mimic the character's personality. It also maintains a history of past questions and answers for reference.

## System Design

### Components:

**Frontend (React.js):**
- Provides a chat-like interface for user interaction.
- Allows enter character and chat.
- Displays conversation history dynamically.

**Backend (Node.js + Express.js):**
- Manages API endpoints question-answering, and retrieving history.
- Processes user queries and interacts with AI API.
- Stores document content and question-answer pairs in MongoDB.

**Database (MongoDB):**
- Maintains a collection of question-answer pairs.

**AI API (Claude3 - OpenAI via RapidAPI):**
- Generates answers based on the entered Character and asked question.

## API Endpoints

1. Ask a Question

**Endpoint: POST /api/chat**
- Description: Queries the AI API based on the character and returns an answer.
- Request:
```bash
{
  "character":"Spider Man",
  "question": "How are you doing?"
}
```
- Response:
```bash
{
  "answer": "Doing great, webhead! Just swinging around, saving the day, and cracking a few jokes along the way. You know, the usual Spider-Man routine. How about you, hot shot? Anything exciting happening in your neck of the woods?"
}
```
2. Get Previous Questions and Answers

**Endpoint: GET /api/previous**
- Description: Retrieves a history of past questions and answers.
- Response:
```bash
[
  {
    "question": "How are you doing?",
    "answer": "Doing great, webhead! Just swinging around, saving the day, and cracking a few jokes along the way. You know, the usual Spider-Man routine. How about you, hot shot? Anything exciting happening in your neck of the woods?"
  }
]
```