$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form data
        var username = $('#username').val();
        var password = $('#password').val();

        // Simple client-side validation (you can expand this)
        if (username === "user" && password === "password") {
            $('#message').text("Login successful!").css("color", "green");
        } else {
            $('#message').text("Invalid username or password.");
        }
    });
});