import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapView from "../../components/Mapview2";

const DriverLiveRide = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const {
        rideId,
        pickup,
        pickupCoords,
        dropoffCoords,
        routePath
    } = state || {};

    const handleComplete = async () => {
        const res = await fetch(`http://localhost:5000/api/driver/complete/${rideId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();
        if (res.ok) {
            alert("Ride completed!");
            navigate("/driver");
        } else {
            alert(data.error || "Failed to complete ride");
        }
    };

    return (
        <div style={{ padding: 20, color: "white" }}>
            <h2>Live Ride View</h2>
            <p><b>Pickup:</b> {pickup}</p>
            <MapView
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
                routePath={routePath}
            />
            <button
                onClick={handleComplete}
                style={{
                    marginTop: 20,
                    padding: 10,
                    background: "#ffd700",
                    border: "none",
                    fontWeight: "bold",
                    borderRadius: 6
                }}
            >
                ✅ Complete Ride
            </button>
        </div>
    );
};

export default DriverLiveRide;