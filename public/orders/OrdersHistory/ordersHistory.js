$(document).ready(function() {
    function fetchOrders(startDate, endDate) {
        const queryParams = [];
        if (startDate) queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
        if (endDate) queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        $.ajax({
            url: `http://localhost:80/api/orders/user/${userId}${queryString}`,  // Replace `userId` with the logged-in user's ID
            method: 'GET',
            success: function(data) {
                $('#orderList').empty();
                if (data.length > 0) {
                    data.forEach(order => {
                        $('#orderList').append(`
                            <div class="order-item">
                                <h2>Order Date: ${new Date(order.date).toLocaleDateString()}</h2>
                                <p><strong>Total Price:</strong> ${order.totalPrice}₪</p>
                                <button class="view-products-button" data-order-id="${order._id}">View Products</button>
                                <div class="product-list" id="productList-${order._id}"></div>
                            </div>
                        `);
                    });
                } else {
                    $('#orderList').append('<p>No orders found.</p>');
                }
            },
            error: function(error) {
                console.error('Error fetching orders:', error);
                $('#orderList').empty().append('<p>Error loading orders.</p>');
            }
        });
    }

    function fetchProducts(orderId) {
        $.ajax({
            url: `http://localhost:80/api/orders/${orderId}/products`,  // Endpoint to get products for an order
            method: 'GET',
            success: function(products) {
                const productList = $(`#productList-${orderId}`);
                productList.empty();
                if (products.length > 0) {
                    products.forEach(product => {
                        productList.append(`
                            <p><strong>${product.name}</strong> - ${product.price}₪ (Supplier: ${product.supplier?.name})</p>
                        `);
                    });
                    productList.slideDown();
                } else {
                    productList.append('<p>No products found.</p>');
                }
            },
            error: function(error) {
                console.error('Error fetching products:', error);
                $(`#productList-${orderId}`).append('<p>Error loading products.</p>');
            }
        });
    }

    $('#filterButton').click(function() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
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

    // Initial load without any filters
    fetchOrders();
});
