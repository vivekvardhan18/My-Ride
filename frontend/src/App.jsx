// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Updated imports after placing each page in its own folder
import Start from "./pages/firstScreen/Start";
import Loginpage from "./pages/login/Loginpage";
import Signup from "./pages/login/Signup";
import MainPage from "./pages/mainPage/MainPage";
import CabBookingPage from "./pages/cabBooking/CabBookingPage";
import PaymentPage from "./pages/payment/Paymentpage";
import ConfirmationPage from "./pages/confirmation/ConformationPage";
import BookingsPage from "./pages/bookings/BookingsPage";
import TrackRidePage from "./pages/trackRide/TrackRidePage";
import DriverMainPage from "./pages/driver/driverMainpage";
import SelectDriver from "./pages/driver/selectdriver";
import DriverLiveRide from "./pages/driver/driverLiveRide";
import DriverVehicleForm from "./pages/driver/driverVehicle";
import DriverCompletedRides from "./pages/driver/driverCompletedRides";
import DriverVehicleDetails from "./pages/driver/myVehicles";
import RequestVehicleDetails from "./pages/driver/driverRideRequests";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/book/:type" element={<CabBookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/trackRide" element={<TrackRidePage />} />
        <Route path="/driver" element={<DriverMainPage />} />
        <Route path="/select-driver" element={<SelectDriver />} />
        <Route path="/driver/live" element={<DriverLiveRide />} />
        <Route path="/driver/vehicle" element={<DriverVehicleForm />} />
        <Route path="/driver/completed" element={<DriverCompletedRides />} />
        <Route path="/driver/myVehicle" element={<DriverVehicleDetails />} />
        <Route path="/driver/request" element={<RequestVehicleDetails />} />
      </Routes>
    </Router>
  );
}

export default App;