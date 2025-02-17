let socket = null
let nickname = ""

// Felhasználónév beállítása
const setNickname = () => {
    const nicknameInput = document.getElementById("nickname-input")
    nickname = nicknameInput.value || `User${Math.floor(Math.random() * 1000)}`
    console.info(`Nickanme is set to: ${nickname}`)

    startWebsocket()
}

// WebSocket kapcsolat létrehozása
const startWebsocket = () => {
    const HOST = "localhost"
    const PORT = 6968
    socket = new WebSocket(`ws://${HOST}:${PORT}`);

    // WebSocket eseménykezelők
    socket.onopen = () => {
        console.log('Connected to:', HOST, PORT);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)

        if (data.type === "message") {
            uiShowMessage(data.sender, data.content)
        }
        if (data.type === "System") {
            if (data.content === "!NICKNAME") {
                socket.send(nickname)
            }
        }
        if (data.type === "user_list_update") {
            updateUserList(data.content)
        }
    };

    socket.onclose = () => {
        console.log('Kapcsolat megszakadt a WebSocket szerverrel');
    };
}

// Felhasználólista frissitése
function updateUserList(user_list) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    user_list.forEach(username => {
        const li = document.createElement('li');
        const a = document.createElement('a')

        a.text = username
        a.href = "#"
        li.appendChild(a)
        userList.appendChild(li);
    });
}

// Új üzenet hozzáadása
function uiShowMessage(sender, content) {
    const messageContainer = document.getElementById("chat-window");
    const message = document.createElement('div');

    message.className = `message mb-3 p-2 rounded${sender === "You" ? ' own-message' : ''}`;
    message.innerHTML = `<p class="m-0"><strong>${sender}:</strong> ${content}</p>`;

    messageContainer.appendChild(message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Üzenet küldése
const sendMessage = () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value

    const msg_to_json = {
        type: message.startsWith("/") ? "command" : "message", // ✅ Közvetlenül itt döntjük el
        sender: nickname,
        content: message
    };

    socket.send(JSON.stringify(msg_to_json));

    messageInput.value = ""
    if (!message.startsWith("/")) uiShowMessage("You", message)
}
window.onload = () => {
    const unameEntryModal = new bootstrap.Modal(document.getElementById("nicknameEntryModal"), {});
    unameEntryModal.show();

    // Eseménykezelők hozzáadása
    document.getElementById("modal-connect-btn").addEventListener("click", () => {
        setNickname()
        unameEntryModal.hide()
    });

    document.getElementById("nickname-modal-close-btn").addEventListener("click", setNickname);

    document.getElementById('nickname-input').addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            setNickname()
            unameEntryModal.hide()
        }
    });

    document.getElementById('send-btn').addEventListener('click', sendMessage);

    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage()
    });
}
