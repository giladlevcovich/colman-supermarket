// script.js
$(document).ready(function() {
    $('#loadProducts').click(function() {
        $.ajax({
            url: 'http://localhost:80/api/products',
            method: 'GET',
            success: function(data) {
                $('#productList').empty();
                if (data.length > 0) {
                    data.forEach(product => {
                        $('#productList').append(`
                            <div class="product-item">
                                <h2>${product.name}</h2>
                                <p><strong>Supplier:</strong> ${product.supplier}</p>
                                <p><strong>Price:</strong> ${product.price}₪</p>
                                <p><strong>Is Kosher:</strong> ${product.isKosher ? 'Yes' : 'No'}</p>
                                <p><strong>Contains Gluten:</strong> ${product.containsGluten ? 'Yes' : 'No'}</p>
                                <img src="${product.image}" alt="${product.name}" style="max-width: 200px;">
                            </div>
                        `);
                    });
                } else {
                    $('#productList').append('<p>No products found.</p>');
                }
            },
            error: function(error) {
                console.error('Error fetching products:', error);
                $('#productList').empty().append('<p>Error loading products.</p>');
            }
        });
    });
});
