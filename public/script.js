const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Sending location:", { latitude, longitude });
        socket.emit("sendLocation", { latitude, longitude });
    }, (error) => {
        console.log("Geolocation error:", error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}


const map = L.map("map").setView([0, 0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "OpenStreetMap"
}).addTo(map);

let markers = {};


socket.on("receive-Location", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received location:", { id, latitude, longitude });

    if (latitude === 0 && longitude === 0) {
        console.log("Received invalid location data");
        return;
    }

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        console.log(`Updated marker for ${id}`);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        console.log(`Created new marker for ${id}`);
    }
  
    // update the map view to the new location
    map.setView([latitude, longitude], 10);
});

socket.on("user-disconnected", (id) => {  
    if (markers[id]) {
        map.removeLayer(markers[id]);
        console.log(`Removed marker for ${id}`);
    }
});
