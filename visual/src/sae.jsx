import { useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import zxcvbn from "zxcvbn";

const App = () => {
    const [password, setPassword] = useState("");
    const [clientPublicKey, setClientPublicKey] = useState("");
    const [serverPublicKey, setServerPublicKey] = useState("");
    const [sharedKey, setSharedKey] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [salt, setSalt] = useState("");
    const [commitData, setCommitData] = useState(null);
    const [commitProgress, setCommitProgress] = useState(0);
    const [confirmProgress, setConfirmProgress] = useState(0);
    const [commitMessage, setCommitMessage] = useState("");
    const [commitInterval, setCommitInterval] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isCommitInProgress, setIsCommitInProgress] = useState(false);
    const [isConfirmInProgress, setIsConfirmInProgress] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null); 

    const evaluatePasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength(null);
            return;
        }
        const result = zxcvbn(password);
        setPasswordStrength(result);
    };

    const getStrengthColor = (score) => {
        switch (score) {
            case 0:
                return "#FF6347"; 
            case 1:
                return "#FFA500"; 
            case 2:
                return "#FFD700";
            case 3:
                return "#32CD32"; 
            case 4:
                return "#008000"; 
            default:
                return "#d3d3d3"; 
        }
    };

    const getProgressColor = (progress) => {
        if (progress <= 25) {
            return '#FF6347';
        } else if (progress <= 50) {
            return '#FFA500'; 
        } else if (progress <= 75) {
            return '#FFD700'; 
        } else {
            return '#32CD32';
        }
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
                onChange={(e) => {
                    setPassword(e.target.value);
                    evaluatePasswordStrength(e.target.value);
                }}
                style={styles.input}
            />
            {passwordStrength && (
                <div style={styles.strengthContainer}>
                    <p style={styles.strengthText}>
                        비밀번호 강도: <strong style={{ color: getStrengthColor(passwordStrength.score) }}>
                            {["매우 약함", "약함", "보통", "강함", "매우 강함"][passwordStrength.score]}
                        </strong>
                    </p>
                    <div style={styles.barContainer}>
                        <div
                            style={{
                                ...styles.strengthBar,
                                width: `${(passwordStrength.score + 1) * 20}%`,
                                backgroundColor: getStrengthColor(passwordStrength.score),
                            }}
                        ></div>
                    </div>
                    <p style={styles.passText}>
                        {passwordStrength.feedback.suggestions.length > 0
                            ? `권장 사항: ${passwordStrength.feedback.suggestions.join(", ")}`
                            : "좋은 비밀번호입니다!"}
                    </p>
                </div>
            )}

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
                    <p style={styles.resultText}>
                        인증 상태 : <span style={styles.authStatus}>{isAuthenticated ? "Success" : "Failed"}</span>
                    </p>
                    <button onClick={handleDownloadResults} style={styles.button}>
                        결과 다운로드
                    </button>
                </div>
            )}
    
            {commitProgress !== 0 && (
                <div style={styles.progressContainer}>
                    <CircularProgressbar
                        value={commitProgress}
                        text={`${commitProgress}%`}
                        styles={buildStyles({
                            pathColor: getProgressColor(commitProgress),
                            textColor: '#000',
                            trailColor: '#e0e0e0',
                        })}
                        strokeWidth={8}
                        style={{ height: '100px', width: '100px' }}
                    />
                    <br></br>
                </div>
            )}
    
            {isConfirmInProgress && confirmProgress !== 0 && (
                <div style={styles.progressContainer}>
                    <CircularProgressbar
                        value={confirmProgress}
                        text={`${confirmProgress}%`}
                        styles={buildStyles({
                            pathColor: getProgressColor(confirmProgress),
                            textColor: '#000',
                            trailColor: '#e0e0e0',
                        })}
                        strokeWidth={8}
                        style={{ height: '100px', width: '100px' }}
                    />
                    <br></br>
                </div>
            )}
    
        </div>
    );
    
};  

const styles = {
    container: {
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f7fc",
        maxWidth: "600px",
        margin: "auto",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        marginTop: "30px",
        maxHeight: "80vh",
        overflowY: "auto",
    },
    heading: {
        color: "#333",
        fontSize: "24px",
        marginBottom: "20px",
    },
    input: {
        padding: "12px 16px",
        width: "80%",
        marginBottom: "15px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
    },
    button: {
        padding: "12px 24px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#89aace",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        margin: "10px",
        transition: "background-color 0.3s",
    },
    keyContainer: {
        marginBottom: "20px",
    },
    keyLabel: {
        fontSize: "18px",
        color: "#007bff",
        fontWeight: "bold",
    },
    keyValue: {
        fontSize: "16px",
        color: "#555",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "90%",
        margin: "0 auto",
    },
    resultContainer: {
        marginTop: "20px",
        marginBottom: "50px",
    },
    resultText: {
        fontSize: "18px",
        color: "#333",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "90%",
        margin: "0 auto",
    },
    authStatus: {
        fontWeight: "bold",
        color: "#28a745",
    },
    progressContainer: {
        position: 'relative',
        display: 'inline-block',
        width: '200px',
        marginRight: '20px',
    },
    feedbackContainer: {
        position: 'relative',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '10px',
    },
    feedbackText: {
        fontSize: '16px',
        color: '#333',
        fontWeight: 'bold',
    },
    strengthContainer: {
        marginTop: "20px",
        textAlign: "center",
    },
    strengthText: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    passText: {
        fontSize: "14px",
        color: "#555",
        marginTop: "10px",
    },
    barContainer: {
        height: "20px",
        width: "100%",
        backgroundColor: "#e0e0e0",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "10px",
    },
    strengthBar: {
        height: "100%",
        transition: "width 0.3s ease",
        borderRadius: "10px",
    },    
};

export default App;
