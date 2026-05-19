import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myVehicles.css"

const DriverVehicleDetails = () => {
    const [vehicle, setVehicle] = useState({});
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicleDetails();
    }, []);

    const fetchVehicleDetails = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/driver/vehicle", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setVehicle(data);
            } else {
                alert(data.error || "No vehicle details found.");
            }
        } catch (err) {
            console.error("Failed to fetch vehicle details:", err);
        }
    };

    return (
        <div className="vehicle-container" style={{ padding: 20, color: "white" }}>
            <h2>🚗 My Vehicle Info</h2>

            {vehicle.carModel ? (
                <div className="vehicle-details">
                    <p><b>Car Model:</b> {vehicle.carModel}</p>
                    <p><b>Car Number:</b> {vehicle.carNumber}</p>
                    <p><b>Car Type:</b> {vehicle.carType}</p>
                </div>
            ) : (
                <p>No vehicle information found. Please update your vehicle details.</p>
            )}

            <button onClick={() => navigate("/driver/vehicle")} style={{ marginTop: 20 }}>
                🔄 Update Vehicle Info
            </button>
        </div>
    );
};

export default DriverVehicleDetails;