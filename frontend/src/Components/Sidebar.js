import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, Plus, ArrowLeftCircle } from "lucide-react";
import { useModal } from "../Models/ModalContext";
import "./Sidebar.css";
const URI = process.env.REACT_APP_URL 
// || "http://localhost:8080"
|| "https://chatbot-production-e7f9.up.railway.app" 

// "https://chatbot-6upq.onrender.com"
// console.log(URI);

const Sidebar = ({ selectedChatId, setSelectedChatId }) => {
  const { openModal } = useModal();
  const [history, setHistory] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const sessionId = localStorage.getItem("sessionId")
      if(!sessionId) {
        console.log("session is expired");
        return ;
      }
      try {
        const res = await axios.get(`${URI}/api/getCharacters?sessionId=${sessionId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch chats");
      }
    };
    fetchChats();
  }, []);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <>
      {/* Toggle button — always visible */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <Menu size={22} /> : <ArrowLeftCircle size={22} />}
      </button>

      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2>🗂️ Chats</h2>
          <button className="new-chat" onClick={openModal}>
            <Plus size={16} /> <span className="new-chat-label">New</span>
          </button>
        </div>

        <div className="chat-history">
          {history.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${chat._id === selectedChatId ? "active" : ""}`}
              onClick={() => setSelectedChatId(chat._id)}
              title={chat.name}
            >
              {isCollapsed ? chat.name.charAt(0).toUpperCase() : chat.name || "Untitled"}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
