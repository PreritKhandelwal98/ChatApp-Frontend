import { useState, useEffect } from "react";

const useWebSocket = (url, sessionId) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new WebSocket(url);
        socket.onopen = () => console.log("✅ Connected to WebSocket Server");

        socket.onmessage = (event) => {
            console.log(`📩 Message Received: ${event.data}`);

            setMessages((prev) => {
                const newMessages = [...prev, event.data];

                // Save messages for this session
                const storedSessions = JSON.parse(localStorage.getItem("sessions")) || {};
                storedSessions[sessionId] = newMessages;
                localStorage.setItem("sessions", JSON.stringify(storedSessions));

                return newMessages;
            });
        };

        socket.onclose = () => console.log("❌ Disconnected from WebSocket Server");

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [url, sessionId]);

    useEffect(() => {
        // Load session messages when switching sessions
        const storedSessions = JSON.parse(localStorage.getItem("sessions")) || {};
        setMessages(storedSessions[sessionId] || []);
    }, [sessionId]);

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
