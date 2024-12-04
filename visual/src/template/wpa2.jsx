const wpa2 = () => {
	return(
		<div>
			<h1>WPA2 (Wi-Fi Protected Access 2)</h1>

			<h3>WPA2 란</h3>
			<ul>
				<li>IEEE 802.11i 표준에 기반하여 2004년에 도입된 보안 프로토콜</li>
				<li>취약한 WEP을 대체하기 위해 개발</li>
				<li>불완전한 4방향 핸드셰이크</li>
				<li>PSK(사전 공유키) 사용 시 Wi-Fi 연결을 위험에 노출</li>
			</ul>

			<h3>WPA2-Personal (WPA2-PSK)</h3>
			<ul>
				<li>사전 공유 키 방식을 이용한 인증 방식</li>
				<li>인증 서버가 필요하지 않으며 AP와 단말기 간 키를 공유</li>
				<li>개인이나 소규모 사무실에서 사용하도록 설계됨</li>
			</ul>

			<h3>WPA2-Enterprise (WPA2-EAP)</h3>
			<ul>
				<li>AES(Advanced Encryption Standard)를 사용하여 데이터를 암호화</li>
				<li>PSK(Pre-Shared Key) 방식을 사용하여 인증을 수행</li>
			</ul>
		</div>
	);
}

export default wpa2;