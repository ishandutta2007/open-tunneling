import * as net from 'net';

const SERVER_HOST = '127.0.0.1'; // Change to your server's public IP
const SERVER_TUNNEL_PORT = 9090;
const LOCAL_SERVICE_PORT = 3000; // The port of your local web server or service

console.log('✦ Open Tunnel Client ✦');

const connectToServer = () => {
  console.log(`[Client] Connecting to server at ${SERVER_HOST}:${SERVER_TUNNEL_PORT}...`);

  const tunnelConnection = net.createConnection({
    host: SERVER_HOST,
    port: SERVER_TUNNEL_PORT
  });

  tunnelConnection.on('connect', () => {
    console.log('[Client] Connected to server tunnel.');
    console.log(`[Client] Ready to forward traffic to localhost:${LOCAL_SERVICE_PORT}`);
  });

  // When the server sends us data, it means a public connection has been made.
  // We need to forward this to our local service.
  tunnelConnection.on('data', (data) => {
    // This simple piping model requires a local connection to be ready.
    // A better implementation uses a control protocol.
    // For now, we establish the local connection as soon as the tunnel is up.
  });

  const localConnection = net.createConnection({
    host: 'localhost',
    port: LOCAL_SERVICE_PORT
  });

  localConnection.on('connect', () => {
    console.log(`[Local] Connected to local service on port ${LOCAL_SERVICE_PORT}.`);
    
    // Now that both connections are established, pipe them together.
    tunnelConnection.pipe(localConnection);
    localConnection.pipe(tunnelConnection);
  });

  localConnection.on('error', (err) => {
    console.error(`[Local] Connection to local service failed: ${err.message}`);
    console.log('[Client] Closing connection to server.');
    tunnelConnection.end();
  });

  tunnelConnection.on('close', () => {
    console.log('[Client] Connection to server closed. Reconnecting in 5 seconds...');
    localConnection.destroy();
    setTimeout(connectToServer, 5000);
  });

  tunnelConnection.on('error', (err) => {
    console.error(`[Client] Server connection error: ${err.message}`);
    // The 'close' event will handle reconnection.
  });
};

connectToServer();
