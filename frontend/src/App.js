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
import EditProducts from './pages/EditProducts';
import UserStatistics from './pages/chart';
import Flaged from './pages/flagged';
import ManagementPage from './pages/manage';
import Adminprod from './pages/products_admin';
import Sellerprod from './pages/products_seller';
import Adminn from './pages/admincontrol';
import SellerProduct from './pages/sellerProduct';



const stripePromise = loadStripe('pk_test_51QPR4CHmIrhpZsCUkNDleRBlZDavN3bJ0zSGja0odQdTv8F6suSp02Cyx2sOVDyTbxi4J7Yqrnj7kQMwlu2LbwaU00pnINWNUs');
stripePromise.then((stripe) => console.log('Stripe initialized:', stripe));



const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect all users to the Guest page
    navigate('/Guest');
  }, [navigate]);

  return null; // Optionally, you can show a loader or empty screen during redirection
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
            <Route path="/advertiserReport" element={<AdvertiserReport />} />
            <Route path="/sellerReport" element={<SellerReport />} />
            <Route path="/my-itineraries" element={<TourGItinerary />} />
            <Route path="/adminReport" element={<AdminReport />} />
            <Route path="/DeletionRequest" element={<DeletionRequests />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/EditProducts" element={<EditProducts />} />
            <Route path="/chart" element={<UserStatistics />} />
            <Route path="/flagged" element={<Flaged />} />
            <Route path="/manage" element={<ManagementPage />} />
            <Route path="/products_seller" element={<Sellerprod />} />
            <Route path="/products_admin" element={<Adminprod />} />
            <Route path="/sellerProduct" element={<SellerProduct />} />
            <Route path="/admincontrol" element={<Adminn />} />
          </Routes>
        </Router>
      </Elements>
    </CurrencyProvider>
  );
}



export default App;
