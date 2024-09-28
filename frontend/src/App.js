import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import TouristReg from './pages/touristReg';
import TourGuideReg from './pages/tourGuideReg';
import AdvertiserReg from './pages/advertiserReg';
import SellerReg from './pages/sellerReg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Triptastic!</h1>
        <p>Please register as one of the following:</p>
        <div className="registration-options">
          <button onClick={() => navigate('/tourist-register')}>Register as Tourist</button>
          <button onClick={() => navigate('/tour-guide-register')}>Register as Tour Guide</button>
          <button onClick={() => navigate('/advertiser-register')}>Register as Advertiser</button>
          <button onClick={() => navigate('/seller-register')}>Register as Seller</button>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tourist-register" element={<TouristReg />} />
        <Route path="/tour-guide-register" element={<TourGuideReg />} />
        <Route path="/advertiser-register" element={<AdvertiserReg />} />
        <Route path="/seller-register" element={<SellerReg />} />
      </Routes>
    </Router>
  );
}

export default App;
