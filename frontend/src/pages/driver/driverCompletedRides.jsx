import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DriverCompletedRides.css"; // Import your styles here

const DriverCompletedRides = () => {
  const [completedRides, setCompletedRides] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompletedRides();
  }, []);

  const fetchCompletedRides = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/driver/completed", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCompletedRides(data);
    } catch (err) {
      console.error("Failed to fetch completed rides:", err);
    }
  };

  return (
    <div className="completed-rides-container">
      <h2>✅ Completed Rides</h2>

      {completedRides.length === 0 ? (
        <p className="completed-msg">No completed rides yet.</p>
      ) : (
        completedRides.map((ride) => (
          <div key={ride._id} className="completed-card">
            <h4>Ride ID: {ride.rideId}</h4>
            <p>📍 From: {ride.pickup}</p>
            <p>📍 To: {ride.dropoff}</p>
            <p>💺 Seats: {ride.seats}</p>
            <p>🚖 Type: {ride.taxiType.toUpperCase()}</p>
            <p>💰 Fare: ₹{ride.fare}</p>
            <p>📦 Status: <b>{ride.status}</b></p>
          </div>
        ))
      )}

      <button className="back-button" onClick={() => navigate("/driver")}>
        🔙 Back to Dashboard
      </button>
    </div>
  );
};

export default DriverCompletedRides;