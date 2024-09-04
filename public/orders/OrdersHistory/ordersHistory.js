$(document).ready(function() {
    const userId = '66d7590582a6a9a4dfa61d44'; // Replace with the actual logged-in user's ID

    function fetchOrders(startDate = '', endDate = '') {
        const queryParams = [];
        if (startDate) queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
        if (endDate) queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    
        $.ajax({
            url: `http://localhost:80/api/orders/user-orders/${userId}${queryString}`,
            method: 'GET',
            success: function(data) {
                $('#orderList').empty();
                console.log('Fetched data:', data); // Debugging line
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(order => {
                        $('#orderList').append(`
                            <div class="order-item">
                                <h2>Order Date: ${new Date(order.date).toLocaleDateString()}</h2>
                                <p><strong>Total Price:</strong> ${order.totalPrice}₪</p>
                                <button class="view-products-button" data-order-id="${order._id}">View Products</button>
                                <div class="product-list" id="productList-${order._id}" style="display: none;"></div>
                            </div>
                        `)
                    });
                } else {
                    $('#orderList').append('<p>No orders found for the selected dates.</p>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching orders:', textStatus, errorThrown);
                $('#orderList').empty().append('<p>Error loading orders.</p>');
            }
        });
    }

    function fetchProducts(orderId) {
        $.ajax({
            url: `http://localhost:80/api/orders/${orderId}/products`,
            method: 'GET',
            success: function(products) {
                const productList = $(`#productList-${orderId}`);
                productList.empty();
                if (Array.isArray(products) && products.length > 0) {
                    products.forEach(product => {
                        productList.append(`
                            <p><strong>${product.name}</strong> - ${product.price}₪ </p>
                        `);
                    });
                    productList.slideDown();
                } else {
                    productList.append('<p>No products found.</p>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching products:', textStatus, errorThrown);
                $(`#productList-${orderId}`).append('<p>Error loading products.</p>');
            }
        });
    }    

    $('#filterButton').click(function() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
    
        // Log dates for debugging
        console.log('Start Date:', startDate, 'End Date:', endDate);
    
        fetchOrders(startDate, endDate);
    });    

    $('#orderList').on('click', '.view-products-button', function() {
        const orderId = $(this).data('order-id');
        const productList = $(`#productList-${orderId}`);
        if (productList.is(':visible')) {
            productList.slideUp();
        } else {
            fetchProducts(orderId);
        }
    });
    

    fetchOrders();  // Initial load without any filters
});
