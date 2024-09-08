document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:80/api/suppliers')
        .then(response => response.json())
        .then(suppliers => {
            initMap(suppliers);
        })
        .catch(error => console.error('Error:', error));
});

function initMap(suppliers) {
    const map = L.map('map').setView([32, 35], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    suppliers.forEach(supplier => {
        weatherApi(supplier.location.lat, supplier.location.lng).then(res => {
            L.marker([supplier.location.lat, supplier.location.lng])
                .addTo(map)
                .bindPopup(
                    `
             <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <p class="card-text" style="font-size: 14px;margin-bottom: 0">
                            <strong>Supplier:</strong> ${supplier.name.toUpperCase()}<br>
                            <strong>Street:</strong> ${supplier.address.street}<br>
                            <strong>City:</strong> ${supplier.address.city}<br>
                            <strong>State:</strong> ${supplier.address.state}<br>
                        </p>
                         <div style="display: flex; flex-direction: row; font-size: 14px; align-items: center"><strong>Weather: </strong> ${res.temp}, ${res.condition_text} <img src="${res.icon}" height="40"/></div>
                    </div>
                </div>
              `
                );
        });
    });
}

function navigateTo(page) {
  window.location.href = page;
}
 async function weatherApi(lat, lon) {
     const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${lat}%2C${lon}`;
     const options = {
         method: 'GET',
         headers: {
             'x-rapidapi-key': 'be1e23ebd3msh44e0f8114135dd1p1b98b5jsn40108de41252',
             'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
         }
     };

     const res = await fetch(url, options);
     const resultJson = await res.json();
    return  {
        temp: resultJson.current.temp_c,
        condition_text: resultJson.current.condition.text,
        icon: resultJson.current.condition.icon
    }


}