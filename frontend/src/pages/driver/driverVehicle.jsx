import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./driverVehicle.css";

const DriverVehicleForm = () => {
    const [vehicle, setVehicle] = useState({
        carModel: "",
        carNumber: "",
        carType: "basic"
    });

    const navigate = useNavigate();

    // Load current vehicle info on mount
    useEffect(() => {
        const fetchVehicle = async () => {
            const res = await fetch("http://localhost:5000/api/driver/vehicle", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setVehicle({
                    carModel: data.carModel || "",
                    carNumber: data.carNumber || "",
                    carType: data.carType || "basic"
                });
            }
        };

        fetchVehicle();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/driver/vehicle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(vehicle)
        });

        const data = await res.json();
        if (res.ok) {
            alert("Vehicle details saved!");
            navigate("/driver");
        } else {
            alert(data.error || "Failed to save vehicle info");
        }
    };

    return (
        <div className="vehicle-form" style={{ padding: 20, maxWidth: 400, margin: "auto", color: "white" }}>
            <h2>{vehicle.carModel ? "Edit Vehicle Info" : "Add Vehicle Info"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Car Model (e.g., Toyota Etios)"
                    value={vehicle.carModel}
                    onChange={(e) => setVehicle({ ...vehicle, carModel: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Car Number (e.g., KA05AB1234)"
                    value={vehicle.carNumber}
                    onChange={(e) => setVehicle({ ...vehicle, carNumber: e.target.value })}
                    required
                />
                <select
                    value={vehicle.carType}
                    onChange={(e) => setVehicle({ ...vehicle, carType: e.target.value })}
                >
                    <option value="basic">Basic</option>
                    <option value="suv">SUV</option>
                </select>
                <button type="submit" style={{ marginTop: 10 }}>Save</button>
            </form>
        </div>
    );
};

export default DriverVehicleForm;