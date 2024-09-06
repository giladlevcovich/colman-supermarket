document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch order count for today
    async function fetchOrderCount() {
        try {
            // Get today's date
            const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

            // Fetch the order count for today
            const response = await fetch(`/api/orders/countByDate?date=${today}`);

            const data = await response.json();

            // Check if the data is an array and has a count
            if (Array.isArray(data) && data.length > 0) {
                const count = data[0].count || 0;
                document.getElementById('order-count').innerText = count;
            } else {
                document.getElementById('order-count').innerText = '0';
            }
        } catch (error) {
            console.error('Error fetching order count:', error);
            document.getElementById('order-count').innerText = 'Error';
        }
    }

    fetchOrderCount();
});

function navigateTo(page) {
    window.location.href = page;
}
