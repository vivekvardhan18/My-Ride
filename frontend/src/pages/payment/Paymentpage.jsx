import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PaymentPage.css";

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [method, setMethod] = useState("UPI");
    const [upiId, setUpiId] = useState("");

    if (!state) {
        return (
            <div style={{ padding: "2rem", color: "white", background: "#111", minHeight: "100vh" }}>
                <h2>❌ No Booking Data Found</h2>
                <button onClick={() => navigate("/main")}>Back to Home</button>
            </div>
        );
    }

    const { rideId, taxiType, pickup, dropoff, seats, fare, tripType, distance, name = "Guest" } = state;

    // On payment confirmation navigate to the driver selection page and send booking details,
    // including pickupCoords and dropoffCoords.
    const handlePaymentConfirm = () => {
        navigate("/select-driver", {
            state: {
                rideId,
                taxiType,
                pickup,
                dropoff,
                seats,
                fare,
                tripType,
                distance,
                name,
                pickupCoords: state.pickupCoords,     // sending pickup coordinates
                dropoffCoords: state.dropoffCoords,     // sending dropoff coordinates
                drivers: state.drivers || []            // default to empty array if no drivers provided
            }
        });
    };

    return (
        <div className="payment-container">
            <h2>Confirm Your Ride</h2>
            <div className="ride-details">
                <p><strong>Ride ID:</strong> {rideId}</p>
                <p><strong>Taxi:</strong> {taxiType}</p>
                <p><strong>Trip:</strong> {tripType}</p>
                <p><strong>From:</strong> {pickup}</p>
                <p><strong>To:</strong> {dropoff}</p>
                <p><strong>Seats:</strong> {seats}</p>
                <p><strong>Distance:</strong> {distance} km</p>
                <p><strong>Fare:</strong> ₹{fare}</p>
            </div>

            <h3>Choose Payment Method</h3>
            <div className="payment-options">
                {["UPI", "Cash"].map((opt) => (
                    <button
                        key={opt}
                        className={method === opt ? "selected" : ""}
                        onClick={() => setMethod(opt)}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {method === "UPI" && (
                <div className="upi-section">
                    <label htmlFor="upi-id">Enter UPI ID:</label>
                    <input
                        id="upi-id"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="example@upi"
                    />
                </div>
            )}

            <button
                className="pay-btn"
                onClick={() => {
                    if (method === "Cash") {
                        handlePaymentConfirm();
                    } else if (method === "UPI") {
                        if (upiId.trim() === "") return alert("Please enter UPI ID");
                        handlePaymentConfirm();
                    }
                    // If using Card, add card payment logic here.
                }}
            >
                {method === "Cash" ? "Book Ride (Cash)" : `Pay ₹${fare} Now`}
            </button>
        </div>
    );
};

export default PaymentPage;
