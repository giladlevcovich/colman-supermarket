document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:80/api/suppliers')
        .then(response => response.json())
        .then(suppliers => {
            initMap(suppliers);
        })
        .catch(error => console.error('Error:', error));
});

function initMap(suppliers) {
    // Initialize the map and set its view to a default location
    const map = L.map('map').setView([32, 35], 10);

    // Set up the OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add markers to the map for each supplier
    suppliers.forEach(supplier => {
        L.marker([supplier.location.lat, supplier.location.lng])
            .addTo(map)
            .bindPopup(
              `
             <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <p class="card-text" style="font-size: 14px;">
                            <strong>Supplier:</strong> ${supplier.name.toUpperCase()}<br>
                            <strong>Street:</strong> ${supplier.address.street}<br>
                            <strong>City:</strong> ${supplier.address.city}<br>
                            <strong>State:</strong> ${supplier.address.state}
                        </p>
                    </div>
                </div>
              `
            );
    });
}