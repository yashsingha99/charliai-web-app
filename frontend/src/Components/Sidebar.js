import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sidebar.css";
import { useModal } from "../Models/ModalContext";
const Sidebar = ({ selectedChatId, setSelectedChatId, onNewChat }) => {
  const { openModal } = useModal();
  const [history, setHistory] = useState([]);
  

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getCharacters");
        console.log("Fetched chats:", res.data);
        
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch chats");
      }
    };
    fetchChats();
  }, []);

  // const handleCreateCharacter = async (characterData) => {
  //   try {
  //     await axios.post(
  //       "http://localhost:5000/api/createCharacter",
  //       characterData
  //     );
  //     setHistory([...history, characterData]);
  //   } catch (err) {
  //     console.error("Failed to create character");
  //   }
  // };

  


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🗂️ Chats</h2>
        <button
          className="new-chat"
          onClick={() => openModal()}
        >
          + New Chat
        </button>
      </div>
      <div className="chat-history">
        {history.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${
              chat._id === selectedChatId ? "active" : ""
            }`}
            onClick={() => setSelectedChatId(chat._id)}
          >
            {chat.name || "Untitled Chat"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
