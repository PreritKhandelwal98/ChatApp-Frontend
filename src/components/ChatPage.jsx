import { useState, useEffect, useRef } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { FaPaperPlane } from "react-icons/fa";

const ChatPage = ({ sessionId }) => {
    const { messages, sendMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}`, sessionId);
    const [input, setInput] = useState("");
    const [username, setUsername] = useState("");
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

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
        <div className="flex flex-col h-full bg-gray-100">
            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((msg, idx) => {
                    const isServerMessage = msg.startsWith("Server: ");
                    const formattedMessage = msg.replace("Server: ", "").replace("User: ", "");

                    return (
                        <div key={idx} className={`flex ${isServerMessage ? "justify-start" : "justify-end"}`}>
                            <div className={`p-3 rounded-xl shadow-md max-w-[75%] break-words ${isServerMessage ? "bg-gray-300 text-gray-800" : "bg-blue-500 text-white"}`}>
                                <span className="text-xs font-semibold block mb-1">
                                    {isServerMessage ? "Server" : username}
                                </span>
                                <p className="text-sm">{formattedMessage}</p>
                            </div>
                        </div>
                    );
                })}
                {/* Ensuring last message is visible */}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Chat Input */}
            <div className="sticky bottom-0 left-0 w-full bg-white shadow-md flex items-center p-3">
                <input 
                    type="text" 
                    className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="Type a message..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyPress} 
                />
                <button className="bg-blue-600 text-white px-5 py-3 rounded-r-lg" onClick={handleSend}>
                    <FaPaperPlane className="text-lg" />
                </button>
            </div>

            {/* Scrollbar Styles */}
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
