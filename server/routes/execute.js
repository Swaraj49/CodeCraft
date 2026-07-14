const express = require("express");
const router = express.Router();

const LANGUAGE_MAP = {
    javascript: {language:"javascript", filename:"main.js"},
    python: {language:"python", filename:"main.py"},
    cpp: {language:"cpp", filename:"main.cpp"},
    java: {language: "java", filename:"Main.java"},
};

router.post("/", async(req, res)=> {
    const { code, language, input } = req.body;

    const lang = LANGUAGE_MAP[language];
    if(!lang) {
        return res.status(400).json({error: "Unsupported language"});
    }

    try {
        const response = await fetch(`https://glot.io/api/run/${lang.language}/latest`, {
            method:"POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Token ${process.env.GLOT_API_KEY}`,
            },
            body: JSON.stringify ({
                files: [{ name: lang.filename, content: code }],
                stdin: input || "",
            }),
        });
        const data = await response.json();
        const output = data?.stdout || data?.stderr || data?.error || "No output";
        res.json({output});
    } catch(err) {
        console.log("Execution error:", err);
        res.status(500).json({error: "Execution failed"});
    }

});

module.exports = router;