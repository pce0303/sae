// sae.js
import crypto from "crypto";

// Password Element 생성
function generatePasswordElement(password, salt) {
    const hash = crypto.createHash("sha256");
    hash.update(password + salt);
    return hash.digest("hex");
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


// Commit 단계: 공개 키 교환
function commitStage(clientPassword, salt, clientDH, serverPublicKey) {
  const passwordElement = generatePasswordElement(clientPassword, salt);
  console.log("Password Element:", passwordElement);

  const sharedSecret = clientDH.computeSecret(serverPublicKey, "hex", "hex");
  console.log("Shared Secret:", sharedSecret);

  const commitData = { passwordElement, sharedSecret };
  return commitData;
}


// Confirm 단계: 공유 키 인증
function confirmStage(commitDataClient, commitDataServer) {
  return crypto.timingSafeEqual(
      Buffer.from(commitDataClient.sharedSecret, "hex"),
      Buffer.from(commitDataServer.sharedSecret, "hex")
  );
}

export { generateDHKeys, commitStage, confirmStage };
