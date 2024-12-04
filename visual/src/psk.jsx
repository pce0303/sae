import { useState } from "react";
import axios from "axios";

const PSK_Dictionary_Attack = () => {
    const [passwordList, setPasswordList] = useState("");
    const [result, setResult] = useState(null);

    const handleDictionaryAttack = async () => {
        const passwords = passwordList.split(",");
        const response = await axios.post("http://localhost:3000/api/dictionary-attack", { passwordList: passwords });
        setResult(response.data);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>PSK Dictionary 공격</h1>
            <input
                type="text"
                value={passwordList}
                onChange={(e) => setPasswordList(e.target.value)}
                placeholder="비밀번호 리스트 (쉼표로 구분)"
                style={styles.input}
            />
            <button onClick={handleDictionaryAttack} style={styles.button}>
                공격 시작
            </button>
            {result && (
                <div style={styles.resultContainer}>
                    {result.success ? (
                        <p style={styles.successText}>공격 성공! 추측된 비밀번호: <span style={styles.guessedPassword}>{result.guessedPassword}</span></p>
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
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        margin: "10px",
        transition: "background-color 0.3s",
    },
    resultContainer: {
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #ddd",
    },
    successText: {
        fontSize: "18px",
        color: "#28a745", // Green for success
        fontWeight: "bold",
    },
    failText: {
        fontSize: "18px",
        color: "#dc3545", // Red for failure
        fontWeight: "bold",
    },
    guessedPassword: {
        color: "#007bff",
    },
};

export default PSK_Dictionary_Attack;
