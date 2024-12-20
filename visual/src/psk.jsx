import { useState } from "react";
import axios from "axios";

const PSK_Dictionary_Attack = () => {
    const [passwordList, setPasswordList] = useState("");  // 문자열로 초기화
    const [result, setResult] = useState(null);
    const [stats, setStats] = useState({ fileSize: 0, complexity: "" });
    const [file, setFile] = useState(null); 

    const handlePasswordInput = (e) => {
        const inputValue = e.target.value;
        setPasswordList(inputValue);  // 문자열로 관리
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result;
                setPasswordList(fileContent.split("\n").map((line) => line.trim()).join(","));
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleDictionaryAttack = async () => {
        const passwords = passwordList
            .split(/[\n,]+/)  // 쉼표나 줄 바꿈을 기준으로 나눔
            .map((pwd) => pwd.trim())
            .filter((pwd) => pwd.length > 0);

        if (passwords.length === 0) {
            alert("비밀번호 리스트가 비어 있습니다. 비밀번호를 입력해주세요.");
            return;
        }

        processPasswords(passwords);
    };
    
    const processPasswords = async (passwords) => {
        try {
            const response = await axios.post("http://localhost:3000/api/dictionary-attack", { passwordList: passwords });
            setResult(response.data);
    
            const fileSize = new Blob([passwords.join(",")]).size; 
            const avgLength = passwords.reduce((acc, pwd) => acc + pwd.length, 0) / passwords.length; 
    
            let complexity = "";
            if (avgLength <= 5) {
                complexity = "낮음";
            } else if (avgLength <= 8) {
                complexity = "중간";
            } else {
                complexity = "높음";
            }
    
            setStats({ fileSize, complexity });
        } catch (error) {
            console.error("Dictionary attack failed:", error);
        }
    };
    
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>PSK Dictionary 공격</h1>
            
            <input
                type="text"
                value={passwordList}
                onChange={handlePasswordInput}
                placeholder="비밀번호 리스트 (쉼표로 구분)"
                style={styles.input}
            />
            
            <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                style={styles.input}
            />

            <button onClick={handleDictionaryAttack} style={styles.button}>
                공격 시작
            </button>

            {stats.fileSize > 0 && (
                <div style={styles.statsContainer}>
                    <p>사전 파일 크기: {stats.fileSize} 바이트</p>
                    <p>비밀번호 복잡도: {stats.complexity}</p>
                </div>
            )}
            {result && (
                <div style={styles.resultContainer}>
                    {result.success ? (
                        <p style={styles.successText}>
                            공격 성공! 추측된 비밀번호: <span style={styles.guessedPassword}>{result.guessedPassword}</span>
                        </p>
                    ) : (
                        <p style={styles.failText}>공격 실패. 비밀번호를 찾지 못했습니다.</p>
                    )}
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
    statsContainer: {
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#e9ecef",
        borderRadius: "8px",
        textAlign: "left",
    },
    resultContainer: {
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #ddd",
    },
    successText: {
        fontSize: "18px",
        color: "#28a745",
        fontWeight: "bold",
    },
    failText: {
        fontSize: "18px",
        color: "#dc3545",
        fontWeight: "bold",
    },
    guessedPassword: {
        color: "#007bff",
    },
};

export default PSK_Dictionary_Attack;
