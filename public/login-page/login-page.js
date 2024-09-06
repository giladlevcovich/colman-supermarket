$(document).ready(function () {
    $('#loginForm').on('submit', function (event) {
        event.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        function setCookie(name, value, days) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        $.ajax({
            url: 'http://localhost:80/api/users/authenticate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({username: username, password: password}),
            success: function (response, textStatus, xhr) {
                if (xhr.status === 200) {
                    if (response.isAdmin) {
                        setCookie('userId', response.id, 3);
                        window.location.href = 'http://localhost/admin-page/admin-page.html';
                    } else {
                        setCookie('userId', response.id, 3);
                        window.location.href = 'http://localhost/products/ProductsForTheUser/ProductsForTheUser.html';
                    }
                } else {
                    $('#message').text('An unexpected error occurred.');
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 401) {
                    $('#message').text('Invalid username or password.');
                } else {
                    $('#message').text('An error occurred: ' + error);
                }
            }
        });
    });
});