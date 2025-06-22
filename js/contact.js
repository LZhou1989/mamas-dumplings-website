document.addEventListener('DOMContentLoaded', () => {
    // Initialize Leaflet map
    const map = L.map('map').setView([52.5200, 13.4050], 13); // Coordinates for Berlin

    // Add tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker
    L.marker([52.5200, 13.4050]).addTo(map)
        .bindPopup("<b>Mama's Dumplings</b><br>Musterstraße 123, 10115 Berlin")
        .openPopup();
}); 