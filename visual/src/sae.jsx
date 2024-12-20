import axios from "axios";
import 'react-circular-progressbar/dist/styles.css';
import { styles } from "./assets/style";
import PasswordStrength from "./assets/passwordStrength";
import { evaluatePasswordStrength } from "./assets/utils";
import { useSAEState } from "./assets/state";
import ProgressBar from './assets/progressBar';

const App = () => {
    const {
        password, setPassword,
        clientPublicKey, setClientPublicKey,
        serverPublicKey, setServerPublicKey,
        sharedKey, setSharedKey,
        isAuthenticated, setIsAuthenticated,
        salt, setSalt,
        commitData, setCommitData,
        commitProgress, setCommitProgress,
        confirmProgress, setConfirmProgress,
        commitMessage, setCommitMessage,
        commitInterval, setCommitInterval,
        confirmMessage, setConfirmMessage,
        isCommitInProgress, setIsCommitInProgress,
        isConfirmInProgress, setIsConfirmInProgress,
        passwordStrength, setPasswordStrength
    } = useSAEState();

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        setPasswordStrength(evaluatePasswordStrength(password));
    };

    const handleCommit = async () => {
        if (password.length < 8) {
            alert("비밀번호는 8자 이상이어야 합니다.");
            return;
        }
    
        setIsCommitInProgress(true);
        setCommitProgress(0);
        setCommitMessage("커밋 단계 시작 ...");
    
        const interval = setInterval(() => {
            setCommitProgress((prev) => {
                const next = prev + 1;
    
                if (next === 10) setCommitMessage("salt 값 생성중 ...");
                else if (next === 25) setCommitMessage("PBKDF2로 PE 생성 중 ...");
                else if (next === 40) setCommitMessage("Diffie-Hellman 키 생성 중 ...");
                else if (next === 55) setCommitMessage("비밀번호 강화 중 ...");
                else if (next === 75) setCommitMessage("공개 키 교환 중 ...");
                else if (next === 90) setCommitMessage("비밀 키 반환 중 ...");
                else if (next === 100) {
                    setCommitMessage("커밋 단계 완료");
                    clearInterval(interval);
                    setCommitInterval(null);
                }
    
                return next <= 100 ? next : 100;
            });
        }, 50);

        setCommitInterval(interval);
    
        try {
            const response = await axios.post("http://localhost:3000/api/sae/commit", { password });
            const { clientPublicKey, serverPublicKey, salt, clientCommit, serverCommit } = response.data;
            setClientPublicKey(clientPublicKey);
            setServerPublicKey(serverPublicKey);
            setSalt(salt);
            setCommitData({ clientCommit, serverCommit });
        } catch (error) {
            setCommitMessage("커밋 단계 중 에러 발생: " + error.message);
            console.error("Error during commit:", error);
        }
    };
    
    const handleConfirm = async () => {
        setIsConfirmInProgress(true);
        setConfirmProgress(0);
        setConfirmMessage("컴펌 단계 시작 ...");
    
        const interval = setInterval(() => {
            setConfirmProgress((prev) => {
                const next = prev + 1;
    
                if (next === 10) setConfirmMessage("커밋 결과 확인 중 ...");
                else if (next === 30) setConfirmMessage("타이밍 공격 시작 중 ...");
                else if (next === 50) setConfirmMessage("공유 키 계산 중 ...");
                else if (next === 70) setConfirmMessage("공유 키 인증 중 ...");
                else if (next === 85) setConfirmMessage("인증 상태 반환 중 ...");
                else if (next === 100) {
                    setConfirmMessage("컴펌 단계 완료");
                    clearInterval(interval);
                }
    
                return next <= 100 ? next : 100;
            });
        }, 50);
    
        try {
            const response = await axios.post("http://localhost:3000/api/sae/confirm", {
                clientPublicKey,
                serverPublicKey,
                salt
            });
            setSharedKey(response.data.sharedKey);
            setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
            setConfirmMessage("컨펌 단계 중 에러 발생: " + error.message);
            console.error("Error during confirm:", error);
        }
    };    

    const cancelCommit = () => {
        if (commitInterval) {
            clearInterval(commitInterval); 
            setCommitInterval(null); 
        }
        setCommitProgress(0);
        setIsCommitInProgress(false);
        setCommitMessage("커밋 단계 취소됨");
    };    
    
    const cancelConfirm = () => {
        setConfirmProgress(0);
        setIsConfirmInProgress(false);
        setConfirmMessage("컴펌 단계 취소됨");
    };

    const handleDownloadResults = () => {
        const data = {
            sharedKey,
            isAuthenticated,
            clientPublicKey,
            serverPublicKey,
            salt,
            timestamp: new Date().toISOString(),
        };
    
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(jsonBlob);
    
        const link = document.createElement("a");
        link.href = url;
        link.download = "auth_results.json";
        link.click();
    
        URL.revokeObjectURL(url); 
    };    
    
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>SAE Simulator</h1>
            <input
                type="password"
                placeholder="8자 이상 비밀번호 입력"
                value={password}
                onChange={handlePasswordChange}
                style={styles.input}
            />
            {passwordStrength && <PasswordStrength passwordStrength={passwordStrength} />}

            <button onClick={handleCommit} style={styles.button}>
                Start Commit Stage
            </button>
            <button onClick={cancelCommit} style={{ ...styles.button, backgroundColor: '#b57064' }}>
                Cancel Commit
            </button>
    
            {isCommitInProgress && (
                <div style={styles.feedbackContainer}>
                    <p style={styles.feedbackText}>
                        {isCommitInProgress ? commitMessage : '진행 상황 추적 실패'}
                    </p>
                </div>
            )}
    
            {clientPublicKey && serverPublicKey && commitProgress==100 && (
                <>
                    <div style={styles.keyContainer}>
                        <p style={styles.keyLabel}>클라이언트 공개 키:</p>
                        <p style={styles.keyValue}>{clientPublicKey.substring(0, 40)}...</p>
                        <p style={styles.keyLabel}>서버 공개 키:</p>
                        <p style={styles.keyValue}>{serverPublicKey.substring(0, 40)}...</p>
                    </div>
                    <button onClick={handleConfirm} style={styles.button}>
                        Start Confirm Stage
                    </button>
                    <button onClick={cancelConfirm} style={{ ...styles.button, backgroundColor: '#b57064' }}>
                        Cancel Confirm
                    </button>
                    <br></br><br></br>
                </>
            )}

            {isConfirmInProgress && (
                <div style={styles.feedbackContainer}>
                    <p style={styles.feedbackText}>
                        {isConfirmInProgress ? confirmMessage : '진행 상황 추적 실패'}
                    </p>
                </div>
            )}

            {sharedKey && confirmProgress==100 && (
                <div style={styles.resultContainer}>
                    <p style={styles.keyLabel}>Shared Key:</p>
                    <p style={styles.keyValue}>{sharedKey.substring(0, 40)}...</p>
                    <br></br>
                    <p style={styles.resultText}>
                        인증 상태 : <span style={styles.authStatus}>{isAuthenticated ? "Success" : "Failed"}</span>
                    </p>
                    <br></br>
                    <button onClick={handleDownloadResults} style={styles.button}>
                        결과 다운로드
                    </button>
                </div>
            )}
    
            {commitProgress !== 0 && (
                <ProgressBar progress={commitProgress} />
            )}
    
            {isConfirmInProgress && confirmProgress !== 0 && (
                <ProgressBar progress={confirmProgress} />
            )}
    
        </div>
    );
    
}; 

export default App;
