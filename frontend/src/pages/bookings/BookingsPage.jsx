import { useEffect, useState } from "react";
import "./BookingsPage.css";

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchBookings = async () => {
            const res = await fetch("http://localhost:5000/api/bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setBookings(data);
            } else {
                alert(data.error || "Failed to fetch bookings");
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="bookings-container">
            <h2>Your Bookings</h2>
            <div className="bookings-content-wrapper">
                {bookings.length === 0 ? (
                    <p>No bookings yet.</p>
                ) : (
                    bookings.map((b, i) => (
                        <div className="booking-card" key={i}>
                            <p><strong>Ride ID:</strong> {b.rideId}</p>
                            <p><strong>From:</strong> {b.pickup}</p>
                            <p><strong>To:</strong> {b.dropoff}</p>
                            <p><strong>Taxi:</strong> {b.taxiType}</p>
                            <p><strong>Fare:</strong> ₹{b.fare}</p>
                            <p><strong>Trip:</strong> {b.tripType}</p>
                            <p><strong>Seats:</strong> {b.seats}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookingsPage;