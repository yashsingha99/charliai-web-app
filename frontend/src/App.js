import React from "react";
import ChatInterface from "./Components/ChatInterface";
import Sidebar from "./Components/Sidebar";
import "./App.css"; // Assuming you have some global styles
const App = () => {
  const [selectedChatId, setSelectedChatId] = React.useState("");
  console.log(selectedChatId);
  
  return (
    <div className="flex">
      <Sidebar
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <div className="w-full p-4">
        <ChatInterface selectedChatId={selectedChatId} />
      </div>
    </div>
  );
};

export default App;
