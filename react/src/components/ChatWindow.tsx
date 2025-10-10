import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface MessageData {
    text: string;
    sender: 'user' | 'ai';
}

interface ChatWindowProps {
    messages: MessageData[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
                <Message key={index} text={msg.text} sender={msg.sender} />
            ))}
        </div>
    );
};

export default ChatWindow;
