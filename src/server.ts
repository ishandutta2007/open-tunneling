import * as net from 'net';

const PUBLIC_PORT = 8080;
const TUNNEL_PORT = 9090;

console.log('✦ Open Tunnel Server ✦');

// Server to face the public internet
const publicServer = net.createServer(publicSocket => {
  console.log(`[Public] Connection received.`);

  // Wait for a client to be available before doing anything
  if (!tunnelSocket) {
    console.log('[Public] No client tunnel connected. Closing connection.');
    publicSocket.end('No client tunnel available. Please try again later.\n');
    return;
  }

  console.log('[Public] Client tunnel is available. Piping streams.');

  // Pipe the data between the public connection and the tunnel connection
  publicSocket.pipe(tunnelSocket);
  tunnelSocket.pipe(publicSocket);

  // Handle cleanup when either side disconnects
  publicSocket.on('close', () => {
    console.log('[Public] Connection closed.');
    // In this simple version, we might want to reset the tunnel socket
    // or prepare for the next connection. For now, we just log.
  });

  publicSocket.on('error', (err) => {
    console.error('[Public] Socket Error:', err.message);
  });
});

let tunnelSocket: net.Socket | null = null;

// Server to listen for our own client
const tunnelServer = net.createServer(socket => {
  console.log(`[Tunnel] Client connected.`);

  // If there's already a client, reject the new one.
  // A more advanced version would handle multiple clients.
  if (tunnelSocket) {
    console.log('[Tunnel] A client is already connected. Rejecting new one.');
    socket.end('A client is already connected.\n');
    return;
  }

  tunnelSocket = socket;

  tunnelSocket.on('close', () => {
    console.log('[Tunnel] Client disconnected.');
    tunnelSocket = null;
  });

  tunnelSocket.on('error', (err) => {
    console.error('[Tunnel] Socket Error:', err.message);
    tunnelSocket = null;
  });
});

publicServer.listen(PUBLIC_PORT, () => {
  console.log(`[Public] Server listening on port ${PUBLIC_PORT}`);
});

tunnelServer.listen(TUNNEL_PORT, () => {
  console.log(`[Tunnel] Server listening for client on port ${TUNNEL_PORT}`);
});
