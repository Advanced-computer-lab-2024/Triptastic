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
import TourismGovLogin from './pages/tGovLogin';
import MapPicker from './pages/MapPicker';
import MyLocations from './pages/myLocations';
import MyMuseums from './pages/myMuseums';
import BookFlights from './pages/bookFlights';
import BookHotels from './pages/bookHotels';
import BookTransportation from './pages/bookTransportation';
import Complaints from './pages/Complaints';
import TouristOrders from './pages/touristOrders';
import ActivityDetail from './pages/activityDetail';
import Docs from './pages/docs';
import ItineraryDetail from './pages/itineraryDetails';
import HistoricalDetail from './pages/historicalDetails';
import MuseumDetail from './pages/MuseumDetails';
import { CurrencyProvider } from './pages/CurrencyContext'; // Import the provider from correct path
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';


import AttendedActivitiesPage from './pages/AttendedActivities';
function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="App">
      <header className="App-header">
        
      <div className="header-container">
  <button className="header-button" onClick={() => navigate('/adminLogin')}>Login as Admin</button>
  <button className="header-button" onClick={() => navigate('/tgov-login')}>Login as Tourism Governor</button>
</div>

 
        

        <h1>Welcome to Triptastic!</h1>
        <p>Please register as one of the following:</p>
        <div className="registration-options">
          <button onClick={() => navigate('/tourist-register')}>Register as Tourist</button>
          <button onClick={() => navigate('/tour-guide-register')}>Register as Tour Guide</button>
          <button onClick={() => navigate('/advertiser-register')}>Register as Advertiser</button>
          <button onClick={() => navigate('/seller-register')}>Register as Seller</button>
          <button  onClick={() => navigate('/Guest')}> Continue as Guest </button>
        </div>
        
        {/* Continue as Guest Button */}
        
      </header>
    </div>
  );
}

function App() {
  return (
    <CurrencyProvider>

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
        <Route path="/tgov-login" element={<TourismGovLogin />} />
        <Route path="/advertiser-Activities" element={<AdvertiserActivity />} />
        <Route path="/gov-historical" element={<GovernorH />} />
        <Route path="/gov-museum" element={<GovernorM />} />
        <Route path="/my-locations" element={<MyLocations />} />
        <Route path="/my-museums" element={<MyMuseums />} />
        <Route path="/map-Picker" element={<MapPicker />} />
        <Route path="/book-flights" element={<BookFlights />} />
        <Route path="/book-hotels" element={<BookHotels />} />
        <Route path="/book-transportation" element={<BookTransportation />} />
        <Route path="/Complaints" element={<Complaints/>}/>
        <Route path="/tourist-orders" element={<TouristOrders/>}/>
        <Route path="/activities/:name" element={<ActivityDetail/>} />
        <Route path="/docs" element={<Docs/>}/>        
        <Route path="/itineraries/:id" element={<ItineraryDetail/>} />
        <Route path="/Historical/:Name" element={<HistoricalDetail/>} />
        <Route path="/Museum/:Name" element={<MuseumDetail/>} />
        <Route path="/AttendedActivitiesPage" element={<AttendedActivitiesPage/>}/> 
        <Route path="/Cart" element={<Cart/>} />
        <Route path="/Wishlist" element={<Wishlist/>} />





      </Routes>
    </Router>
    </CurrencyProvider>

  );
}

export default App;
