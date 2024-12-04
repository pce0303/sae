import { useState } from "react";
import axios from "axios";
import DHVisualization from './DHV';

const App = () => {
    const [password, setPassword] = useState("");
    const [clientPublicKey, setClientPublicKey] = useState("");
    const [serverPublicKey, setServerPublicKey] = useState("");
    const [sharedKey, setSharedKey] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [salt, setSalt] = useState("");
    const [commitData, setCommitData] = useState(null);

    const handleCommit = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/sae/commit", { password });
            const { clientPublicKey, serverPublicKey, salt, clientCommit, serverCommit } = response.data;
            setClientPublicKey(clientPublicKey);
            setServerPublicKey(serverPublicKey);
            setSalt(salt);
            setCommitData({ clientCommit, serverCommit });
        } catch (error) {
            console.error("Error during commit:", error);
        }
    };

    const handleConfirm = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/sae/confirm", {
                clientPublicKey,
                serverPublicKey,
                salt
            });
            setSharedKey(response.data.sharedKey);
            setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
            console.error("Error during confirm:", error);
        }
    };

    return (
        <>
        <div style={styles.container}>
            <h1 style={styles.heading}>SAE Simulator</h1>
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleCommit} style={styles.button}>
                Start Commit Stage
            </button>

            {clientPublicKey && serverPublicKey && (
                <>
                    <div style={styles.keyContainer}>
                        <p style={styles.keyLabel}>Client Public Key:</p>
                        <p style={styles.keyValue}>{clientPublicKey.substring(0, 40)}...</p>
                        <p style={styles.keyLabel}>Server Public Key:</p>
                        <p style={styles.keyValue}>{serverPublicKey.substring(0, 40)}...</p>
                    </div>
                    <button onClick={handleConfirm} style={styles.button}>
                        Start Confirm Stage
                    </button>
                </>
            )}
            
            {sharedKey && (
                <div style={styles.resultContainer}>
                    <p style={styles.keyLabel}>Shared Key:</p>
                    <p style={styles.keyValue}>{sharedKey.substring(0, 40)}...</p>
                    <br />
                    <p style={styles.resultText}>
                        Authentication Status: <span style={styles.authStatus}>{isAuthenticated ? "Success" : "Failed"}</span>
                    </p>
                    <br />
                </div>
            )}

            {sharedKey && clientPublicKey && serverPublicKey && (
                <DHVisualization
                    clientPublicKey={clientPublicKey}
                    serverPublicKey={serverPublicKey}
                    sharedKey={sharedKey}
                    commitData={commitData}
                />
            )}
        </div>
        <br />
        </>
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
    keyContainer: {
        marginBottom: "20px",
    },
    keyLabel: {
        fontSize: "18px",
        color: "#007bff", // Blue color for labels
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
        paddingTop: "15px",
        borderTop: "1px solid #ddd",
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
        color: "#28a745", // Green for success, red for failure (will be handled later)
    }
};

export default App;
