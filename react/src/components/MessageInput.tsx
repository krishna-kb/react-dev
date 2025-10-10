import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = inputValue.trim();
        if (message) {
            onSendMessage(message);
            setInputValue('');
        }
    };

    return (
        <form id="chat-form" onSubmit={handleSubmit}>
            <input
                type="text"
                id="message-input"
                placeholder="Type your message..."
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageInput;
