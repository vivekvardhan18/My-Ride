import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/Mapview";
import taxiImg from "../../assets/taxi.png";
import suvImg from "../../assets/taxi 2.png";

const OPENCAGE_API_KEY = "ff6557312f98415da54a764d128f6236"; // Replace with your API key

const MainPage = () => {
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ duration: null, distance: null, path: null });
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropSuggestions, setDropSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
                    );
                    const data = await res.json();
                    const place = data.results?.[0]?.formatted;
                    setPickup(place || `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`);
                    setPickupCoords([latitude, longitude]);
                } catch (err) {
                    console.error("OpenCage API Error:", err);
                    setPickup("Location fetch failed");
                    setPickupCoords([latitude, longitude]);
                }
            },
            (err) => {
                console.error("Geolocation Error:", err);
                setPickup("Unable to detect location");
            }
        );
    }, []);

    const geocodeAddress = async (address) => {
        try {
            const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}`);
            const data = await res.json();
            const coords = data.results?.[0]?.geometry;
            return coords ? [coords.lat, coords.lng] : null;
        } catch (err) {
            console.error("Address Geocoding Error:", err);
            return null;
        }
    };

    const searchNominatim = async (query, setSuggestions) => {
        if (!query || query.length < 2) return setSuggestions([]);
        try {
            const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}`);
            const data = await res.json();
            const suggestions = data.results.map((loc) => loc.formatted);
            setSuggestions(suggestions.slice(0, 5));
        } catch (error) {
            console.error("Search Error:", error);
            setSuggestions([]);
        }
    };

    const fetchRouteInfo = async (pickCoords, dropCoords) => {
        try {
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${pickCoords[1]},${pickCoords[0]};${dropCoords[1]},${dropCoords[0]}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            if (data.routes?.length > 0) {
                const route = data.routes[0];
                setRouteInfo({
                    duration: (route.duration / 60).toFixed(1),
                    distance: (route.distance / 1000).toFixed(1),
                    path: route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
                });
            }
        } catch (err) {
            console.error("Route Fetch Error:", err);
        }
    };

    const handleDropKey = async (e) => {
        if (e.key === "Enter" && pickup && dropoff) {
            const pick = await geocodeAddress(pickup);
            const drop = await geocodeAddress(dropoff);
            setPickupCoords(pick);
            setDropoffCoords(drop);
            if (pick && drop) await fetchRouteInfo(pick, drop);
        }
    };

    const swapLocations = () => {
        setPickup(dropoff);
        setDropoff(pickup);
        setPickupCoords(dropoffCoords);
        setDropoffCoords(pickupCoords);
    };

    const handleTaxiClick = (type) => {
        if (!pickupCoords || !dropoffCoords) {
            return alert("Please enter both pickup and drop-off locations.");
        }
        navigate(`/book/${type}`, {
            state: {
                pickup,
                dropoff,
                pickupCoords,
                dropoffCoords,
                routeInfo,
                taxiType: type,
                seats: 1,
                tripType: "oneway"
            }
        });
    };

    const handleProfileClick = () => {
        navigate("/bookings");
    };

    return (
        <div className="main-container">
            <div className="map-background">
                <MapView
                    pickupCoords={pickupCoords}
                    dropoffCoords={dropoffCoords}
                    routePath={routeInfo.path}
                    onRouteInfo={setRouteInfo}
                    setRouteInfo={setRouteInfo}
                />
            </div>

            <header className="header">
                <div className="left-icon">☰</div>
                <h3>Let's Ride</h3>
                <span className="profile-icon" onClick={handleProfileClick}>👤</span>
            </header>

            <div className="address-container">
                <div className="address-input-group">
                    <span className="address-label">A:</span>
                    <input
                        className="address-box"
                        value={pickup}
                        onChange={(e) => {
                            setPickup(e.target.value);
                            searchNominatim(e.target.value, setPickupSuggestions);
                        }}
                        onFocus={() => searchNominatim(pickup, setPickupSuggestions)}
                        placeholder="Enter pickup location"
                    />
                    {pickupSuggestions.length > 0 && (
                        <ul className="suggestion-box">
                            {pickupSuggestions.map((sug, i) => (
                                <li key={i} onClick={async () => {
                                    setPickup(sug);
                                    setPickupSuggestions([]);
                                    const coords = await geocodeAddress(sug);
                                    setPickupCoords(coords);
                                    if (coords && dropoffCoords) await fetchRouteInfo(coords, dropoffCoords);
                                }}>{sug}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="address-input-group">
                    <span className="address-label">B:</span>
                    <input
                        className="address-box"
                        value={dropoff}
                        onChange={(e) => {
                            setDropoff(e.target.value);
                            searchNominatim(e.target.value, setDropSuggestions);
                        }}
                        onFocus={() => searchNominatim(dropoff, setDropSuggestions)}
                        onKeyDown={handleDropKey}
                        placeholder="Enter destination"
                    />
                    {dropSuggestions.length > 0 && (
                        <ul className="suggestion-box">
                            {dropSuggestions.map((sug, i) => (
                                <li key={i} onClick={async () => {
                                    setDropoff(sug);
                                    setDropSuggestions([]);
                                    const coords = await geocodeAddress(sug);
                                    setDropoffCoords(coords);
                                    if (pickupCoords && coords) await fetchRouteInfo(pickupCoords, coords);
                                }}>{sug}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <button className="swap-button" onClick={swapLocations}>⇅ Swap</button>
            </div>

            <div className="taxi-options-bottom">
                <button className="taxi-card basic" onClick={() => handleTaxiClick("basic")}>
                    <div className="taxi-image-container">
                        <img src={taxiImg} alt="basic taxi" className="taxi-image" />
                    </div>
                    <div className="taxi-info">
                        <div className="taxi-type">Taxi (Basic)</div>
                        <div className="taxi-rating">4.2 ★</div>
                        {routeInfo.duration && (
                            <>
                                <div className="taxi-arrival-time">ETA: {routeInfo.duration} mins</div>
                                <div className="taxi-price">Distance: {routeInfo.distance} km</div>
                            </>
                        )}
                    </div>
                </button>

                <button className="taxi-card lux" onClick={() => handleTaxiClick("suv")}>
                    <div className="taxi-image-container">
                        <img src={suvImg} alt="suv taxi" className="taxi-image" />
                    </div>
                    <div className="taxi-info">
                        <div className="taxi-type">Taxi (Suv)</div>
                        <div className="taxi-rating">5.0 ★</div>
                        {routeInfo.duration && (
                            <>
                                <div className="taxi-arrival-time">ETA: {routeInfo.duration} mins</div>
                                <div className="taxi-price">Distance: {routeInfo.distance} km</div>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default MainPage;

