$(document).ready(function() {
    $('#toggleFilters').click(function() {
        $('#additionalFilters').toggle();
    });

    function search() {
        const name = $('#name').val();
        const supplier = $('#supplier').val();
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
            success: function(data) {
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
    }

    $('#searchButton').click(search)

    $('#clearButton').click(function() {
        $('#name').val('');
        $('#supplier').val('');
        $('#containsGluten').val('');
        $('#isKosher').val('');
        $('#minPrice').val('');
        $('#maxPrice').val('');
        search()
    });

    $('#searchButton').trigger('click');

    $(document).ready(function() {
        // הצגת המודל כאשר לוחצים על הכפתור
        $("#showVideoButton").click(function() {
            $("#videoModal").fadeIn();
        });

        // סגירת המודל כאשר לוחצים על כפתור הסגירה
        $(".close").click(function() {
            $("#videoModal").fadeOut();
        });

        // סגירת המודל כאשר לוחצים מחוץ לתוכן המודל
        $(window).click(function(event) {
            if ($(event.target).is("#videoModal")) {
                $("#videoModal").fadeOut();
            }
        });
    });

});
