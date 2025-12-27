$(document).ready(function() {

    // 1. CHECKOUT (Kupovina iz korpe)
    $(document).on('click', '#checkoutBtn', function(e) {
        e.preventDefault();
        console.log("Šaljem AJAX za checkout..."); 

        $.ajax({
            url: '/orders/checkout',
            method: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    window.location.href = '/orders';
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška pri kupovini.';
                alert(errorMessage);
            }
        });
    });

    // PRIHVATI NARUDZBU (Prodaja)
    $(document).on('click', '.ord-accept-btn', function(e) {
        e.preventDefault();
        const orderId = $(this).data('id');

        Swal.fire({
            title: 'Prihvatiti narudžbu?',
            text: "Ovim potvrđujete da ćete poslati knjigu kupcu.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27ae60',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, prihvati!',
            cancelButtonText: 'Odustani',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/orders/accept/' + orderId,
                    method: 'PUT',
                    success: function(response) {
                        Swal.fire('Uspješno!', 'Narudžba je prihvaćena.', 'success')
                            .then(() => { location.reload(); });
                    },
                    error: function(xhr) {
                        Swal.fire('Greška!', 'Nije uspjelo ažuriranje statusa.', 'error');
                    }
                });
            }
        });
    });

    //  ODBIJ NARUDZBU (Prodaja)
    $(document).on('click', '.ord-reject-btn', function(e) {
        e.preventDefault();
        const orderId = $(this).data('id');

        Swal.fire({
            title: 'Odbiti narudžbu?',
            text: "Želite li zaista odbiti ovu prodaju?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Da, odbij!',
            cancelButtonText: 'Odustani',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/orders/reject/' + orderId,
                    method: 'PUT',
                    success: function(response) {
                        Swal.fire('Odbijeno!', 'Narudžba je otkazana.', 'success')
                            .then(() => location.reload());
                    },
                    error: function(xhr) {
                        Swal.fire('Greška!', 'Neuspješno odbijanje.', 'error');
                    }
                });
            }
        });
    });

    // OKTAZI NARUDBU (KUPAC)
    $(document).on('click', '.ord-btn-cancel', function(e) {
        e.preventDefault();

         const orderId = $(this).data('id');

        Swal.fire({
            title: 'Otkaži narudžbu?',
            text: "Želite li zaista otkazati ovu narudžbu?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Da, odbij!',
            cancelButtonText: 'Odustani',
            reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/orders/cancel/' + orderId,
                        method: 'PUT',
                        success: function(response) {
                            Swal.fire('Narudžba otkazana!', 'Narudžba je otkazana.', 'success')
                                .then(() => location.reload());
                        },
                        error: function(xhr) {
                            Swal.fire('Greška!', 'Neuspješno otkazivanje.', 'error');
                        }
                    });
                }
            });
    })

});