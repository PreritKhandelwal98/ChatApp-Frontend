import { useState } from "react";
import ChatPage from "../components/ChatPage";
import {useNavigate} from 'react-router-dom'

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" }
    ];

    const handleLogout = () => {
        localStorage.removeItem("messages");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setSelectedUser(null);
        navigate('/login');
        window.location.reload(); // Reload to clear state
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border-r shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Users</h2>
                    <button 
                        className="text-red-500 text-sm" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
                
                <div className="space-y-2">
                    {users.map(user => (
                        <div 
                            key={user.id} 
                            className={`p-3 rounded cursor-pointer ${selectedUser?.id === user.id ? "bg-blue-100" : "hover:bg-gray-200"}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-2/3">
                {selectedUser ? (
                    <ChatPage selectedUser={selectedUser} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
