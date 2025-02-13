import { useState, useEffect, useRef } from "react";
import useWebSocket from "../hooks/useWebSocket";

const ChatPage = ({ selectedUser }) => {
    const { messages, sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}`);
    const [input, setInput] = useState("");
    const [username, setUsername] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        setUsername(storedUser || "You");
    }, []);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents new line
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 shadow-md flex items-center">
                <h2 className="text-lg font-bold">{selectedUser.name}</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 bg-white space-y-2 custom-scrollbar">
                {messages.map((msg, idx) => {
                    const isServerMessage = msg.startsWith("Server: ");
                    const formattedMessage = msg.replace("Server: ", "").replace("User: ", "");

                    return (
                        <div 
                            key={idx} 
                            className={`p-3 rounded-lg max-w-[75%] ${
                                isServerMessage 
                                    ? "bg-gray-300 text-black self-start text-left"
                                    : "bg-blue-500 text-white self-end ml-auto text-right"
                            }`}
                        >
                            <span className="text-xs font-semibold block">
                                {isServerMessage ? "Server" : username}
                            </span>
                            <p>{formattedMessage}</p>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex p-3 border-t bg-white">
                <input
                    type="text"
                    className="flex-1 p-3 border rounded-l focus:outline-none"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress} // Send message on Enter
                />
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-r"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>

            {/* Hide Scrollbar CSS */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ChatPage;
