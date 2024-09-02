$(document).ready(function () {
    loadProducts();
    loadSuppliers();

    function loadProducts(query = '') {
        $.ajax({
            url: `http://localhost:80/api/products?name=${query}`,
            method: 'GET',
            success: function (data) {
                $('#productList').empty();
                data.forEach(product => {
                    $('#productList').append(`
                        <div class="product-item" data-id="${product._id}">
                            <img src="${product.image || 'default.png'}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>Price: ${product.price}₪</p>
                            <p>Supplier: ${product.supplier.name}</p>
                            <p>Kosher: ${product.isKosher}</p>
                            <p>Contains Gluten: ${product.containsGluten}</p>
                            <button class="edit">Edit</button>
                            <button class="delete">Delete</button>
                        </div>
                    `);
                });
            },
            error: function (error) {
                console.error('Error loading products:', error);
            }
        });
    }

    function loadSuppliers() {
        $.ajax({
            url: 'http://localhost:80/api/suppliers',
            method: 'GET',
            success: function (data) {
                $('#productSupplier').empty();
                data.forEach(supplier => {
                    $('#productSupplier').append(`
                        <option value="${supplier._id}">${supplier.name}</option>
                    `);
                });
            },
            error: function (error) {
                console.error('Error loading suppliers:', error);
            }
        });
    }

    $('#searchButton').click(function () {
        const query = $('#searchInput').val();
        loadProducts(query);
    });

    $('#addProductButton').click(function () {
        clearModal();
        $('#productModal').data('mode', 'add');
        $('#modalTitle').text('Add New Product');
        $('#productModal').show();
    });

    $('.close').click(function () {
        $('#productModal').hide();
    });

    $('#saveProductButton').click(function () {
        saveProduct();
    });

    $(document).on('click', '.delete', function () {
        const productId = $(this).closest('.product-item').data('id');
        $.ajax({
            url: `http://localhost:80/api/products/${productId}`,
            method: 'DELETE',
            success: function () {
                loadProducts();
            },
            error: function (error) {
                console.error('Error deleting product:', error);
            }
        });
    });

    $(document).on('click', '.edit', function () {
        const productId = $(this).closest('.product-item').data('id');

        $.ajax({
            url: `http://localhost:80/api/products/${productId}`,
            method: 'GET',
            success: function (product) {
                $('#productName').val(product.name);
                $('#productPrice').val(product.price);
                $('#productSupplier').val(product.supplier);
                $('#productImage').val(product.image);
                $('#productKosher').prop('checked', product.isKosher);
                $('#productGluten').prop('checked', product.containsGluten);

                $('#productModal').data('mode', 'edit').data('id', productId);
                $('#productModal').show();
                $('#modalTitle').text('Edit Product');
            },
            error: function (error) {
                console.error('Error loading product data:', error);
            }
        });
    });

    function saveProduct() {
        const product = {
            name: $('#productName').val(),
            price: $('#productPrice').val(),
            supplier: $('#productSupplier').val(), // שליחה של ID של ספק
            image: $('#productImage').val(),
            isKosher: $('#productKosher').is(':checked'),
            containsGluten: $('#productGluten').is(':checked')
        };

        const mode = $('#productModal').data('mode');
        const url = mode === 'add' ? 'http://localhost:80/api/products' : `http://localhost:80/api/products/${$('#productModal').data('id')}`;
        const method = mode === 'add' ? 'POST' : 'PUT';

        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(product),
            contentType: 'application/json',
            success: function () {
                loadProducts();
                $('#productModal').hide();
            },
            error: function (error) {
                console.error('Error saving product:', error);
            }
        });
    }

    function clearModal() {
        $('#productName').val('');
        $('#productPrice').val('');
        $('#productSupplier').val('');
        $('#productImage').val('');
        $('#productKosher').prop('checked', false);
        $('#productGluten').prop('checked', false);
    }
});
