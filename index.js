const { WebSocketServer } = require('ws');
const http = require('http'); // 👈 Servidor HTTP nativo incluido

// Railway asigna el puerto automáticamente mediante la variable PORT
const port = process.env.PORT || 8080;

// 1. Creamos un servidor HTTP básico para responderle a Railway (Healthcheck)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket Activo OK\n');
});

// 2. Montamos el servidor WebSocket ENCIMA del servidor HTTP para usar el mismo puerto
const wss = new WebSocketServer({ server: server });

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);

wss.on('connection', (ws) => {
    console.log('Cliente conectado (LabVIEW o web)');

    ws.on('message', (message) => {
        const dataString = message.toString();
        console.log('Mensaje recibido: ', dataString);

        // Reenviar el mensaje a TODOS los clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // 1 significa OPEN
                client.send(dataString);
            }
        });
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// 3. Encendemos el servidor en el puerto dinámico de Railway
server.listen(port, () => {
    console.log(`Servidor HTTP/WS escuchando en el puerto ${port}`);
});
