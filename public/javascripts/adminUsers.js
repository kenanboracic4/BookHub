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

    $('.block').on('click', function(e) {
        e.preventDefault();
        
          const userId = $(this).data('id');
        console.log(userId);


        Swal.fire({
            title: 'Blokiranje korisnika',
            text: "Odaberite trajanje zabrane pristupa:",
            icon: 'warning',
            input: 'radio',
            inputOptions: {
                '15': 'Privremeni ban (15 dana)',
                'permanent': 'Trajni ban'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Morate odabrati jednu opciju!';
                }
            },
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Potvrdi ban',
            cancelButtonText: 'Odustani',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const banType = result.value; // '15' ili 'permanent'

                $.ajax({
                    url: '/admin/user/ban/' + userId,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ duration: banType }),
                    success: function (response) {
                        Swal.fire('Blokiran!', response.message, 'success')
                            .then(() => {
                                // Promijeni izgled dugmeta ili status u tabeli
                                const btn = $('.block').filter(function() {
                                    return $(this).closest('tr').find('td:nth-child(4)').text().trim() === userId;
                                });
                                btn.text('Banovan').prop('disabled', true).css('background', '#64748b');
                            });
                    },
                    error: function (xhr) {
                        Swal.fire('Greška!', 'Nije uspjelo blokiranje korisnika.', 'error');
                    }
                });
            }
        });
    });

});
