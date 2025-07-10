// components/GlobalModal.jsx
import React from "react";
import { useModal } from "./ModalContext";
import "./GlobalModal.css";
import axios from "axios";

export default function GlobalModal() {
  const {isOpen, setIsOpen, closeModal, openModal} = useModal(false);
  const [character, setCharacter] = React.useState({
    name: "",
    about: "",
    file: "",
  });
  if (!isOpen) return null;
  const handler = async () => {
    try {
      console.log(character);
      const res = await axios.post(
        "http://localhost:5000/api/createCharacter",
        character
      );
      console.log(res)
      
      closeModal();
    } catch (err) {
      console.error("Failed to create character");
    }
  };
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          ✕
        </button>
        <div>
          <h2>Contact Us</h2>
          <form>
            <input
              type="text"
              placeholder="Your Name"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="about"
              value={character.about}
              onChange={(e) => setCharacter({ ...character, about: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handler();
              }}
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
