$(document).ready(($)=>{
    $('#registration_form').on('submit', function(event){
        event.preventDefault();


        $('#error-message').hide();

        const formData = {
            firstName :$('#name').val(),
            lastName: $('#surname').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            genreIds: $('#genreIds').val(),
            languageIds: $('#languageIds').val()
        };

        $.ajax({
            url: '/user/register-new-user',
            method: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify(formData),
                success: function(response){
                   $('#registration_form')[0].reset();
                   $('#error-message').text('Uspešna registracija korisnika. Preusmeravanje na stranicu za prijavu...');
                     $('#error-message').css('color', 'green');
                    window.location.href = '/user/login';
                   
                },
            error: function(xhr){
                const errorMessage = xhr.responseText || 'Došlo je do greške prilikom registracije.';
                $('#error-text').text(errorMessage);
                $('#error-message').show();
            }
        });
    });

    $('#login-form').on('submit', (event)=>{
        event.preventDefault();
         $('#error-message').hide();

        const loginData = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/user/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response){
                window.location.href = '/books';
            },
            error: function(xhr){
                const errorMessage = xhr.responseText || 'Došlo je do greške prilikom prijave.';
                $('#error-message').text(errorMessage);
                $('#error-message').show();
            }
        })
    })


});