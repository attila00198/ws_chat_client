<!doctype html>
<html lang="en">

<head>
    <title>WS Chat App</title>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <!-- Bootstrap CSS v5.2.1 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
    <link rel="stylesheet" href="static/css/chat.css">
    <link rel="stylesheet" href="static/css/sidebar.css">
    <script defer src="static/js/chat.js"></script>
    <script defer src="static/js/sidebar.js"></script>
</head>

<body data-bs-theme="dark">
    <!-- Modal for entering username -->

    <div class="modal fade" id="nicknameEntryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="nicknameEntryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="nicknameEntryModalLabel">Modal title</h5>
                    <button type="button" id="nickname-modal-close-btn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating">
                        <input type="text" id="nickname-input" class="form-control" placeholder="Nickname" autofocus="true">
                        <label for="nickname-input">Nickname</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="modal-connect-btn" class="btn btn-primary">Understood</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Chat interface -->
    <div class="container">
        <div class="row">
            <!-- Sidebar -->
            <div id="sidebar" class="col-md-2 sidebar">
                <div id="status-indicator" class="row justify-content-between align-items-center g-2">
                    <h5>Server Status:</h5>
                    <div id="connection-status" class="col"></div>
                    <button id="reconnect-btn" class="col btn btn-sm btn-outline-danger" style="display: none;">🔄 Reconnect</button>
                </div>
                <hr>
                <div class="sidebar-header d-flex justify-content-between">
                    <h5>Available Users</h5>
                    <button id="close-btn" class="close-btn btn btn-close"></button>
                </div>
                <div class="sidebar-body">
                    <ul id="user-list" class="nav flex-column">
                        <!-- User list items will go here -->
                    </ul>
                </div>
                <hr>
            </div>

            <!-- Chat Area -->
            <main class="col-md-10 ms-sm-auto px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">WebSocekt Chat APP</h1>
                    <!-- Button to toggle sidebar -->
                    <button id="open-btn" class="open-btn btn btn-primary">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div id="chat-window" style="height: 80vh; overflow-y: scroll; border: 1px solid #ccc; padding: 10px;">
                    <!-- Chat messages will appear here -->
                </div>

                <!-- Input for chat messages -->
                <div class="input-group mt-3">
                    <input type="text" id="message-input" class="form-control" placeholder="Type your message here..." aria-label="Message">
                    <button id="send-btn" class="btn btn-primary" type="button">Send</button>
                </div>
            </main>
        </div>
    </div>

    <!-- Bootstrap JavaScript Libraries -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
        integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
        crossorigin="anonymous"></script>
</body>

</html>
