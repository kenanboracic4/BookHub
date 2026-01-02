$(document).ready(function(){
    $('.archive').on('click',function(e){ // arhiva korisnika
        e.preventDefault();

        const userId = $(this).data('id');
        console.log(userId);

        Swal.fire({
            title: 'Arhiviraj korisnika?',
            text: "Ovim potvrđujete da ćete arhivirati korisnika.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Da, arhiviraj!',
            cancelButtonText: 'Odustani',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/admin/user/archive/' + userId,
                    method: 'PUT',
                    success: function (response) {
                        Swal.fire('Uspješno!', response.message, 'success')
                            .then(() => { 
                             $('.archive[data-id="' + userId + '"]').text('Arhivirano');
                             });
                    },
                    error: function (xhr) {
                        Swal.fire('Greška!', 'Nije uspjelo arhiviranje korisnika.', 'error');
                    }
                });
            }
        });
    })

});
