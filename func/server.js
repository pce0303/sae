import express from "express";
import cors from "cors";
import path from "path";
import { generateDHKeys, commitStage, confirmStage, generateRandomSalt } from "./sae.js";
import { dictionaryAttack } from "./psk.js";
import { fileURLToPath } from "url";  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
}));

let clientDH, serverDH;
let clientCommitData, serverCommitData;

// SAE Commit 단계 API
app.post("/api/sae/commit", (req, res) => {
    const { password } = req.body;

    if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const salt = generateRandomSalt();

    clientDH = generateDHKeys();
    serverDH = generateDHKeys();

    clientCommitData = commitStage(password, salt, clientDH.dh, serverDH.publicKey);
    serverCommitData = commitStage(password, salt, serverDH.dh, clientDH.publicKey);

    res.json({
        clientPublicKey: clientDH.publicKey,
        serverPublicKey: serverDH.publicKey,
        salt: salt,
    });
});

// SAE Confirm 단계 API
app.post("/api/sae/confirm", (req, res) => {
    if (!clientCommitData || !serverCommitData) {
        return res.status(400).json({ error: "Commit data is missing. Please start the commit phase first." });
    }

    const isAuthenticated = confirmStage(clientCommitData, serverCommitData);

    res.json({
        sharedKey: clientCommitData.sharedSecret,
        isAuthenticated,
    });
});

// Dictionary 공격 API
app.post("/api/dictionary-attack", (req, res) => {
    try {
        const { passwordList } = req.body;
        
        const result = dictionaryAttack(passwordList);
        
        res.json(result);
    } catch (error) {
        console.error("Error during dictionary attack:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use(express.static(path.join(__dirname, '..', 'visual', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'visual', 'dist', 'index.html'));
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
