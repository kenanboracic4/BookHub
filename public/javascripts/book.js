$('#edit-book-form').on('submit', function (e) {
        e.preventDefault();
        const bookId = window.location.pathname.split('/')[3];
        
       
        const formData = new FormData(this);
        

        $.ajax({
            url: '/books/edit/' + bookId,
            method: 'PUT',
            data: formData,
            processData: false, 
            contentType: false, 
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


$(document).on('click', '#up-deleteBtn', function (e) {
    e.preventDefault();

    const bookId = $(this).data('id');
    const btn = $(this);

    Swal.fire({
            title: 'Da li želite obrisati knjigu?',
            text: "Ovim potvrđujete da ćete obrisati ovu knjigu.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27ae60',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, obriši!',
            cancelButtonText: 'Odustani',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/books/delete/' + bookId,
                    method: 'PUT',
                    success: function (response) {
                        Swal.fire('Uspješno!', response.message, 'success')
                            .then(() => { 
                               btn.closest('.up-book-row').find('.up-mini-status').text('Arhivirano');
                               btn.css('display', 'none');
                             });
                    },
                    error: function (xhr) {
                        Swal.fire('Greška!', 'Nije uspjelo brisanje knjige.', 'error');
                    }
                });
            }
        });


});