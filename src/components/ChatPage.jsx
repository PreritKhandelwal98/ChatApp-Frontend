import { useState, useEffect, useRef } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { FaPaperPlane } from "react-icons/fa";

const ChatPage = ({ selectedUser }) => {
    const { messages, sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}`);
    const [input, setInput] = useState("");
    const [username, setUsername] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "You");
    }, []);

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
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white py-4 px-6 shadow-md flex items-center">
                <h2 className="text-lg font-semibold">{selectedUser?.name || "Chat"}</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((msg, idx) => {
                    const isServerMessage = msg.startsWith("Server: ");
                    const formattedMessage = msg.replace("Server: ", "").replace("User: ", "");

                    return (
                        <div key={idx} className={`flex ${isServerMessage ? "justify-start" : "justify-end"}`}>
                            <div
                                className={`p-3 rounded-xl shadow-md max-w-[75%] break-words relative ${
                                    isServerMessage
                                        ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800"
                                        : "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                                }`}
                                style={{
                                    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "20px",
                                    padding: "10px 15px",
                                }}
                            >
                                <span className="text-xs font-semibold block mb-1">
                                    {isServerMessage ? "Server" : username}
                                </span>
                                <p className="text-sm">{formattedMessage}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex items-center p-3 bg-white shadow-md">
                <input
                    type="text"
                    className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button
                    className="bg-blue-600 text-white px-5 py-3 rounded-r-lg hover:bg-blue-700 transition flex items-center justify-center"
                    onClick={handleSend}
                >
                    <FaPaperPlane className="text-lg" />
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
