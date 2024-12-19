// 미리 설정된 비밀번호
const correctPassword = "TeamLog";

// Dictionary 공격 시뮬레이션 함수
function dictionaryAttack(passwordList) {
    for (let password of passwordList) {
        if (password === correctPassword) {
            return { success: true, guessedPassword: password };
        }
    }
    
    return { success: false }; 
}

export { dictionaryAttack };