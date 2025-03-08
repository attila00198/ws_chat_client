const CONFIG = {
    ws: {
        devMode: true,
        host: window.location.hostname || 'localhost',
        port() {
            return this.devMode ? "6968" : "8000"; // A port értéke függ a devMode-tól
        },
        useSSL: false
    }
};

const wsConfigTable = {
    devMode: CONFIG.ws.devMode,
    host: CONFIG.ws.host,
    port: CONFIG.ws.port(), // A függvényt meghívjuk
    useSSL: CONFIG.ws.useSSL
};

console.table(wsConfigTable);