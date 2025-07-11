import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import ChatInterface from "./Components/ChatInterface";
import "./App.css"
export default function App() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <ChatInterface
        selectedChatId={selectedChatId}
        isSidebarCollapsed={isSidebarCollapsed} // <- passed here
      />
    </div>
  );
}
