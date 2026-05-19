import React, { useEffect, useState } from "react";
import MapView from "../../components/Mapview"; // non-Google Leaflet Map
// import "./DriverRideRequests.css";

const DriverRideRequests = () => {
    const [requests, setRequests] = useState([]);
    const [acceptedRide, setAcceptedRide] = useState(null);
    const token = localStorage.getItem("token");

    // Poll every 5 seconds
    useEffect(() => {
        const fetchRequests = async () => {
            const res = await fetch("http://localhost:5000/api/bookings/pending", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setRequests(data);
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const respondToRequest = async (rideId, accept) => {
        const res = await fetch("http://localhost:5000/api/driver/respond", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rideId, accept })
        });

        const data = await res.json();
        if (res.ok && accept) {
            setAcceptedRide(data.booking); // show map
        } else {
            alert(data.message || "Response saved");
        }
    };

    return (
        <div className="driver-ride-page">
            <h2>Incoming Ride Requests</h2>

            {!acceptedRide ? (
                requests.length > 0 ? (
                    requests.map((req) => (
                        <div className="request-card" key={req.rideId}>
                            <p><b>Ride ID:</b> {req.rideId}</p>
                            <p><b>Pickup:</b> {req.pickup}</p>
                            <p><b>Dropoff:</b> {req.dropoff}</p>
                            <p><b>Fare:</b> ₹{req.fare}</p>
                            <button onClick={() => respondToRequest(req.rideId, true)}>✅ Accept</button>
                            <button onClick={() => respondToRequest(req.rideId, false)}>❌ Reject</button>
                        </div>
                    ))
                ) : (
                    <p>No new requests.</p>
                )
            ) : (
                <div className="accepted-info">
                    <h3>Accepted Ride: {acceptedRide.rideId}</h3>
                    <p>Pickup: {acceptedRide.pickup}</p>
                    <MapView pickupCoords={acceptedRide.pickupCoords} />
                </div>
            )}
        </div>
    );
};

export default DriverRideRequests;