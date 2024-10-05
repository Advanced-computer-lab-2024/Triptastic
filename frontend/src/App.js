import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import TouristReg from './pages/touristReg';
import TourGuideReg from './pages/tourGuideReg';
import AdvertiserReg from './pages/advertiserReg';
import SellerReg from './pages/sellerReg';
import SellerProfile from './pages/sellerProfile';
import AdvertiserProfile from './pages/advertiserProfile';
import TouristProfile from './pages/touristProfile';
import TourGuideProfile from './pages/tourGuideProfile';
import HistoricalLocations from './pages/historicalLocations';
import Museums from './pages/Museums';
import Products from './pages/Products';
import Itineraries from './pages/Itineraries';
import AdminPage from './pages/adminPage';
import AdminLogin from './pages/adminLogin';
import GovernorH from './pages/govH';
import Activities from './pages/Activities';
import Guest from './pages/Guest';
import AdvertiserActivity from './pages/advertiserActivities';

import GovernorM from './pages/govM';
import TourismGov from './pages/tourismGov';

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="App">
      <header className="App-header">
        <button className="admin-login-btn" onClick={() => navigate('/adminLogin')}>
          Login as Admin
        </button>

        <h1>Welcome to Triptastic!</h1>
        <p>Please register as one of the following:</p>
        <div className="registration-options">
          <button onClick={() => navigate('/tourist-register')}>Register as Tourist</button>
          <button onClick={() => navigate('/tour-guide-register')}>Register as Tour Guide</button>
          <button onClick={() => navigate('/advertiser-register')}>Register as Advertiser</button>
          <button onClick={() => navigate('/seller-register')}>Register as Seller</button>
        </div>
        
        {/* Continue as Guest Button */}
        <button className="continue-guest-btn" onClick={() => navigate('/Guest')}>
          Continue as Guest
        </button>
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
        <Route path="/seller-profile" element={<SellerProfile />} />
        <Route path="/advertiser-profile" element={<AdvertiserProfile />} />
        <Route path="/tourist-profile" element={<TouristProfile />} />
        <Route path="/tour-guide-profile" element={<TourGuideProfile />} />
        <Route path="/historical-locations" element={<HistoricalLocations />} />
        <Route path="/museums" element={<Museums />} />
        <Route path="/products" element={<Products />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/tourism-gov" element={<TourismGov />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/guest" element={<Guest />} />      
          <Route path="/advertiser-Activities" element={<AdvertiserActivity />} />

        <Route path="/gov-historical" element={<GovernorH />} />
        <Route path="/gov-museum" element={<GovernorM />} />
      </Routes>
    </Router>
  );
}

export default App;
