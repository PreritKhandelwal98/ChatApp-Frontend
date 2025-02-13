import { useState, useEffect } from 'react';

const useWebSocket = (url) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState(() => {
        return JSON.parse(localStorage.getItem("chatMessages")) || [];
    });

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => console.log("✅ Connected to WebSocket Server");

        socket.onmessage = (event) => {
            console.log(`📩 Message Received: ${event.data}`);
            setMessages((prev) => {
                const newMessages = [...prev, event.data];
                localStorage.setItem("chatMessages", JSON.stringify(newMessages));
                return newMessages;
            });
        };

        socket.onclose = () => console.log("❌ Disconnected from WebSocket Server");

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        } else {
            console.error("WebSocket is not connected.");
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
