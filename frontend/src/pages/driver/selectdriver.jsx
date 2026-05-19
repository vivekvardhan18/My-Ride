import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SelectDriver = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [rideId, setRideId] = useState(null);

    const {
        pickup,
        dropoff,
        pickupCoords,
        dropoffCoords,
        routeInfo,
        taxiType,
        tripType = "oneway",
        seats = 1,
        fare,
        name = "Guest"
    } = state || {};

    // Fetch nearby drivers
    useEffect(() => {
        const fetchNearbyDrivers = async () => {
            if (!pickupCoords) return;
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `http://localhost:5000/api/driver/nearby?lat=${pickupCoords[0]}&lng=${pickupCoords[1]}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (res.ok) setDrivers(data || []);
            } catch (err) {
                console.error("Error fetching drivers:", err);
            }
        };
        fetchNearbyDrivers();
    }, [pickupCoords]);

    // Request a ride and confirm automatically after 10 seconds
    const requestDriver = async (driver) => {
        setWaiting(true);
        setSelectedDriverId(driver._id);
        const generatedRideId = "RIDE" + Math.floor(100000 + Math.random() * 900000);
        setRideId(generatedRideId);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rideId: generatedRideId,
                    pickup,
                    dropoff,
                    pickupCoords,
                    dropoffCoords,
                    taxiType,
                    fare,
                    tripType,
                    seats,
                    driverId: driver._id,
                    distance: routeInfo?.distance,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                // Automatically confirm ride after 10 seconds
                setTimeout(() => {
                    navigate("/confirmation", {
                        state: {
                            rideId: generatedRideId,
                            pickup,
                            dropoff,
                            taxiType,
                            seats,
                            fare,
                            name,
                        },
                    });
                }, 5000); // 10 seconds
            } else {
                alert("❌ Failed to request ride.");
                setWaiting(false);
            }
        } catch (err) {
            console.error("Booking error:", err);
            setWaiting(false);
        }
    };

    return (
        <div style={{ padding: 30, color: "white", textAlign: "center" }}>
            <h2>Select a Driver</h2>
            {waiting && (
                <p style={{ color: "orange" }}>⏳ Waiting for the response...</p>
            )}

            {drivers.length === 0 ? (
                <p>No nearby drivers found.</p>
            ) : (
                drivers.map((driver) => (
                    <div
                        key={driver._id}
                        style={{
                            background: "#222",
                            padding: 15,
                            margin: "20px auto",
                            width: "80%",
                            borderRadius: "12px",
                            opacity: waiting && selectedDriverId !== driver._id ? 0.5 : 1,
                        }}
                    >
                        <h3>{driver.name}</h3>
                        <p>🚗 {driver.vehicle?.carModel || "N/A"}</p>
                        <button
                            disabled={waiting}
                            onClick={() => requestDriver(driver)}
                            style={{
                                marginTop: 10,
                                padding: "10px 20px",
                                backgroundColor: "#ffd700",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "bold",
                            }}
                        >
                            Request This Driver
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SelectDriver;



