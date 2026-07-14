import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarlybirds } from "@fortawesome/free-brands-svg-icons";

function Home() {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");

    const navigate = useNavigate();

    const generateRoomId = () => {
        const id = Math.random().toString(36).substring(2, 8);
        setRoomId(id);
    };

    const joinRoom = () => {
        if (!username.trim() || !roomId.trim()) {
            alert("Please enter both username and room ID");
            return;
        }
        navigate(`/editor/${roomId}`, { state: { username } });
        // navigate(..., { state: { username } }) - passes username to the next page without putting it in the URL
    };

    return (
        <div className="home-page">
            <div className="home-card">
                {/* Logo + Title */}
                <div className="home-logo">
                    <div className="home-logo-icon"><FontAwesomeIcon icon={faEarlybirds} style={{ color: "rgb(183, 208, 247)" }} /></div>
                    <h1 className="home-title">CodeCraft</h1>
                </div>
                <p className="home-subtitle">Real-time collaborative code editing</p>

                {/* Form */}
                <div className="home-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="username-input">Username</label>
                        <input
                            id="username-input"
                            className="home-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="room-id-input">Room ID</label>
                        <input
                            id="room-id-input"
                            className="home-input"
                            placeholder="Enter or generate a room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>

                    <div className="home-buttons">
                        <button
                            id="generate-room-btn"
                            className="btn-generate"
                            onClick={generateRoomId}
                            title="Generate a random Room ID"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Generate Room
                        </button>
                        <button
                            id="join-room-btn"
                            className="btn-join"
                            onClick={joinRoom}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;