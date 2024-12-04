import express from "express";
import cors from "cors";
import { generateDHKeys, commitStage, confirmStage } from "./sae.js";
import { dictionaryAttack, generateRandomSalt } from "./psk.js";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // 클라이언트 URL
    methods: ["GET", "POST"],
    credentials: true
}));

// SAE 관련 변수들
let clientDH, serverDH;
let clientCommitData, serverCommitData;

// SAE Commit 단계 API
app.post("/api/sae/commit", (req, res) => {
    const { password } = req.body;

    // 서버에서 salt 생성
    const salt = generateRandomSalt();

    // 클라이언트와 서버 키 생성
    clientDH = generateDHKeys();
    serverDH = generateDHKeys();

    // 공개 키 교환
    clientCommitData = commitStage(password, salt, clientDH.dh, serverDH.publicKey);
    serverCommitData = commitStage(password, salt, serverDH.dh, clientDH.publicKey);

    res.json({
        clientPublicKey: clientDH.publicKey,
        serverPublicKey: serverDH.publicKey,
        salt: salt,  // 클라이언트에 salt 전달
    });
});

// SAE Confirm 단계 API
app.post("/api/sae/confirm", (req, res) => {
    const isAuthenticated = confirmStage(clientCommitData, serverCommitData);
    res.json({
        sharedKey: clientCommitData.sharedSecret,
        isAuthenticated,
    });
});

// Dictionary 공격 API (PSK 관련)
// server.js

// Dictionary 공격 API (PSK 관련)
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

// 서버 실행
app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
});
