// import dotenv from "dotenv"
// dotenv.config();
import React, { useEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import ChatInterface from "./Components/ChatInterface";
import "./App.css";
// import { v4 as uuidv4 } from "uuid";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
const URI = process.env.REACT_APP_URL ||
// || "http://localhost:8080"
"https://chatbot-production-e7f9.up.railway.app" 

export async function getOrCreateSession() {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;
    //  console.log(fingerprint);

    const response = await axios.post(`${URI}/api/session`, {
      fingerprint,
    });

    // const data = await response.json();
    console.log("User Session:", response);
    if (response.status === 200) {
      localStorage.setItem("fp_id", fingerprint);
      localStorage.setItem("sessionId", response.data.sessionId);
    }
  } catch (error) {
    console.log("creating error", error);
  }
}

export default function App() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setIsloading] = useState(false);
  const session = localStorage.getItem("fp_id");

  useEffect(() => {
    async function create() {
      if (!session) {
        try {
          setIsloading(true);
          await getOrCreateSession();
        } catch (error) {
          console.log(error);
        }
        setIsloading(false);
      }
    }
    create();
  }, [session]);

  if (loading) {
    return <> Loading... </>;
  }

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
