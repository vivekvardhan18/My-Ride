import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./driverMainpage.css";

const DriverMainPage = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    await fetch("http://localhost:5000/api/driver/location", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ lat: latitude, lng: longitude }),
                    });
                } catch (err) {
                    console.error("❌ Location update failed:", err);
                }
            },
            (err) => {
                console.error("❌ Geolocation error:", err);
            }
        );
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/driver/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setBookings(data);
            } else {
                // Inject dummy request if no real data found
                setBookings([
                    {
                        _id: "dummy123",
                        rideId: "RIDEDEMO123",
                        pickup: "Demo Pickup Location",
                        dropoff: "Demo Drop-off Location",
                        pickupCoords: [23.2599, 77.4126],
                        dropoffCoords: [23.2675, 77.4399],
                        taxiType: "basic",
                        seats: 2,
                        fare: 150,
                        status: "pending",
                    },
                ]);
            }
        } catch (err) {
            console.error("❌ Failed to fetch bookings:", err);
        }
    };

    const updateStatus = async (rideId, action) => {
        // Skip real API for dummy
        if (rideId === "RIDEDEMO123") {
            alert(`Dummy ride ${action}ed`);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/driver/${action}/${rideId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert(`Ride ${action}ed.`);
                fetchBookings();
            } else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        } catch (err) {
            console.error("❌ Status update error:", err);
        }
    };

    useEffect(() => {
        updateLocation();
        const locationInterval = setInterval(updateLocation, 30000);
        fetchBookings();
        const bookingInterval = setInterval(fetchBookings, 5000);
        return () => {
            clearInterval(locationInterval);
            clearInterval(bookingInterval);
        };
    }, [token]);

    return (
        <div className="driver-container" style={{ padding: 20 }}>
            <h2 className="driver-title">📋 Assigned Rides</h2>

            {bookings.length === 0 ? (
                <p className="empty-msg">No bookings yet.</p>
            ) : (
                bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="booking-card"
                        style={{
                            background: "#222",
                            padding: 15,
                            borderRadius: 10,
                            marginBottom: 15,
                            color: "white",
                        }}
                    >
                        <h4>🚘 Ride ID: {booking.rideId}</h4>
                        <p>Taxi Type: <b>{booking.taxiType?.toUpperCase()}</b></p>
                        <p>🧍 Seats: {booking.seats}</p>
                        <p>📍 From: {booking.pickup}</p>
                        <p>📍 To: {booking.dropoff}</p>
                        <p>💰 Fare: ₹{booking.fare}</p>
                        <p>Status: <b>{booking.status}</b></p>

                        <div className="action-buttons" style={{ marginTop: 10 }}>
                            {booking.status === "pending" && (
                                <>
                                    <button onClick={() => updateStatus(booking.rideId, "accept")}>✅ Accept</button>
                                    <button onClick={() => updateStatus(booking.rideId, "reject")}>❌ Reject</button>
                                </>
                            )}
                            {booking.status === "accepted" && (
                                <button
                                    onClick={() =>
                                        navigate("/driver/live", {
                                            state: {
                                                rideId: booking.rideId,
                                                pickup: booking.pickup,
                                                pickupCoords: booking.pickupCoords,
                                                dropoffCoords: booking.dropoffCoords,
                                            },
                                        })
                                    }
                                >
                                    🗺️ Go to Live Map
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}

            <div className="nav-buttons" style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => navigate("/driver/vehicle")}>🚗 Add Vehicle</button>
                <button onClick={() => navigate("/driver/myVehicle")}>📋 Vehicle Info</button>
                <button onClick={() => navigate("/driver/request")}>📨 View Requests</button>
                <button onClick={() => navigate("/")}>🏠 Back to Home</button>
                <button onClick={() => navigate("/driver/completed")}>✅ Completed Rides</button>
            </div>
        </div>
    );
};

export default DriverMainPage;



