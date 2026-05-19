// src/api/maps.js
export const geocodeAddress = async (address, apiKey) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${apiKey}`;
    const response = await fetch(url);
    return response.json();
};

export const getDirections = async (origin, destination, apiKey) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${apiKey}`;
    const response = await fetch(url);
    return response.json();
};