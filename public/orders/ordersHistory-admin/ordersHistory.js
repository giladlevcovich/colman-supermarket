$(document).ready(function() {
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to check if the user is an admin
    function isAdminUser(userId) {
        return $.ajax({
            url: `http://localhost:80/api/users/${userId}`, // Adjust URL as needed
            method: 'GET',
            success: function(user) {
                console.log('User Data:', user); // Debugging line
                return user.isAdmin;
            },
            error: function() {
                console.error('Error fetching user data.');
                return false; // Default to not admin if there's an error
            }
        });
    }

    const userId = getCookie('userId');
    if (!userId) {
        alert("User not found. Please log in.");
        return;
    }

    // Check if the user is an admin and hide the cart button if so
    isAdminUser(userId).then(isAdmin => {
        console.log('Is Admin:', isAdmin); // Log admin status for debugging
        if (isAdmin) {
            $('.header-button-shopping-cart').hide();
        }
    }).catch(error => {
        console.error('Error checking admin status:', error);
    });

    function fetchOrders(startDate = '', endDate = '') {
        const queryParams = [];
        if (startDate) {
            startDate = `${startDate}T00:00:00.000Z`; // Start of the day
            queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
        }
        if (endDate) {
            endDate = `${endDate}T23:59:59.999Z`; // End of the day
            queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
        }
        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        $.ajax({
            url: `http://localhost:80/api/orders/user-orders/${userId}${queryString}`,
            method: 'GET',
            success: function(data) {
                $('#orderList').empty();
                console.log('Fetched data:', data); // Debugging line
                if (Array.isArray(data) && data.length > 0) {
                    // Sort the orders by date in descending order
                    data.sort((a, b) => new Date(b.date) - new Date(a.date));

                    data.forEach(order => {
                        $('#orderList').append(`
                            <div class="order-item">
                                <h2>Order Date: ${new Date(order.date).toLocaleDateString()}</h2>
                                <p><strong>Total Price:</strong> ${order.totalPrice}₪</p>
                                <button class="view-products-button" data-order-id="${order._id}">View Products</button>
                                <div class="product-list" id="productList-${order._id}" style="display: none;"></div>
                            </div>
                        `);
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
