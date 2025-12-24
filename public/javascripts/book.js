$('#edit-book-form').on('submit', function (e) {
        e.preventDefault();
        const bookId = window.location.pathname.split('/')[3];
        
       
        const formData = new FormData(this);

        $.ajax({
            url: '/books/edit/' + bookId,
            method: 'PUT',
            data: formData,
            processData: false, // Obavezno za FormData
            contentType: false, // Obavezno za FormData
            success: function () {
                window.location.href = '/books/details/' + bookId + '?success=true';
            },
           error: function(xhr) {
                const errorMessage = xhr.responseText || 'Došlo je do greške prilikom prijave.';
                $('#error-message').text(errorMessage);
               $('#error-container').css('display', 'flex');
                console.log(errorMessage);
            }
        });
    });