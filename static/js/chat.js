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
    const HOST = "192.168.1.120"
    const PORT = 6968
    socket = new WebSocket(`ws://${HOST}:${PORT}`);

    // WebSocket eseménykezelők
    socket.onopen = () => {
        console.log('Connected to:', HOST, PORT);
        updateStatusIndicator(true)
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)

        if (data.type === "system" && data.content === "!NICKNAME") {
            socket.send(nickname)
        }
        else if (data.type === "user_list_update") {
            updateUserList(data.content)
        }
        else {
            uiShowMessage(data.sender, data.type, data.content)
        }
    };

    socket.onclose = () => {
        console.log('Kapcsolat megszakadt a WebSocket szerverrel');
        uiShowMessage("Client", "error", "A kapcsolat a szerverrel megszakadt.\nEllenőrizd a státusz jelzőt, majd próbálj meg újrakapcsolódni.")
        updateStatusIndicator(false)
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
function uiShowMessage(sender, type, content) {
    const messageContainer = document.getElementById("chat-window");
    const message = document.createElement('div');

    message.className = `message mb-3 p-2 rounded`;

    if (sender === "You") { message.classList.add("own-message") }
    switch (type) {
        case "error": { message.classList.add("error"); break; }
        case "system": { message.classList.add("system"); break; }
        case "info": { message.classList.add("info"); break; }
        default: { class_name = ""; break; }
    }

    message.innerHTML = `<p class="m-0"><strong>${sender}:</strong> ${content}</p>`;

    messageContainer.appendChild(message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Státsz kijelző frissítése
const updateStatusIndicator = (connected) => {
    const statusIndicator = document.getElementById("connection-status");
    const reconnectBtn = document.getElementById("reconnect-btn");

    if (connected) {
        statusIndicator.textContent = "🟢 Online";
        statusIndicator.style.color = "green";
        reconnectBtn.style.display = "none"; // Elrejtjük a gombot
    } else {
        statusIndicator.textContent = "🔴 Offline";
        statusIndicator.style.color = "red";
        reconnectBtn.style.display = "block"; // Megjelenik az újracsatlakozás gomb
    }
}

// Üzenet küldése
const sendMessage = () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value
    console.log(message)

    const msg_to_json = {
        type: message.startsWith("/") ? "command" : "message",
        sender: nickname,
        content: message
    };

    console.log(msg_to_json)
    socket.send(JSON.stringify(msg_to_json));

    messageInput.value = ""
    if (!message.startsWith("/")) uiShowMessage("You", "message", message)
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

    document.getElementById("reconnect-btn").addEventListener('click', (e) => {
        startWebsocket();
    });
}
