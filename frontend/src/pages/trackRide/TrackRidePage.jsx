import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./TrackRidePage.css";

const TrackRidePage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const bookingId = state?.bookingId || "RIDE000000";
    const pickup = state?.pickup || [23.2599, 77.4126]; // Default Bhopal
    const drop = state?.drop || [23.2000, 77.0833]; // Default Sehore

    const [cabPositionIndex, setCabPositionIndex] = useState(0);
    const [cabPath, setCabPath] = useState([pickup, drop]);
    const [cabPosition, setCabPosition] = useState(pickup);

    useEffect(() => {
        const steps = 30;
        const interpolated = [];
        for (let i = 0; i <= steps; i++) {
            const lat = pickup[0] + ((drop[0] - pickup[0]) * i) / steps;
            const lng = pickup[1] + ((drop[1] - pickup[1]) * i) / steps;
            interpolated.push([lat, lng]);
        }
        setCabPath(interpolated);
        setCabPosition(interpolated[0]);
    }, [pickup, drop]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCabPositionIndex((prev) => {
                const next = prev + 1;
                if (next >= cabPath.length) return 0;
                setCabPosition(cabPath[next]);
                return next;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [cabPath]);

    const taxiIcon = new L.Icon({
        iconUrl: "https://img.icons8.com/emoji/48/taxi.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    return (
        <div className="track-container">
            <h2>Live Tracking</h2>
            <p>
                Tracking Ride ID: <strong>{bookingId}</strong>
            </p>

            <div className="map-placeholder">
                <MapContainer center={pickup} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={pickup} />
                    <Marker position={drop} />
                    <Polyline pathOptions={{ color: "gold" }} positions={cabPath} />
                    <Marker position={cabPosition} icon={taxiIcon} />
                </MapContainer>
            </div>

            <div className="tracking-info">
                <p>
                    Estimated Arrival: <strong>7 min</strong>
                </p>
                <p>
                    Distance Left: <strong>2.1 km</strong>
                </p>
                <p>
                    Status: <strong>Driver en route to pickup</strong>
                </p>
            </div>

            <button className="back-btn" onClick={() => navigate("/bookings")}>Back to Bookings</button>
        </div>
    );
};

export default TrackRidePage;