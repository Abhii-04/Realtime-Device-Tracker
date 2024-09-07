const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Sending location:", { latitude, longitude }); // Log sent data
        socket.emit("sendLocation", { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

// Map initialization
const map = L.map("map").setView([0, 0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers = {};

// Listen for location updates
socket.on("receive-Location", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received location:", { id, latitude, longitude }); // Log received data

    // Update map view to new location
    map.setView([latitude, longitude], 10);

    // Update marker position or create a new marker if it doesn't exist
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        console.log(`Updated marker for ${id}`);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        console.log(`Created new marker for ${id}`);
    }
});
