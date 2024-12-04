import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SAE from './sae';
import PSK from './psk';
import Home from './home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sae" element={<SAE />} />
        <Route path="/psk" element={<PSK />} />
      </Routes>
    </Router>
  );
}

export default App;
