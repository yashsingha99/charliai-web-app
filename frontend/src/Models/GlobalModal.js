import React from "react";
import { useModal } from "./ModalContext";
import "./GlobalModal.css";
import axios from "axios";
import { X, UserCircle } from "lucide-react"; // lucide icons
const URI = process.env.REACT_APP_URL || "https://chatbot-production-e7f9.up.railway.app" 
// "https://chatbot-6upq.onrender.com"
export default function GlobalModal() {
  const { isOpen, closeModal } = useModal(false);
  const [character, setCharacter] = React.useState({
    name: "",
    about: "",
    file: "",
  });

  if (!isOpen) return null;

  const handler = async () => {
    try {
      const res = await axios.post(
        `${URI}/api/createCharacter`,
        character
      );
      console.log("Created:", res.data);
      closeModal();
    } catch (err) {
      console.error("Failed to create character", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          <X size={20} />
        </button>

        <h2>
          <UserCircle size={22} /> Create Your Character
        </h2>

        <form>
          <input
            type="text"
            placeholder="Character Name"
            value={character.name}
            onChange={(e) => setCharacter({ ...character, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="About Character"
            value={character.about}
            onChange={(e) => setCharacter({ ...character, about: e.target.value })}
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handler();
            }}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
