import crypto from "crypto";

function generateRandomSalt(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}

function generatePasswordElement(password, salt) {
    const iterations = 100000; // PBKDF2 반복 횟수
    const keyLength = 32; 
    const hash = 'sha256';

    return crypto.pbkdf2Sync(password, salt, iterations, keyLength, hash).toString('hex');
}

// Diffie-Hellman 키 생성 
const prime = crypto.getDiffieHellman("modp15").getPrime(); 
const generator = crypto.getDiffieHellman("modp15").getGenerator();

function generateDHKeys() {
    const dh = crypto.createDiffieHellman(prime, generator);
    const publicKey = dh.generateKeys("hex");
    const privateKey = dh.getPrivateKey("hex");
    return { dh, publicKey, privateKey };
}

// Commit 단계: 공개 키 교환 및 공유 비밀 생성
function commitStage(clientPassword, salt, clientDH, serverPublicKey) {
    const passwordElement = generatePasswordElement(clientPassword, salt); // 비밀번호 처리 강화
    console.log("Password Element:", passwordElement);

    // Diffie-Hellman 키 교환을 통해 공유 비밀 생성
    const sharedSecret = clientDH.computeSecret(serverPublicKey, "hex", "hex");
    console.log("Shared Secret:", sharedSecret);

    // Commit 데이터 반환 (비밀번호 요소 및 공유 비밀)
    const commitData = { passwordElement, sharedSecret };
    return commitData;
}

// Confirm 단계: 공유 키 인증 (타이밍 공격 방어)
function confirmStage(commitDataClient, commitDataServer) {
  // 타이밍 공격을 방어하기 위해 timingSafeEqual 사용
  return crypto.timingSafeEqual(
      Buffer.from(commitDataClient.sharedSecret, "hex"),
      Buffer.from(commitDataServer.sharedSecret, "hex")
  );
}

export { generateDHKeys, commitStage, confirmStage, generateRandomSalt };
