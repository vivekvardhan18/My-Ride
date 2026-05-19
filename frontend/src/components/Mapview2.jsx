import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker Icons
const pickupIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
    iconSize: [32, 32]
});

const dropoffIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [32, 32]
});

const driverIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/685/685655.png",
    iconSize: [32, 32]
});

// Auto-fit map to all points
const FitMapBounds = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [points, map]);

    return null;
};

const MapView = ({
    pickupCoords,
    dropoffCoords,
    driverCoords,
    setRouteInfo // ✅ Added for setting back distance/duration
}) => {
    const [routePath, setRoutePath] = useState([]);
    const allCoords = [pickupCoords, dropoffCoords, driverCoords].filter(Boolean);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!pickupCoords || !dropoffCoords) return;

            try {
                // Using OpenRouteService for free routing API (requires API key)
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`);
                const data = await res.json();

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                    setRoutePath(coords);

                    if (typeof setRouteInfo === "function") {
                        setRouteInfo({
                            distance: (route.distance / 1000).toFixed(2), // km
                            duration: Math.ceil(route.duration / 60) // minutes
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch route:", err);
            }
        };

        fetchRoute();
    }, [pickupCoords, dropoffCoords, setRouteInfo]);

    return (
        <MapContainer
            center={pickupCoords || [20.5937, 78.9629]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", borderRadius: "10px", marginTop: "10px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon} />}
            {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon} />}
            {driverCoords && <Marker position={driverCoords} icon={driverIcon} />}
            {routePath.length > 0 && <Polyline positions={routePath} color="blue" />}

            <FitMapBounds points={allCoords} />
        </MapContainer>
    );
};

export default MapView;