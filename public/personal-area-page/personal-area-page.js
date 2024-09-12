$(document).ready(function() {
    const userId = getCookie('userId');
    console.log('User ID from cookies:', userId);
    if (!userId) {
        alert("User not found. Please log in.");
        return;
    }

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

    $('#editProfileBtn').click(function() {
        $('#greeting').hide();
        $('#profileForm').show();
        $('#userDataSection').hide();
    });

    $('#cancelBtn').click(function() {
        $('#profileForm').hide();
        $('#greeting').show();
    });

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

    $('#userDataBtn').click(function() {
        $('#greeting').hide();
        $('#profileForm').hide();
        $('#userDataSection').show();
        loadUserData(userId);
    });

    $('#returnToProfileBtn').click(function() {
    $('#userDataSection').hide();
    $('#profileForm').hide();
    $('#greeting').show();
});
});

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

function showMessage(message, type) {
    const messageElement = $('#message');
    messageElement.text(message).removeClass('hidden success error').addClass(type);
    setTimeout(() => messageElement.addClass('hidden'), 3000);
}