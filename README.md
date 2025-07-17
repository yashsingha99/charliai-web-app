# ChatBot

## Overview
The ChatBot enables users to ask questions to their favourite Character and Responses mimic the character's personality. It also maintains a history of past questions and answers for reference.

### Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB
- AI API: OpenAI (Claude3 via RapidAPI)

### How to Initialize the Project

**Prerequisites**

Ensure you have the following installed:
- Node.js
- MongoDB 
- npm or yarn

**Setup Instructions**

1. Clone the Repository
```bash
git clone https://github.com/yashsingha99/ChatBot.git
```
2. Backend Setup

- Navigate to the backend directory:
```bash
cd backend
```
- Install dependencies:
```bash
npm install
```
- Configure environment variables (.env file):
```bash
MONGO_URI=your_mongodb_connection_string
```
- Start the backend server:
```bash
npm start
```
3. Frontend Setup

- Navigate to the frontend directory:
```bash
cd frontend
```
- Install dependencies:
```bash
npm install
```
- Start the frontend application:
```bash
npm start
```