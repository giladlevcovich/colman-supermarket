$(document).ready(function () {
    // Initialize an array to store the product IDs in the cart
    // let cart = ['66d77e8467fccd6f0ee32391', '66d46fbc0e20da17dbd737cb']; // Example product ID
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to fetch product details and render the cart items
    function loadCart() {
        const $cartItems = $('#cartItems');
        $cartItems.empty(); // Clear previous items before appending new ones

        if (cart.length === 0) {
            $cartItems.html('<p id="emptyCartMessage">Your shopping cart is empty. Please add products to your cart.</p>');
            $('#buyNowButton').hide();
        } else {
            // Fetch product details for each product in the cart
            const fetchPromises = cart.map(cartItem =>
                $.ajax({
                    url: `http://localhost:80/api/products/${cartItem.productId}`,
                    method: 'GET',
                    contentType: 'application/json'
                }).then(product => {
                    return {
                        ...product,
                        quantity: cartItem.quantity // Include quantity from cart
                    };
                })
            );

            // Wait for all product details to be fetched
            Promise.all(fetchPromises)
                .then(products => {
                    let totalPrice = 0; // Initialize total price

                    products.forEach((product, index) => {
                        const itemTotalPrice = product.price * product.quantity;
                        totalPrice += itemTotalPrice; // Add item's total price to total price

                        // Append product details to cart
                        $cartItems.append(`
                        <div class="product-item">
                            <img src="${product.image}" alt="${product.name}">
                            <div class="product-details">
                                <p><strong>${product.name}</strong></p>
                                <p>Price: ${product.price}₪</p>
                                <p>Quantity: ${product.quantity}</p>
                                <p>Total: ${itemTotalPrice}₪</p>
                            </div>
                            <button class="remove-button" data-index="${index}">X</button>
                        </div>
                    `);
                    });

                    // Append total price before the Buy Now button
                    $cartItems.append(`
                    <div class="cart-total">
                        <p><strong>Total Price: ${totalPrice}₪</strong></p>
                        <p id="usdTotal"></p>
                    </div>
                `);

                    $('#buyNowButton').show(); // Show the Buy Now button

                    // Fetch and display USD equivalent
                    fetchUSDEquivalent(totalPrice);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    $cartItems.html('<p id="emptyCartMessage">Error loading cart items.</p>');
                    $('#buyNowButton').hide();
                });
        }
    }

    
    // Function to fetch USD equivalent
    function fetchUSDEquivalent(ilsAmount) {
        const apiKey = '124d94306a5cf25f0c7da8a0';
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/ILS`;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(response) {
                if (response.result === 'success') {
                    const usdRate = response.conversion_rates.USD;
                    const usdAmount = (ilsAmount * usdRate).toFixed(2);
                    $('#usdTotal').text(`Total Price in USD: $${usdAmount}`);
                } else {
                    console.error('Error fetching exchange rate:', response.error-type);
                    $('#usdTotal').text('USD conversion unavailable');
                }
            },
            error: function(error) {
                console.error('Error fetching exchange rate:', error);
                $('#usdTotal').text('USD conversion unavailable');
            }
        });
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
            success: function (response) {
                alert('Order placed successfully!');
                cart = []; // Clear the cart array
                loadCart(); // Refresh cart view
            },
            error: function (error) {
                console.error('Error placing order:', error);
            }
        });
    }

    // Event handler to remove a product from the cart
    $('#cartItems').on('click', '.remove-button', function () {
        const index = $(this).data('index');
        cart.splice(index, 1); // Remove the product from the cart array
        loadCart(); // Refresh cart view
    });

    // Event handler for the "Buy Now" button
    $('#buyNowButton').click(function () {
        if (cart.length > 0) {
            saveOrder(cart);
        } else {
            alert('Your cart is empty.');
        }
    });

    // Initial load of the cart
    loadCart();
});