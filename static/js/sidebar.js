// Sidebar toggle
const openBtn = document.getElementById('open-btn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-btn');

openBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');  // Sidebart be- és kikapcsolja
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');  // Oldalsáv bezárása
});
