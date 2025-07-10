import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatInterface.css";

const ChatInterface = ({ selectedChatId }) => {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  console.log("selectedChatId", selectedChatId);
  
  const chatBoxRef = useRef(null);

  // Scroll to bottom on new message or loading
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [qaHistory, loading]);

  // Fetch previous chat history
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      if (!selectedChatId) return;
      try {
        const res = await axios.get("http://localhost:5000/api/previousById", {
          params: {
            id: selectedChatId
          }
        });
        setQaHistory(res.data);
      } catch (err) {
        setError("Error fetching history");
      }
      setLoading(false)
    };
    fetchHistory();
  }, [selectedChatId]);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question before asking.");
      return;
    }
    if (!selectedChatId) {
      setError("Please select a character to chat with.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        question,
        id: selectedChatId,
      });

      setQaHistory((prev) => [...prev, { question, answer: res.data.answer }]);
      setQuestion("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "An error occurred while asking the question."
      );
    }
    setGenerating(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleAskQuestion();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setQuestion((prev) => prev + "\n");
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length > 500) {
      setError("Question cannot exceed 500 characters.");
      return;
    }
    setQuestion(e.target.value);
  };

  if(loading){
    return (
      <div> 
        Loading....
      </div>
    )
  }

  return (
    <div className="chat-container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {error && <div className="error-message">{error}</div>}

      {/* CHAT MESSAGES */}
      <div className="chat-box" ref={chatBoxRef} style={{ flex: 1, overflowY: "auto" }}>
        {qaHistory.length === 0 ? (
          <div style={{ color: "#555", textAlign: "center", marginTop: "30px" }}>
            No history yet. Start a conversation.
          </div>
        ) : (
          qaHistory.map((qa, index) => (
            <div key={index} className="chat-message">
              <div className="user-message">🧑‍💻 {qa.question}</div>
              <div className="ai-message">🤖 {qa.answer}</div>
            </div>
          ))
        )}
        {generating && <div className="loading">Generating response...</div>}
      </div>

      {/* INPUT AREA */}
      <div className="chat-input-wrapper">
        <div className="chat-input">
          <textarea
          className="textarea"
            rows={1}
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
            style={{ resize: "none", minHeight: "40px", maxHeight: "100px" }}
          />
          <button onClick={handleAskQuestion}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
