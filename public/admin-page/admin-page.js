// Function to fetch the order count for today
function getOrderCountForToday() {
    // Get today's date in DD-MM-YYYY format
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    //const formattedDate = '06-09-2024';

    // Send an AJAX GET request to the backend endpoint with today's date
    $.ajax({
        url: `http://localhost:80/api/orders/count/${formattedDate}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // Display the count
            const orderCountElement = document.getElementById('order-count');
            console.log(data.ordersCount);
            orderCountElement.textContent = data.ordersCount;
        },
        error: function(xhr, status, error) {
            console.error('Error fetching order count:', error);
            // Display error message
            const orderCountElement = document.getElementById('order-count');
            orderCountElement.textContent = `Error: ${xhr.responseJSON?.message || 'Failed to fetch order count'}`;
        }
    });
}

// Call the function on page load or whenever needed
$(document).ready(function() {
    getOrderCountForToday();
});


function navigateTo(page) {
    window.location.href = page;
}
