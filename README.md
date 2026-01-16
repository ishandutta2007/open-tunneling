<h1 align="center">
  <br>
  <samp><b>✧ Open Tunnel ✧</b></samp>
  <br>
</h1>

<p align="center">
  <samp>Your Open-Source Gateway to Local Services.</samp>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-alpha-yellow.svg" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

---

<samp>

**Open Tunnel** is a free and open-source alternative to services like ngrok, Cloudflare Tunnel, and Tailscale. It provides a secure tunnel from a public endpoint to a service running on your local machine. Expose your local web servers, development environments, or any TCP service to the internet with a simple command.

This project is in its early stages, providing a basic but functional TCP tunnel.

## ✨ Features

*   **Secure TCP Tunneling:** Forward any TCP-based service (HTTP, SSH, etc.) from your local machine.
*   **Self-Hostable:** You have full control. Run the server component on your own VPS or cloud instance.
*   **Lightweight & Simple:** No complex setup. Just a client and a server.
*   **Cross-Platform:** (Goal) Binaries for all major operating systems.

## ⚙️ How It Works

The architecture is simple: a client and a server work together to bridge a public port to a local port.

```
+-----------------+      +---------------------+      +----------------------+      +--------------------+
| Public Internet |  ->  | Your VPS / Server   |  ->  | Your Local Machine   |  ->  | Your Local Service |
| (e.g., Browser) |      | [Open Tunnel Server]|      | [Open Tunnel Client] |      | (e.g., Port 3000)  |
+-----------------+      +---------------------+      +----------------------+      +--------------------+
        |                        | (Public Port)         |  (Secure Tunnel)     |                        |
        +------------------------+-----------------------+----------------------+------------------------+
```

1.  The **Open Tunnel Server** runs on a machine with a public IP address. It listens on two ports: a public port that will receive internet traffic and a tunnel port for the client to connect to.
2.  The **Open Tunnel Client** runs on your local machine. It connects to the server's tunnel port, creating a persistent, secure connection.
3.  When a request hits the server's public port, the server sends that traffic through the tunnel to the client.
4.  The client forwards the traffic to the specified local service. The response travels back the same way.

## 🚀 Getting Started

*(Instructions will be updated as the project progresses)*

### Prerequisites

*   A server (VPS, cloud instance) with a public IP address.
*   Go (for building from source) or pre-built binaries (coming soon).

### Running the Server

1.  SSH into your server.
2.  Run the server component, specifying the public-facing port and the port for the client tunnel.

    ```bash
    # Example
    ./server -public :8080 -tunnel :9090
    ```

### Running the Client

1.  On your local machine, run the client component.
2.  Point it to your server's tunnel address and specify the local port your service is running on.

    ```bash
    # Example: Forward to a local service on port 3000
    ./client -server your-server-ip:9090 -local localhost:3000
    ```

Now, any traffic sent to `your-server-ip:8080` will be forwarded to `localhost:3000` on your machine!

## 🤝 Contributing

This is an open-source project, and contributions are welcome! Feel free to open issues for bugs and feature requests, or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

</samp>