import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatInterface.css";

const ChatInterface = ({ selectedChatId, isSidebarCollapsed }) => {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [qaHistory, loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      if (!selectedChatId) return;
      try {
        const res = await axios.get("http://localhost:5000/api/previousById", {
          params: { id: selectedChatId },
        });
        setQaHistory(res.data);
      } catch (err) {
        setError("Error fetching history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, [selectedChatId]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return setError("Please enter a question.");
    if (!selectedChatId) return setError("Please select a character.");

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
      setError(err?.response?.data?.message || "An error occurred.");
    }
    setGenerating(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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

  return (
    <div className={`chat-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {error && <div className="error-message">{error}</div>}

      <div className="chat-box" ref={chatBoxRef}>
        {qaHistory.length === 0 ? (
          <div className="no-history">No history yet. Start chatting!</div>
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

      <div className="chat-input-wrapper">
        <div className="chat-input">
          <textarea
            className="textarea"
            rows={1}
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
          />
          <button onClick={handleAskQuestion}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
