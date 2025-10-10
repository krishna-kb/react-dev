const chatWindow = document.getElementById('chat-window')!;
const chatForm = document.getElementById('chat-form')!;
const messageInput = document.getElementById('message-input') as HTMLInputElement;

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    messageInput.value = '';

    try {
        const response = await fetch('http://localhost:3003/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();
        appendMessage(data.message, 'ai');
    } catch (error) {
        console.error('Error fetching AI response:', error);
        appendMessage('Sorry, something went wrong.', 'ai');
    }
});

function appendMessage(text: string, sender: 'user' | 'ai') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    const span = document.createElement('span');
    span.textContent = text;
    messageElement.appendChild(span);

    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
