import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";
import CodeEditor from "../components/CodeEditor";
import UserList from "../components/UserList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/free-regular-svg-icons";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { faEarlybirds } from "@fortawesome/free-brands-svg-icons";

function Editor({ theme, toggleTheme }) {
    const navigate = useNavigate();
    useEffect(() => {
        if(!username) {
            navigate("/");
        }
    }, []);
    const { roomId } = useParams();
    const location = useLocation();
    const username = location.state?.username;

    const [code, setCode] = useState("// Start coding here...");
    const [users, setUsers] = useState([]);
    const [language, setLanguage] = useState("javascript");

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const prevUsersLength = useRef(null);

    useEffect(() => {
        socket.connect()
        socket.emit("join-room", { roomId, username });

        socket.off("room-users");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("code-update");
        socket.off("language-update");
        socket.off("code-output");

        socket.on("language-update", ({ language }) => {
            setLanguage(language);
        });

        socket.on("room-users", ({ users }) => {
            setUsers(users.filter((u) => u !== username));
        });


        socket.on("user-joined", ({ username }) => {
            setUsers((prev) => [...prev, username]);
        });

        socket.on("user-left", ({ username }) => {
            setUsers((prev) => prev.filter((u) => u != username));
        });

        socket.on("code-update", ({ code }) => {
            setCode(code);
        });

        socket.on("code-output", ({ output, input, ranBy }) => {
            setOutput(`Run by: ${ranBy}\n Input:${input || "none"}\n\n ${output}`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (users.length > 0) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "If you leave, all code will be lost. Are you sure?";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [users]);

    const [isLastUser, setIsLastUser] = useState(false);

    useEffect(() => {
        if (prevUsersLength.current !== null && prevUsersLength.current > 0 && users.length === 0) {
            setIsLastUser(true);
            setTimeout(() => setIsLastUser(false), 5000);
        }
        prevUsersLength.current = users.length;
    }, [users]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit("code-change", { roomId, code: newCode });
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        socket.emit("language-change", { roomId, language: newLanguage });
    }

    const handleRunCode = () => {
        socket.emit("run-code", { roomId, code, language, input, username });
        setOutput("Running...");
    }

    const handleClearOutput = () => {
        setOutput("");
    }

    const monacoTheme = theme === "dark" ? "vs-dark" : "vs";
    const isDark = theme === "dark";

    return (
        <div className="editor-root">

            {/* ── Warning Banner ── */}
            {isLastUser && (
                <div className="warning-banner">
                    <span>⚠</span>
                    You are the last one in the room. Copy your code before leaving — it will be lost!
                </div>
            )}

            {/* ── Top Navbar ── */}
            <nav className="editor-navbar">
                {/* Brand */}
                <div className="navbar-brand">
                    <div className="navbar-logo-icon"><FontAwesomeIcon icon={faEarlybirds} style={{ color: "rgb(183, 208, 247)", }} /></div>
                    <span className="navbar-title">CodeCraft</span>
                </div>

                {/* Room ID pill */}
                <span className="navbar-room-id" title="Room ID">#{roomId}</span>

                {/* Spacer + Controls */}
                <div className="navbar-controls">
                    {/* Language selector */}
                    <select
                        id="language-select"
                        className="lang-select"
                        onChange={handleLanguageChange}
                        value={language}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>

                    <div className="navbar-sep" />

                    {/* Run button */}
                    <button
                        id="run-code-btn"
                        className="btn-run"
                        onClick={handleRunCode}
                        title="Run Code (executes on server)"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Run
                    </button>

                    <div className="navbar-sep" />

                    {/* Theme toggle */}
                    <button
                        id="theme-toggle-btn"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            /* Sun icon for "switch to light" */
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            /* Moon icon for "switch to dark" */
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* ── Editor Body ── */}
            <div className="editor-body">
                {/* Sidebar */}
                <UserList users={users} username={username} />

                {/* Main area */}
                <div className="editor-main">
                    {/* Monaco editor */}
                    <div className="editor-monaco-wrapper">
                        <CodeEditor
                            code={code}
                            onChange={handleCodeChange}
                            language={language}
                            monacoTheme={monacoTheme}
                        />
                    </div>

                    {/* Bottom I/O panel */}
                    <div className="bottom-panel">
                        {/* Input */}
                        <div className="panel-pane">
                            <div className="panel-header">
                                <FontAwesomeIcon icon={faKeyboard} style={{ color: "rgb(183, 208, 247)" }} />
                                <span className="panel-header-label">Input</span>
                            </div>
                            <textarea
                                id="code-input"
                                className="panel-textarea"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter stdin for your program..."
                                spellCheck={false}
                            />
                        </div>

                        {/* Output */}
                        <div className="panel-pane">
                            <div className="panel-header">
                                <FontAwesomeIcon icon={faFileExport} style={{ color: "rgb(183, 208, 247)", }} />
                                <span className="panel-header-label">Output</span>
                                <div>
                                    <button
                                        onClick={handleClearOutput}
                                        className="btn-run"
                                    >Clear</button>
                                </div>
                            </div>

                            <pre
                                id="code-output"
                                className={`panel-output${output === "Running..." ? " running" : ""}${!output ? " empty" : ""}`}
                            >
                                {output || "Output will appear here after you run your code..."}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Editor;