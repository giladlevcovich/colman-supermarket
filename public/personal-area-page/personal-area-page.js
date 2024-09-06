$(document).ready(function() {
    const userId = getCookie('userId');
    if (!userId) {
         alert("User not found. Please log in.");
        return;
    }

    // Load user data
    $.ajax({
        url: `http://localhost:80/api/users/${userId}`,
        type: 'GET',
        success: function(user) {
            $('#username-display').text(user.username);
            $('#username').val(user.username);
            $('#email').val(user.email);
            $('#address').val(user.address);
        },
        error: function(xhr, status, error) {
            showMessage('Error loading user data: ' + error, 'error');
        }
    });

    // Toggle edit profile form
    $('#editProfileBtn').click(function() {
        $('#greeting').hide();
        $('#profileForm').show();
    });

    // Cancel edit profile
    $('#cancelBtn').click(function() {
        $('#profileForm').hide();
        $('#greeting').show();
    });

    // Handle form submission
    $('#editProfileForm').submit(function(e) {
        e.preventDefault();

        const updatedUser = {
            username: $('#username').val(),
            email: $('#email').val(),
            address: $('#address').val()
        };

        if ($('#password').val()) {
            updatedUser.password = $('#password').val();
        }

        $.ajax({
            url: `http://localhost:80/api/users/${userId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedUser),
            success: function(response) {
                $('#username-display').text(updatedUser.username);
                showMessage('Profile updated successfully!', 'success');
                $('#profileForm').hide();
                $('#greeting').show();
            },
            error: function(xhr, status, error) {
                showMessage('Error updating profile: ' + error, 'error');
            }
        });
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showMessage(message, type) {
    const messageElement = $('#message');
    messageElement.text(message).removeClass('hidden success error').addClass(type);
    setTimeout(() => messageElement.addClass('hidden'), 3000);
}