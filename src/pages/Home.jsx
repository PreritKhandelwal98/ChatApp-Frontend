import { useEffect, useState } from "react";
import ChatPage from "../components/ChatPage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FaBars, FaPlus, FaSignOutAlt } from "react-icons/fa";

const Home = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedSessions = JSON.parse(localStorage.getItem("sessions")) || {};
        setSessions(Object.keys(savedSessions));

        if (!Object.keys(savedSessions).length) {
            createNewSession();
        }
    }, []);

    const createNewSession = () => {
        const sessionId = uuidv4();
        const updatedSessions = {
            ...JSON.parse(localStorage.getItem("sessions") || "{}"),
            [sessionId]: [],
        };
        localStorage.setItem("sessions", JSON.stringify(updatedSessions));
        setSessions(Object.keys(updatedSessions));
        setActiveSession(sessionId);
        setSidebarOpen(false);
    };

    const selectSession = (sessionId) => {
        setActiveSession(sessionId);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="h-screen flex flex-col md:flex-row">
            {/* Navbar for Mobile */}
            <div className="md:hidden flex justify-between items-center p-4 bg-blue-600 text-white fixed top-0 left-0 w-full z-10">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars className="text-lg" />
                </button>
                <h3 className="text-lg font-semibold">Chats</h3>
                <button className="bg-green-500 p-2 rounded-full" onClick={createNewSession}>
                    <FaPlus />
                </button>
            </div>

            {/* Sidebar */}
            <div className={`md:w-1/4 fixed md:relative top-0 left-0 h-full bg-gray-200 p-4 border-r transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Chats</h3>
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm" onClick={createNewSession}>
                        New Chat
                    </button>
                </div>

                {/* Sessions List */}
                <div className="space-y-2">
                    {sessions.map((sessionId) => (
                        <button key={sessionId} className={`w-full text-left px-4 py-2 rounded-md ${activeSession === sessionId ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => selectSession(sessionId)}>
                            Session {sessionId.slice(0, 8)}...
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <button className="mt-4 w-full bg-red-500 text-white px-3 py-2 rounded-md" onClick={handleLogout}>
                    <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
            </div>

            {/* Chat Page */}
            <div className="flex-1 flex flex-col h-full mt-12 md:mt-0">
                {activeSession ? (
                    <ChatPage sessionId={activeSession} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
