const { WebSocketServer } = require('ws');
// Railway asigna el puerto automáticamente mediante la variable PORT
const port = process.env.PORT || 8080; 
const wss = new WebSocketServer({ port });

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);

wss.on('connection', (ws) => {
  console.log('Cliente conectado (LabVIEW o Web)');

  ws.on('message', (message) => {
    const dataString = message.toString();
    console.log('Mensaje recibido:', dataString);

    // Reenviar el mensaje a TODOS los clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // 1 significa OPEN
        client.send(dataString);
      }
    });
  });

  ws.on('close', () => console.log('Cliente desconectado'));
});
