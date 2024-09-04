$(document).ready(function() {
    const cartKey = 'shoppingCart';

    function addToCart(productId) {
        $.ajax({
            url: `http://localhost:80/api/cart/add-to-cart/${productId}`,
            method: 'GET',
            success: function(product) {
                let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                const existingProductIndex = cart.findIndex(item => item.id === product._id);
    
                if (existingProductIndex === -1) {
                    cart.push({
                        id: product._id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        supplierName: product.supplier.name // Adjust as needed
                    });
                    localStorage.setItem(cartKey, JSON.stringify(cart));
                    loadCart(); // Refresh cart view
                } else {
                    alert('Product is already in the cart.');
                }
            },
            error: function(error) {
                console.error('Error fetching product:', error);
            }
        });
    }

    function loadCart() {
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const $cartItems = $('#cartItems');
        $cartItems.empty();
    
        if (cart.length === 0) {
            $cartItems.append('<p id="emptyCartMessage">Your shopping cart is empty. Please add products to your cart.</p>');
            $('#buyNowButton').hide();
        } else {
            cart.forEach((item, index) => {
                $cartItems.append(`
                    <div class="product-item">
                        <img src="${item.image}" alt="${item.name}">
                        <p><strong>${item.name}</strong></p>
                        <p>${item.supplierName}</p>
                        <p>${item.price}₪</p>
                        <button class="remove-button" data-index="${index}">X</button>
                    </div>
                `);
            });
            $('#buyNowButton').show();
        }
    }
    
    function saveOrder(cart) {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
        const userId = getCookie('userId');
        const order = {
            user: userId,
            products: cart.map(item => item.id),
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
                localStorage.removeItem(cartKey); // Clear cart
                loadCart(); // Refresh cart view
            },
            error: function(error) {
                console.error('Error placing order:', error);
            }
        });    
    }

    $('#cartItems').on('click', '.remove-button', function() {
        const index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cart.splice(index, 1);
        localStorage.setItem(cartKey, JSON.stringify(cart));
        loadCart();
    });

    $('#buyNowButton').click(function() {
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        if (cart.length > 0) {
            saveOrder(cart);
        } else {
            alert('Your cart is empty.');
        }
    });

    loadCart();
});