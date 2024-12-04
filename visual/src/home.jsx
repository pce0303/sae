import { Link } from "react-router-dom";
import './style.css';

const Home = () => {
  return (
    <div className="container">
      <h1 className="title">WPA2/WPA3 와 SAE 시뮬레이터</h1>
      <Link to="https://dent-cattle-c60.notion.site/WPA2-WPA3-SAE-1507f0e96a0c8073981bd83b62108692" target="_blank">
        <button className="button">이론 보러가기</button>
      </Link>
      <Link to="/psk">
        <button className="button">Dictionary Attack 실습</button>
      </Link>
      <Link to="/sae">
        <button className="button">SAE 시뮬레이터</button>
      </Link>
    </div>
  );
}

export default Home;
