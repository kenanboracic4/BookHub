$(document).ready(($)=>{ 
    $('#registration_form').on('submit', function(event){ // registracija
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

    $('#login-form').on('submit', (event)=>{ // login
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

   $('#user-update-form').on('submit', function(event) {
    event.preventDefault(); 
        event.stopPropagation();

    
    const pathArray = window.location.pathname.split('/'); 
    const userId = pathArray[3]; 

    const formData = {
        status: $('#status').val(),
        role: $('#role').val(),
        genreIds: $('select[name="genreIds[]"]').val() || [],
        languageIds: $('select[name="languageIds[]"]').val() || [],
        bio: $('textarea[name="bio"]').val()
    };

    
    $.ajax({
        url: '/user/profile/' + userId + '/update',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
           
            window.location.href = '/user/profile/' + userId+ '?success=true';
        },
        error: function(xhr) {
            const errorMessage = xhr.responseText || 'Greška prilikom ažuriranja.';
            alert(errorMessage); 
        }
    });
});


});