import { styles } from './style';
import { getStrengthColor } from './utils';

const PasswordStrength = ({ passwordStrength }) => {
    if (!passwordStrength) return null;

    return (
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
    );
};

export default PasswordStrength;
