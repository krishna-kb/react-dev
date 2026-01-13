import React, { useEffect, useRef } from "react";
import type { Theme } from "../types";
import Message from "./Message";

interface MessageData {
  id: number;
  text: string;
  sender: string;
}

interface ChatWindowProps {
  messages: MessageData[];
  selfSenderId: string;
  theme: Theme;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  selfSenderId,
  theme,
}) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      id="chat-window"
      ref={chatWindowRef}
      style={{
        backgroundColor: theme === "light" ? "white" : "black",
        color: theme === "light" ? "black" : "white",
      }}
    >
      {messages.map((msg) => (
        <Message
          key={msg.id}
          text={msg.text}
          isSelf={msg.sender === selfSenderId}
        />
      ))}
    </div>
  );
};

export default ChatWindow;
