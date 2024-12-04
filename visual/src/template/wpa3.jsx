const wpa3 = () => {
	return(
		<div>
			<h1>WPA3 (Wi-Fi Protected Access 3)</h1>

			<h3>WPA3 란</h3>
			<ul>
				<li>WPA2의 후속 프로토콜로 2018년에 발표된 암호화 규격</li>
				<li>브라우저가 보안에 취약한 웹 서버(EX 구글 크롬 & 파이어폭스)에 연결하려는 사용자들에게 경고하거나 아예 차단하는 것처럼, 해독되지 않은 새로운 암호화 메커니즘을 사용하면서 오래된 암호화 메커니즘을 폐기</li>
			</ul>

			<h3>WPA3-Personal (WPA3-SAE)</h3>
			<ul>
				<li>기존에 취약한 PSK를 대신하여 새로운 인증 방식인 SAE 도입하여 비밀번호 강도 강화</li>
				<li>순방향 비밀성 (Forward Secrecy) 지원
					<ul>
						<li>데이터 전송 이후 비밀번호가 유출되더라도 이전 세션의 데이터가 보호됨. 각 세션마다 고유한 키 생성</li>
					</ul>
				</li>
				<li>기기들이 네트워크에 같이 연결되어 있어도 서로 데이터를 액세스하기가 힘들어짐</li>
				<li><strong>(EX)</strong> 무선 AP R과 사용자 A, B
					<ul>
						<li>WPA/WPA2 : R-A 사이의 암호화 패킷을 분석해서 R-B 사이의 데이터를 복호화</li>
						<li>WPA3 : 개별적인 암호화 방식을 지원하기 때문에 복호화를 할 수 없음</li>
					</ul>
				</li>
			</ul>

			<h3>WPA3-Enterprise (WPA3-EAP)</h3>
			<ul>
				<li>기존의 견고한 WPA2-Enterprise에서 부족했던 MFP가 필수로 변경되고, SHA-256 해시 알고리즘을 사용하여 인증 강화</li>
				<li>AES-CCMP128 암호화를 동일하게 사용하며 일부 디바이스는 GCMP256 암호화를 지원하기도 한다.</li>
				<li>인증서 유효성 검사 필수</li>
			</ul>
		</div>
	);
}

export default wpa3;