import './App.css';
import React, { useContext, useEffect, useState } from 'react';

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
import Checkout from './pages/checkout'
import Wishlist from './pages/Wishlist';
import PromoCodeForm from './pages/PromoCodeForm';
import TouristSettings from './pages/touristsettings';
import BookmarkedEvents from './pages/BookmarkedEvents';
import PaymentPage from './pages/Payment';
import GuideReport from './pages/guideReport';
import AdvertiserReport from './pages/advertiserReport';
import SellerReport from './pages/sellerReport';
import AdminReport from './pages/adminReport';
import { Elements } from '@stripe/react-stripe-js'; // Import Elements from Stripe
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe
import AttendedActivitiesPage from './pages/AttendedActivities';
import Preftags from './pages/preftags';
import CreateTransportation from './pages/createTransportation';
import Category from './pages/category';
import TourGItinerary from './pages/TourGItinerary';
import background from './images/back.webp'; // Replace with the path to your image 
import DeletionRequests from './pages/DeletionRequest';
import AddProduct from './pages/AddProduct';





const stripePromise = loadStripe('pk_test_51QPR4CHmIrhpZsCUkNDleRBlZDavN3bJ0zSGja0odQdTv8F6suSp02Cyx2sOVDyTbxi4J7Yqrnj7kQMwlu2LbwaU00pnINWNUs');
stripePromise.then((stripe) => console.log('Stripe initialized:', stripe));



function Home() {
  const [animatedText, setAnimatedText] = useState('');
  const fullText = 'Trriptastic'; // The full word to display
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length-1) {
        setAnimatedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200); // Delay for each letter (200ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <header style={styles.header}>
        {/* Animated Welcome Message */}
        <h1 style={styles.title}>
          Welcome to <span style={styles.highlight}>{animatedText}</span>
        </h1>

        {/* Dropdown List for Roles */}
        <div style={styles.content}>
          <p style={styles.description}>Select your role to start your Adventure!</p>
          <select
            onChange={(e) => navigate(e.target.value)} // Navigate to the selected page
            style={styles.dropdown}
          >
            <option value="">-- Choose a Role --</option>
            <option value="/adminLogin">Admin</option>
            <option value="/advertiser-register">Advertiser</option>
            <option value="/seller-register">Seller</option>
            <option value="/tourist-register">Tourist</option>
            <option value="/tgov-login">Tourism Governor</option>
            <option value="/tour-guide-register">Tour Guide</option>
          </select>
          <button style={styles.button} onClick={() => navigate('/Guest')}>
           or Continue as Guest
          </button>
        </div>
      </header>
    </div>
  );
};


function App() {
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);

  useEffect(() => {
    stripePromise.then(() => setIsStripeLoaded(true));
  }, []);

  if (!isStripeLoaded) {
    return <div>Loading Stripe...</div>;  // Show a loading state until Stripe is loaded
  }

  return (
    <CurrencyProvider>
      <Elements stripe={stripePromise}>  {/* Wrap your app or specific routes with Elements provider */}
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
            <Route path="/Complaints" element={<Complaints />} />
            <Route path="/tourist-orders" element={<TouristOrders />} />
            <Route path="/activities/:name" element={<ActivityDetail />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/itineraries/:id" element={<ItineraryDetail />} />
            <Route path="/Historical/:Name" element={<HistoricalDetail />} />
            <Route path="/Museum/:Name" element={<MuseumDetail />} />
            <Route path="/AttendedActivitiesPage" element={<AttendedActivitiesPage />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            <Route path="/PromoCodeForm" element={<PromoCodeForm />} />
            <Route path="/TouristSettings" element={<TouristSettings />} />
            <Route path="/BookmarkedEvents" element={<BookmarkedEvents />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/GuideReport" element={<GuideReport />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/preftags" element={<Preftags />} />
            <Route path="/createTransportation" element={<CreateTransportation />} />
            <Route path="/category" element={<Category />} />
            <Route path="/dvertiserReport" element={<AdvertiserReport />} />
            <Route path="/sellerReport" element={<SellerReport />} />
            <Route path="/my-itineraries" element={<TourGItinerary />} />
            <Route path="/adminReport" element={<AdminReport />} />
            <Route path="/DeletionRequest" element={<DeletionRequests />} />
            <Route path="/AddProduct" element={<AddProduct />} />

          </Routes>
        </Router>
      </Elements>
    </CurrencyProvider>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundImage: `url(${background})`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for contrast
    zIndex: 1,
  },
  header: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  highlight: {
    color: '#197B4D',
  },
  content: {
    marginTop: '20px',
  },
  description: {
    color:'white',
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  dropdown: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#197B4D',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
};

export default App;
