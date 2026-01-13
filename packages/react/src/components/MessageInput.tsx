import React, { useState } from "react";
import type { Theme } from "../types";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  theme: Theme;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  theme,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (message) {
      onSendMessage(message);
      setInputValue("");
    }
  };

  return (
    <form
      id="chat-form"
      onSubmit={handleSubmit}
      style={{
        backgroundColor: theme === "light" ? "white" : "black",
        color: theme === "light" ? "black" : "white",
      }}
    >
      <input
        type="text"
        id="message-input"
        placeholder="Type your message..."
        autoComplete="off"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
        style={{
          backgroundColor: theme === "light" ? "white" : "black",
          color: theme === "light" ? "black" : "white",
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
