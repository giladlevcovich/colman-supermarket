$(document).ready(function() {
    // Initialize an array to store the product IDs in the cart
    let cart = ['66d77e8467fccd6f0ee32391']; // Example product ID

    // Function to fetch product details and render the cart items
    function loadCart() {
        const $cartItems = $('#cartItems');
        $cartItems.empty(); // Clear previous items before appending new ones

        if (cart.length === 0) {
            $cartItems.html('<p id="emptyCartMessage">Your shopping cart is empty. Please add products to your cart.</p>');
            $('#buyNowButton').hide();
        } else {
            // Fetch product details for each product ID
            const fetchPromises = cart.map(productId =>
                $.ajax({
                    url: `http://localhost:80/api/products/${productId}`,
                    method: 'GET',
                    contentType: 'application/json'
                })
            );

            // Wait for all product details to be fetched
            Promise.all(fetchPromises)
                .then(products => {
                    products.forEach((product, index) => {
                        $cartItems.append(`
                            <div class="product-item">
                                <img src="${product.image}" alt="${product.name}">
                                <div class="product-details">
                                    <p><strong>${product.name}</strong></p>
                                    <p>Price: ${product.price}₪</p>
                                </div>
                                <button class="remove-button" data-index="${index}">X</button>
                            </div>
                        `);
                    });
                    $('#buyNowButton').show();
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    $cartItems.html('<p id="emptyCartMessage">Error loading cart items.</p>');
                    $('#buyNowButton').hide();
                });
        }
    }    

    // Function to save the order by sending the cart list to the server
    function saveOrder(cart) {
        const userId = '66d7590f82a6a9a4dfa61d46'; // Example user ID
        const order = {
            user: userId,
            products: cart,
            totalPrice: cart.reduce((total, item) => total + item.price, 0),
            date: new Date()
        };

        $.ajax({
            url: 'http://localhost:80/api/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(order),
            success: function(response) {
                alert('Order placed successfully!');
                cart = []; // Clear the cart array
                loadCart(); // Refresh cart view
            },
            error: function(error) {
                console.error('Error placing order:', error);
            }
        });
    }

    // Event handler to remove a product from the cart
    $('#cartItems').on('click', '.remove-button', function() {
        const index = $(this).data('index');
        cart.splice(index, 1); // Remove the product from the cart array
        loadCart(); // Refresh cart view
    });

    // Event handler for the "Buy Now" button
    $('#buyNowButton').click(function() {
        if (cart.length > 0) {
            saveOrder(cart);
        } else {
            alert('Your cart is empty.');
        }
    });

    // Initial load of the cart
    loadCart();
});