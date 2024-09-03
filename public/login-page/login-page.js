$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        function setCookie(name, value, days) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        // Make the POST request to your backend API
        $.ajax({
            url: 'https://your-backend-api.com/login', // Replace with Ofek & Kobi's API
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password }),
            success: function(response) {
                if (response.role === 'admin') {
                    setCookie('userId', response.id, 3);
                    window.location.href = 'http://localhost/products/ProductsForTheManager/ProductsForTheManager.html';
                } else if (response.role === 'user') {
                    setCookie('userId', response.id, 3);
                    window.location.href = 'http://localhost/products/ProductsForTheUser/ProductsForTheUser.html';
                } else {
                    $('#message').text('User does not exist.');
                }
            },
            error: function(xhr, status, error) {
                $('#message').text('An error occurred: ' + error);
            }
        });
    });
});