const messageBox = document.getElementById('MessageDiv');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('MessageInput');
const sendButton = document.getElementById('SendButton');
const usernameInput = document.getElementById('UsernameInput');
const markOnlineButton = document.getElementById('markOnline');
const onlineUsersList = document.getElementById('OnlineUsersList');

const socket = io();

let listOfOnlineUsers = [];
let username;
let online = false;

function sendMessage(sender, message) {
    if (!online && sender === username) return;
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
    if (!online) return;
    const sender = username;
    const message = messageInput.value.trim();
    if (!message) return;
    socket.emit('chat message', { sender, message });
    messageInput.value = '';
});

markOnlineButton.addEventListener('click', () => {
    username = usernameInput.value.trim() || 'Anonymous';
    online = true;
    markOnlineButton.disabled = true;
    usernameInput.disabled = true;
    usernameInput.style.color = 'white';
    usernameInput.style.fontStyle = 'italic';
    socket.emit('mark online', { username });
    console.log("mark online event emitted for username: " + username);
    alert(`You are now online as "${username}". You can start sending messages!`);
});

// Add online users on load
socket.on('online users', (users) => {
    users.forEach(u => {
        if (!listOfOnlineUsers.includes(u)) {
            const onlineStatus = document.createElement('li');
            onlineStatus.textContent = u;
            onlineStatus.className = 'OnlineUser';
            onlineStatus.style.fontStyle = 'italic';
            onlineUsersList.appendChild(onlineStatus);
            listOfOnlineUsers.push(u);
        }
    });
});

socket.on('chat message', (data) => {
    sendMessage(data.sender, data.message);
});

socket.on('mark online', (data) => {
    if (!listOfOnlineUsers.includes(data.username)) {
        const onlineStatus = document.createElement('li');
        onlineStatus.textContent = data.username;
        onlineStatus.className = 'OnlineUser';
        onlineStatus.style.fontStyle = 'italic';
        onlineUsersList.appendChild(onlineStatus);
        listOfOnlineUsers.push(data.username);
    }
    console.log("mark online event received for username: " + data.username);
});

socket.on('user disconnected', (data) => {
    const index = listOfOnlineUsers.indexOf(data.username);
    if (index !== -1) {
        listOfOnlineUsers.splice(index, 1);
        const items = onlineUsersList.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            if (items[i].textContent === data.username) {
                onlineUsersList.removeChild(items[i]);
                break;
            }
        }
    }
    console.log("User disconnected:", data.username);
});
