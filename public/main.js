const messageBox = document.getElementById('MessageDiv');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('MessageInput');
const sendButton = document.getElementById('SendButton');
const usernameInput = document.getElementById('UsernameInput');

const socket = io();

function sendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  const nameElement = document.createElement('p');
  nameElement.className = 'Name';
  nameElement.textContent = sender;
  const messageContentElement = document.createElement('p');
  messageContentElement.className = 'Message';
  messageContentElement.textContent = message;
  messageElement.appendChild(nameElement);
  messageElement.appendChild(messageContentElement);
  messages.appendChild(messageElement);

  messageBox.scrollTop = messageBox.scrollHeight;
}

sendButton.addEventListener('click', () => {
    var sender = usernameInput.value.trim() || 'Anonymous';
    var message = messageInput.value.trim();
    if (!message) return;
    socket.emit('chat message', { sender, message });
    messageInput.value = '';
});

socket.on('chat message', (data) => {
  sendMessage(data.sender, data.message);
});
