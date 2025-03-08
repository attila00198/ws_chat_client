let socket = null;
let nickname = "";
let unameEntryModal;

// Constants
const SYSTEM_MESSAGES = {
    CONNECTON_LOST: "Megszakadt a kapcsolat a szerverrel!\nPróbálj meg később újracsatlakozni.",
    NICKNAME_REQUEST: "!NICKNAME"
}

const MESSAGE_TYPES = {
    message: "message",
    error: "error",
    info: "info",
    system: "system",
}

// Helper functions
const addEventHandler = (elementId, event, handler) => {
    document.getElementById(elementId)?.addEventListener(event, handler);
}

const createMessageObject = (sender, content, type = "message") => ({
    type: content.startsWith("/") ? "command" : type,
    sender: sender,
    content: content
});

const handleWebSocketMessage = (data) => {
    if (data.type === "system" && data.content === SYSTEM_MESSAGES.NICKNAME_REQUEST) {
        socket.send(nickname);
    } else if (data.type === "user_list_update") {
        updateUserList(data.content);
    } else {
        uiShowMessage(data.sender, data.type, data.content);
    }
}

const generateRandomNickname = () => `User${Math.floor(Math.random() * 1000)}`;

const setNicknameAndConnect = () => {
    // Setting nickname and starting WS client

    const nicknameInput = document.getElementById("nickname-input");
    nickname = nicknameInput.value || generateRandomNickname();
    console.info(`Nickanme is set to: ${nickname}`);

    startWebsocket();
}

const startWebsocket = () => {
    // Creating and handling WebSocket connection

    const HOST = CONFIG.ws.host;
    const PORT = CONFIG.ws.port();
    const useSSL = CONFIG.ws.useSSL;
    const wsUrl = `${useSSL ? "wss://" : "ws://"}${HOST}:${PORT}`;
    socket = new WebSocket(wsUrl);

    // WebSocket eseménykezelők
    socket.onopen = () => {
        console.log('Connected to:', HOST, PORT);
        updateStatusIndicator(true);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.debug(data);
        handleWebSocketMessage(data);
    };

    socket.onclose = () => {
        console.log(SYSTEM_MESSAGES.CONNECTON_LOST)
        uiShowMessage("Client", "error", `${SYSTEM_MESSAGES.CONNECTON_LOST}`)
        updateStatusIndicator(false)
    };
}

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

function uiShowMessage(sender, type, content) {
    // Randering messages on UI respectivly of their type

    const messageContainer = document.getElementById("chat-window");
    const message = document.createElement('div');

    if (sender === "You") { message.classList.add("own-message") }
    message.className = `message mb-3 p-2 rounded ${MESSAGE_TYPES[type] || MESSAGE_TYPES.message}`;

    message.innerHTML = `<p class="m-0"><strong>${sender}:</strong> ${content}</p>`;

    messageContainer.appendChild(message);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const updateStatusIndicator = (connected) => {
    // Setting the state of tha status indicator

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

const sendMessage = () => {
    // Getting message for input and sending it to the server

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    socket.send(JSON.stringify(createMessageObject(nickname, message)));

    messageInput.value = ""
    if (!message.startsWith("/")) uiShowMessage("You", "message", message);
}

const handleNicknameSubmit = () => {
    setNicknameAndConnect()
    unameEntryModal.hide()
}

window.onload = () => {
    unameEntryModal = new bootstrap.Modal(document.getElementById("nicknameEntryModal"), {});
    unameEntryModal.show();

    // Handling ninckname modal events
    addEventHandler("modal-connect-btn", "click", handleNicknameSubmit)
    addEventHandler("nickname-modal-close-btn", "click", handleNicknameSubmit)
    addEventHandler("nickname-input", "keydown", (e) => {
        if (e.key === "Enter") handleNicknameSubmit()
    })

    // Handle message input and send button
    addEventHandler("send-btn", "click", sendMessage);
    addEventHandler("message-input", "keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Handle reconnect event
    addEventHandler("reconnect-btn", "click", startWebsocket);
}
