import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Dark theme tile layer
const darkTileLayer = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';

const mapStyles = {
    darkMapTheme: {
        backgroundColor: '#121212',
        height: '100%',
        width: '100%',
    },
    popupWrapper: {
        backgroundColor: '#1c1c1c',
        color: 'white',
        borderRadius: '6px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
        margin: '8px 12px',
        fontSize: '13px',
    },
    zoomControl: {
        backgroundColor: '#1c1c1c',
        color: 'white',
        border: '1px solid #333',
        width: '30px',
        height: '40px',
        lineHeight: '30px',
        textAlign: 'center',
        cursor: 'pointer',
    },
};

// Custom icons
const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
});

// Auto center
const MapAutoCenter = ({ pickupCoords }) => {
    const map = useMap();
    useEffect(() => {
        if (pickupCoords) map.setView(pickupCoords, 14);
    }, [pickupCoords, map]);
    return null;
};

// Zoom controls
const ZoomControls = () => {
    const map = useMap();
    const zoomIn = () => map.setZoom(map.getZoom() + 1);
    const zoomOut = () => map.setZoom(map.getZoom() - 1);

    return (
        <div style={{ position: 'absolute', right: '10px', top: '100px', zIndex: 1000 }}>
            <button
                onClick={zoomIn}
                style={{ ...mapStyles.zoomControl, borderBottom: 'none' }}
            >+</button>
            <button
                onClick={zoomOut}
                style={{ ...mapStyles.zoomControl, borderTop: 'none' }}
            >−</button>
        </div>
    );
};

// MAIN COMPONENT
const MapView = ({ pickupCoords, dropoffCoords, setRouteInfo }) => {
    const [routeCoords, setRouteCoords] = useState([]);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!pickupCoords || !dropoffCoords) return;

            try {
                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`
                );

                const data = await res.json();

                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                    setRouteCoords(coords);

                    if (typeof setRouteInfo === "function") {
                        setRouteInfo({
                            duration: (data.routes[0].duration / 60).toFixed(1),
                            distance: (data.routes[0].distance / 1000).toFixed(1),
                        });
                    }
                }
            } catch (err) {
                console.error("Route fetch failed:", err);
            }
        };

        fetchRoute();
    }, [pickupCoords, dropoffCoords, setRouteInfo]);

    const createPopup = (text) => (
        <Popup>
            <div style={mapStyles.popupWrapper}>
                <div style={mapStyles.popupContent}>{text}</div>
            </div>
        </Popup>
    );

    return (
        <MapContainer
            center={pickupCoords || [20.5937, 78.9629]}
            zoom={pickupCoords ? 13 : 5}
            scrollWheelZoom={true}
            style={mapStyles.darkMapTheme}
        >
            <MapAutoCenter pickupCoords={pickupCoords} />
            <ZoomControls />
            <TileLayer attribution='&copy; Stadia Maps' url={darkTileLayer} />

            {pickupCoords && (
                <Marker position={pickupCoords} icon={userIcon}>
                    {createPopup('Your Location')}
                </Marker>
            )}

            {dropoffCoords && (
                <Marker position={dropoffCoords} icon={destinationIcon}>
                    {createPopup('Drop-off')}
                </Marker>
            )}

            {routeCoords.length > 0 && (
                <Polyline
                    positions={routeCoords}
                    pathOptions={{ color: '#4dabf7', weight: 4, opacity: 0.8 }}
                />
            )}
        </MapContainer>
    );
};

export default MapView;