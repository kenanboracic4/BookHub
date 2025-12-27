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

    // 1. Provjera šifri na klijentskoj strani
    const newPassword = $('input[name="newPassword"]').val();
    const confirmPassword = $('input[name="confirmPassword"]').val();

    if (newPassword && newPassword !== confirmPassword) {
        alert("Nove šifre se ne podudaraju!");
        return;
    }

    const pathArray = window.location.pathname.split('/'); 
    const userId = pathArray[3]; 

    // 2. Kreiranje FormData objekta
    const formData = new FormData();

    // Dodajemo obična polja
    formData.append('status', $('#status').val());
    formData.append('role', $('#role').val());
    formData.append('bio', $('textarea[name="bio"]').val());
    
    // Dodajemo novu šifru samo ako je unesena
    if (newPassword) {
        formData.append('newPassword', newPassword);
    }

    // Dodajemo nizove (Žanrovi i Jezici)
    // Moramo ih dodati pojedinačno da bi ih backend (multer) prepoznao kao niz
    const genreIds = $('select[name="genreIds[]"]').val() || [];
    const languageIds = $('select[name="languageIds[]"]').val() || [];

    genreIds.forEach(id => formData.append('genreIds[]', id));
    languageIds.forEach(id => formData.append('languageIds[]', id));

    // 3. Dodajemo sliku ako je odabrana
    const fileInput = document.getElementById('profileImageInput'); // ID iz prethodnog HTML-a
    if (fileInput.files.length > 0) {
        formData.append('profileImage', fileInput.files[0]);
    }

    // 4. AJAX poziv
    $.ajax({
        url: '/user/profile/' + userId + '/update',
        method: 'PUT',
        data: formData,
        processData: false, 
        contentType: false, 
        success: function(response) {
            window.location.href = '/user/profile/' + userId + '?success=true';
        },
        error: function(xhr) {
            const errorMessage = xhr.responseText || 'Greška prilikom ažuriranja.';
            alert(errorMessage);
        }
    });
});


});