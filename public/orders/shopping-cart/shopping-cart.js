$(document).ready(function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

    // Load the cart items and display them
    function loadCart() {
        const $cartItems = $('#cartItems');
        $cartItems.empty();

        if (cart.length === 0) {
            $cartItems.html('<p id="emptyCartMessage">Your shopping cart is empty. Please add products to your cart.</p>');
            $('#buyNowButton').hide();
        } else {
            const fetchPromises = cart.map(cartItem =>
                $.ajax({
                    url: `http://localhost:80/api/products/${cartItem.productId}`,
                    method: 'GET',
                    contentType: 'application/json'
                }).then(product => {
                    return {
                        ...product,
                        quantity: cartItem.quantity
                    };
                })
            );

            Promise.all(fetchPromises)
                .then(products => {
                    let totalPrice = 0;

                    products.forEach((product, index) => {
                        const itemTotalPrice = product.price * product.quantity;
                        totalPrice += itemTotalPrice;

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

                    $cartItems.append(`
                    <div class="cart-total">
                        <p><strong>Total Price: ${totalPrice}₪</strong></p>
                        <p id="usdTotal"></p>
                    </div>
                `);

                    $('#buyNowButton').show();
                    fetchUSDEquivalent(totalPrice);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    $cartItems.html('<p>Error loading cart items.</p>');
                    $('#buyNowButton').hide();
                });
        }
    }

    function fetchUSDEquivalent(ilsAmount) {
        const apiKey = '124d94306a5cf25f0c7da8a0';
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/ILS`;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                if (response.result === 'success') {
                    const usdRate = response.conversion_rates.USD;
                    const usdAmount = (ilsAmount * usdRate).toFixed(2);
                    $('#usdTotal').text(`Total Price in USD: $${usdAmount}`);
                } else {
                    $('#usdTotal').text('USD conversion unavailable');
                }
            },
            error: function () {
                $('#usdTotal').text('USD conversion unavailable');
            }
        });
    }

    function saveOrder() {
        const userId = getCookie('userId');
        if (!userId) {
            alert("User not found. Please log in.");
            return;
        }

        const order = {
            user: userId,
            products: cart,
            totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0),
            date: new Date()
        };

        $.ajax({
            url: 'http://localhost:80/api/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(order),
            success: function () {
                alert('Order placed successfully!');
                cart = []; // Clear the cart array
                localStorage.removeItem('cart'); // Clear the cart in localStorage
                loadCart(); // Refresh cart view
            },
            error: function (error) {
                console.error('Error placing order:', error);
            }
        });
    }

    $('#cartItems').on('click', '.remove-button', function () {
        const index = $(this).data('index');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    });

    $('#buyNowButton').click(function () {
        if (cart.length > 0) {
            saveOrder();
        } else {
            alert('Your cart is empty.');
        }
    });

    loadCart();
});
