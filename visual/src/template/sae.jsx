const SAE = () => {
	return(
		<div>
			<h1>SAE (Simultaneous Authentication of Equals)</h1>
			<hr />
			<div>
				<h2><strong>SAE 란</strong></h2>
				<p>1. <strong>Dictionary Attack 방지</strong></p><br />
				<ul>
					<li>PSK 방식은 암호화된 패킷을 캡처하면 오프라인으로 여러 암호 조합을 대입하여 암호를 추측할 수 있는 Dictionary Attack에 취약</li>
					<li>SAE는 암호화된 키 교환 방식(Diffie-Hellman)을 사용해 이 공격을 방지</li>
				</ul><br />
				<p>2. <strong>Perfect Forward Secrecy (PFS, 순방향 비밀성)</strong></p><br />
				<ul>
					<li>과거에 사용된 세션 키가 유출되더라도, 이후의 세션 트래픽이 안전하게 보호됨</li>
					<li>각 세션마다 고유키가 생성, 이전 세션의 데이터는 보호됨<br />→  키 교환에 임시 값(Ephemeral Key)을 사용하는 ‘ Diffie-Hellman 방식 ‘ 덕분</li>
				</ul><br />
				<p>3. <strong>양방향 인증</strong></p><br />
				<ul>
					<li>PSK는 일방적인 인증 구조지만, SAE는 클라이언트와 AP(Access Point)가 서로를 인증하는 방식</li>
				</ul><br />
				<p>4. <strong>Brute Force 방지</strong></p><br />
				<ul>
					<li>키 교환 중에도 시도 횟수 제한으로 brute force 공격에 대한 추가 방어를 제공</li>
				</ul><br />
				<hr />
			</div>
			<div>
				<h2><strong>SAE 와 PSK 의 차이점</strong></h2>
				<table style="width: 100%; border-collapse: collapse; text-align: left;">
					<thead>
						<tr>
							<th style="border: 1px solid #ccc; padding: 12px; background-color: #f4f7fc;">특징</th>
							<th style="border: 1px solid #ccc; padding: 12px; background-color: #f4f7fc;">PSK</th>
							<th style="border: 1px solid #ccc; padding: 12px; background-color: #f4f7fc;">SAE (WPA3)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="border: 1px solid #ccc; padding: 12px;">키 교환 방식</td>
							<td style="border: 1px solid #ccc; padding: 12px;">고정된 Pre-Shared Key</td>
							<td style="border: 1px solid #ccc; padding: 12px;">Diffie-Hellman 키 교환</td>
						</tr>
						<tr>
							<td style="border: 1px solid #ccc; padding: 12px;">보안성</td>
							<td style="border: 1px solid #ccc; padding: 12px;">Dictionary 및 Brute Force 공격에 취약</td>
							<td style="border: 1px solid #ccc; padding: 12px;">강력한 공격 방어 제공</td>
						</tr>
						<tr>
							<td style="border: 1px solid #ccc; padding: 12px;">Forward Secrecy</td>
							<td style="border: 1px solid #ccc; padding: 12px;">없음</td>
							<td style="border: 1px solid #ccc; padding: 12px;">있음</td>
						</tr>
						<tr>
							<td style="border: 1px solid #ccc; padding: 12px;">양방향 인증</td>
							<td style="border: 1px solid #ccc; padding: 12px;">없음</td>
							<td style="border: 1px solid #ccc; padding: 12px;">있음</td>
						</tr>
						<tr>
							<td style="border: 1px solid #ccc; padding: 12px;">암호화된 키 교환</td>
							<td style="border: 1px solid #ccc; padding: 12px;">없음</td>
							<td style="border: 1px solid #ccc; padding: 12px;">있음</td>
						</tr>
					</tbody>
				</table>
				<hr /><br /><br />
			</div>
			<div>
				<h2><strong>SAE 의 동작 원리</strong></h2>
				<p>SAE 는 <strong>Dragonfly Handshake</strong>를 통해 Diffie-Hellman 기반의 인증과 키 교환을 수행</p>
				<h3>1. Password Element (PE) 생성</h3>
				<ul>
					<li>클라이언트와 액세스 포인트(AP)는 공유된 비밀번호(Passphrase)를 기반으로 동일한 `PE`(Password Element)를 생성</li>
					<li>`PE`는 Diffie-Hellman 키 교환에서 사용되는 기초 값으로, 비밀번호를 직접 사용하지 않고 안전한 방식으로 변환하여 사용</li>
				</ul><br />
				<h3>2. Commit 단계</h3>
				<ul>
					<li>
						클라이언트와 AP는 각각 랜덤한 비밀 값(Private Key)을 생성
						<ul>
							<li>클라이언트의 비밀 값: <code>x_A</code></li>
							<li>AP의 비밀 값: <code>x_R</code></li>
						</ul>
					</li>
					<li>
						이 비밀 값을 사용하여 공개 값(Public Key)을 생성하고 서로 교환
						<ul>
							<li>클라이언트는 <code>M_A = g<sup>x_A</sup> mod p</code>를 AP에 전송</li>
							<li>AP는 <code>M_R = g<sup>x_R</sup> mod p</code>를 클라이언트에 전송</li>
						</ul>
					</li>
					<li>공개 값 교환 시 추가적인 암호화를 통해 키 교환 중의 정보 탈취 방지</li>
				</ul><br />
				<h3>3. Confirm 단계</h3>
					<ul>
						<li>
							클라이언트와 AP는 서로의 공개 값을 확인한 뒤, 동일한 공유 키(Session Key) 생성
						</li>
						<li>이 과정에서 생성된 Session Key는 클라이언트와 AP 간의 암호화된 데이터 통신에 사용됨</li>
					</ul>
			<div/>
			<div>
				<h2>SAE의 암호학적 원리</h2>
				<h3>1. Diffie-Hellman 키 교환</h3>
				<ul>
						<li>클라이언트와 액세스 포인트(AP)는 서로 공개 키를 교환</li>
						<li>각 기기는 상대방의 공개 키를 사용하여 공유 키를 계산</li>
						<li>
						→ 이 과정에서 최종적으로 생성된 공유 키{/* <code>{g^{(x_A x_R)} \mod p}</code>*/}는 제3자가 추측하기 어려운 값으로,
						네트워크 암호화 키로 사용됨
						</li>
					</ul>

					<h3>2. Password Element 변환</h3>
					<ul>
						<li>SAE는 사용자의 비밀번호(Passphrase)를 직접 사용하지 않고, 이를 Password Element(PE)로 변환하여 키 교환의 기본 요소로 활용</li>
						<li>→ 암호학적 해시 함수 및 비밀 값의 결합을 통해 수행되며, 비밀번호의 직접적인 노출을 방지</li>
					</ul>

					<h3>3. 해시 함수 및 랜덤성</h3>
					<ul>
						<li>각 단계에서 보안을 강화하기 위해 SHA-256과 같은 해시 함수가 사용됨
							<ul>
								<li>→ 해시 함수: 입력 데이터를 고정된 크기의 해시 값으로 변환하여, 원본 데이터를 복원할 수 없도록 함</li>
							</ul>
						</li>
						<li>랜덤 값(Nonce)을 사용하여 각 세션마다 고유한 키 생성이 가능하게 하여, 재사용 공격을 방지</li>
					</ul>
			</div>
			</div>
		</div>
	);
}

export default SAE;