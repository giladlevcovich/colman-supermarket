$(document).ready(function () {
    function loadSuppliers() {
        $.ajax({
            url: 'http://localhost:80/api/suppliers', // API address to load suppliers
            method: 'GET',
            success: function (suppliers) {
                const supplierSelect = $('#productSupplier');
                suppliers.forEach(supplier => {
                    supplierSelect.append(
                        `<option value="${supplier._id}">${supplier.name}</option>`
                    );
                });
            },
            error: function (error) {
                console.error('Error fetching suppliers:', error);
            }
        });
    }

    loadSuppliers();

    $('#toggleFilters').click(function () {
        $('#additionalFilters').toggle();
    });

    function search() {
        const name = $('#name').val();
        const supplier = $('#productSupplier').val();
        const containsGluten = $('#containsGluten').val();
        const isKosher = $('#isKosher').val();
        const minPrice = $('#minPrice').val();
        const maxPrice = $('#maxPrice').val();

        const queryParams = [];

        if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
        if (supplier) queryParams.push(`supplier=${encodeURIComponent(supplier)}`);
        if (containsGluten) queryParams.push(`containsGluten=${encodeURIComponent(containsGluten)}`);
        if (isKosher) queryParams.push(`isKosher=${encodeURIComponent(isKosher)}`);
        if (minPrice) queryParams.push(`minPrice=${encodeURIComponent(minPrice)}`);
        if (maxPrice) queryParams.push(`maxPrice=${encodeURIComponent(maxPrice)}`);

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        $.ajax({
            url: `http://localhost:80/api/products${queryString}`,
            method: 'GET',
            success: function (data) {
                $('#productList').empty();
                if (data.length > 0) {
                    data.forEach(product => {
                        $('#productList').append(`
                            <div class="product-item">
                                <h2>${product.name}</h2>
                                <p><strong>Supplier:</strong> ${product.supplier?.name}</p>
                                <p><strong>Price:</strong> ${product.price}₪</p>
                                <p><strong>Is Kosher:</strong> ${product.isKosher ? 'Yes' : 'No'}</p>
                                <p><strong>Contains Gluten:</strong> ${product.containsGluten ? 'Yes' : 'No'}</p>
                                <img src="${product.image}" alt="${product.name}">
                                <button class="add-to-cart-button" data-id="${product._id}">Add to cart</button>
                            </div>
                        `);
                    });
                } else {
                    $('#productList').append('<p>No products found.</p>');
                }
            },
            error: function (error) {
                console.error('Error fetching products:', error);
                $('#productList').empty().append('<p>Error loading products.</p>');
            }
        });
    }

    function addToCart(productId) {
        // Check if the product already exists in the cart
        let cart = JSON.parse(localStorage.getItem('cart')) ?? []
        const existingProduct = cart.find(item => item.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ productId: productId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Current cart:', cart);
        alert('Product added to cart!');
    }

    $(document).on('click', '.add-to-cart-button', function () {
        const productId = $(this).data('id');
        if (productId) {
            addToCart(productId);
        } else {
            alert('Product ID is missing.');
        }
    });

    $('#searchButton').click(search);

    $('#clearButton').click(function () {
        $('#name').val('');
        $('#productSupplier').val('');
        $('#containsGluten').val('');
        $('#isKosher').val('');
        $('#minPrice').val('');
        $('#maxPrice').val('');
        search();
    });

    $('#searchButton').trigger('click');
    $(document).ready(function () {
        $("#showVideoButton").click(function () {
            $("#videoModal").fadeIn();
        });

        $(".close").click(function () {
            $("#videoModal").fadeOut();
        });

        $(window).click(function (event) {
            if ($(event.target).is("#videoModal")) {
                $("#videoModal").fadeOut();
            }
        });
    });

});
