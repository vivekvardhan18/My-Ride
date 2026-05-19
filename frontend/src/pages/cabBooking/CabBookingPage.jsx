import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CabBookingPage.css";
import taxiImage from "../../assets/taxi.png";
import taxiImage2 from "../../assets/taxi 2.png";

const CabBookingPage = () => {
    const { type } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [selectedTaxi, setSelectedTaxi] = useState(type || "basic");
    const [selectedSeat, setSelectedSeat] = useState(1);
    const [tripType, setTripType] = useState("oneway");

    const taxiInfo = {
        basic: {
            type: "Basic",
            arrival: "Will arrive in 15 mins",
            rating: "4.2 ★",
            ratePerKm: 6,
            seatCount: 4,
        },
        suv: {
            type: "SUV",
            arrival: "Will arrive in 10 mins",
            rating: "4.8 ★",
            ratePerKm: 10,
            seatCount: 6,
        },
    };

    const currentTaxi = taxiInfo[selectedTaxi];
    const distance = parseFloat(state?.routeInfo?.distance || 0);
    const finalDistance = tripType === "round" ? distance * 2 : distance;
    const baseFare = currentTaxi.ratePerKm * finalDistance;
    const seatFare = selectedSeat * 1.5 * finalDistance;
    const totalFare = Math.round(baseFare + seatFare);

    const confirmBooking = async () => {
        const token = localStorage.getItem("token");

        const bookingData = {
            pickup: state?.pickup,
            dropoff: state?.dropoff,
            pickupCoords: state?.pickupCoords,
            dropoffCoords: state?.dropoffCoords,
            taxiType: selectedTaxi,
            seats: selectedSeat,
            fare: totalFare,
            tripType,
            distance: finalDistance,
        };

        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const data = await res.json();

            if (res.ok) {
                navigate("/payment", {
                    state: {
                        ...bookingData,
                        rideId: data.rideId,
                        name: localStorage.getItem("name") || "Guest"
                    }
                });
            } else {
                alert("Booking failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Something went wrong while booking.");
        }
    };

    return (
        <div className="cab-booking-container">
            <div className="booking-card">
                <div className="header-container">
                    <div className="back" onClick={() => navigate(-1)}>←</div>
                    <h3 className="header-title">Book Now</h3>
                </div>

                <div className="taxi-selection">
                    <button className={`taxi-button ${selectedTaxi === "basic" ? "selected" : ""}`} onClick={() => setSelectedTaxi("basic")}>
                        <img src={taxiImage} alt="Basic" className="taxi-img taxi-img-large" />
                    </button>
                    <button className={`taxi-button ${selectedTaxi === "suv" ? "selected" : ""}`} onClick={() => setSelectedTaxi("suv")}>
                        <img src={taxiImage2} alt="SUV" className="taxi-img taxi-img-large move-up" />
                    </button>
                </div>

                <div className="taxi-info">
                    <div className="left">
                        <h3>Taxi <span className="type">({currentTaxi.type})</span></h3>
                        <p>{currentTaxi.arrival}</p>
                    </div>
                    <div className="right"><span className="rating">{currentTaxi.rating}</span></div>
                </div>

                <div className="route-box">
                    <div className="route"><span className="label">A</span><p>{state?.pickup || "Pickup location"}</p></div>
                    <div className="route"><span className="label">B</span><p>{state?.dropoff || "Drop location"}</p></div>
                </div>

                <div className="stats">
                    <div className="stat">{finalDistance} km</div>
                    <div className="stat">{state?.routeInfo?.duration || "0"} mins</div>
                    <div className="stat">₹{totalFare}</div>
                </div>

                <h4 className="section-title">Seats</h4>
                <div className="seats">
                    {Array.from({ length: currentTaxi.seatCount }, (_, i) => i + 1).map((seat) => (
                        <button key={seat} className={`seat ${selectedSeat === seat ? "selected" : ""}`} onClick={() => setSelectedSeat(seat)}>
                            {seat}
                        </button>
                    ))}
                </div>

                <h4 className="section-title">Trip Type</h4>
                <div className="trip-type">
                    <button className={`trip-btn ${tripType === "oneway" ? "selected" : ""}`} onClick={() => setTripType("oneway")}>
                        One-way Trip
                    </button>
                    <button className={`trip-btn ${tripType === "round" ? "selected" : ""}`} onClick={() => setTripType("round")}>
                        Round Trip
                    </button>
                </div>

                <button className="book-btn" onClick={confirmBooking}>
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default CabBookingPage;