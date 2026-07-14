import Editor from "@monaco-editor/react";

function CodeEditor({ code, onChange, language, monacoTheme = "vs-dark" }) {
    return(
        <div style={{height:"100%", width:"100%"}} >
            <Editor 
                height="100%"
                language={language}
                theme={monacoTheme}
                value={code}
                onChange={(value) => onChange(value)}
                options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                    fontLigatures: true,
                    minimap: {enabled: false},
                    scrollBeyondLastLine: false,
                    renderLineHighlight: "all",
                    lineNumbersMinChars: 3,
                    padding: { top: 12, bottom: 12 },
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true,
                    wordWrap: "off",
                    tabSize: 4,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}

export default CodeEditor;

// UserList shows you + other users separately
// CodeEditor wraps Monaco editor — value is controlled, onChange fires on every keystroke