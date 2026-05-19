import { useLocation, useNavigate } from "react-router-dom";
import "./ConfirmationPage.css";

const ConfirmationPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const rideId = state?.rideId || "RIDE000000";
    const name = state?.name || "Guest";
    const taxiType = state?.taxiType || "Basic";
    const estimatedTime = taxiType === "SUV" ? "10 minutes" : "15 minutes";

    return (
        <div className="confirmation-container">
            <div className="checkmark">✅</div>
            <h2>Ride Confirmed!</h2>
            <p>Thank you, <strong>{name}</strong>. Your ride has been successfully booked.</p>
            <p><strong>Ride ID:</strong> {rideId}</p>
            <p><strong>Estimated Arrival:</strong> {estimatedTime}</p>

            <button className="track-btn" onClick={() => alert("Tracking feature coming soon!")}>Track Your Cab 🚗🛰</button>
            <button className="home-btn" onClick={() => navigate("/main")}>Back to Home</button>
        </div>
    );
};

export default ConfirmationPage;