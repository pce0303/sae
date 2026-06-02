# SAE Simulator

> WPA2/WPA3 인증 방식 비교 및 SAE 키 교환 시뮬레이터

## 📌 프로젝트 소개

SAE Simulator는 WPA2와 WPA3의 인증 방식 차이를 웹에서 실습할 수 있도록 만든 네트워크 보안 학습용 프로젝트입니다. PSK 방식에서 발생할 수 있는 Dictionary Attack 과정을 확인하고, WPA3에서 사용되는 SAE 방식의 Commit/Confirm 단계를 시뮬레이션하여 인증 흐름을 이해할 수 있도록 구현했습니다.

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Express.js, Node.js |
| Network/Security | SAE, PSK, Diffie-Hellman, PBKDF2, Salt |
| Library | Axios, Crypto, zxcvbn, React Circular Progressbar |
| Tool | Git, GitHub |

## ✨ 주요 기능

### PSK Dictionary Attack

- 비밀번호 리스트 직접 입력
- `.txt` 파일 업로드를 통한 비밀번호 리스트 입력
- Dictionary Attack 실행
- 공격 성공 여부 및 추측된 비밀번호 확인
- 사전 파일 크기 및 비밀번호 복잡도 표시

### SAE Commit / Confirm Simulation

- 8자 이상 비밀번호 입력
- 비밀번호 강도 측정
- Salt 생성
- Diffie-Hellman 공개 키 생성
- Commit 단계 진행률 표시
- Confirm 단계 진행률 표시
- 공유 키 생성 및 인증 결과 확인
- 인증 결과 JSON 다운로드

## 🧩 담당 및 구현 내용

- React 기반 PSK/SAE 시뮬레이션 화면 구현
- Express API 서버 구축
- PSK Dictionary Attack API 구현
- SAE Commit/Confirm 단계 API 구현
- Diffie-Hellman 키 교환과 PBKDF2 기반 키 생성 흐름 구현
- 진행률 표시와 결과 다운로드 기능을 통해 인증 과정을 시각화
