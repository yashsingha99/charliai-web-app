import React from "react";
import { useModal } from "./ModalContext";
import axios from "axios";
import { UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const URI = import.meta.env.VITE_APP_URL  

export default function GlobalModal() {
  const { isOpen, closeModal } = useModal(false);
  const [character, setCharacter] = React.useState({
    name: "",
    about: "",
    file: "",
  });

  const handler = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        console.log("Session is expired");
        return;
      }
      const res = await axios.post(`${URI}/api/createCharacter`, {
        ...character,
        sessionId,
      });
      console.log("Created:", res.data);
      closeModal();
    } catch (err) {
      console.error("Failed to create character", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserCircle size={20} />
            Create Your Character
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handler();
          }}
          className="space-y-4"
        >
          <Input
            type="text"
            placeholder="Character Name"
            value={character.name}
            onChange={(e) =>
              setCharacter({ ...character, name: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="About Character"
            value={character.about}
            onChange={(e) =>
              setCharacter({ ...character, about: e.target.value })
            }
          />

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
