$(document).ready(function () {

    // 1. CHECKOUT (Kupovina iz korpe)
    $(document).on('click', '#checkoutBtn', function (e) {
        e.preventDefault();
        console.log("Šaljem AJAX za checkout...");

        $.ajax({
            url: '/orders/checkout',
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    window.location.href = '/orders';
                }
            },
            error: function (xhr) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška pri kupovini.';
                alert(errorMessage);
            }
        });
    });

    // PRIHVATI NARUDZBU (Prodaja)
    $(document).on('click', '.ord-accept-btn', function (e) {
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
                    success: function (response) {
                        Swal.fire('Uspješno!', 'Narudžba je prihvaćena.', 'success')
                            .then(() => { location.reload(); });
                    },
                    error: function (xhr) {
                        Swal.fire('Greška!', 'Nije uspjelo ažuriranje statusa.', 'error');
                    }
                });
            }
        });
    });

    //  ODBIJ NARUDZBU (Prodaja)
    $(document).on('click', '.ord-reject-btn', function (e) {
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
                    success: function (response) {
                        Swal.fire('Odbijeno!', 'Narudžba je otkazana.', 'success')
                            .then(() => location.reload());
                    },
                    error: function (xhr) {
                        Swal.fire('Greška!', 'Neuspješno odbijanje.', 'error');
                    }
                });
            }
        });
    });

    // OKTAZI NARUDBU (KUPAC)
    $(document).on('click', '.ord-btn-cancel', function (e) {
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
                    success: function (response) {
                        Swal.fire('Narudžba otkazana!', 'Narudžba je otkazana.', 'success')
                            .then(() => location.reload());
                    },
                    error: function (xhr) {
                        Swal.fire('Greška!', 'Neuspješno otkazivanje.', 'error');
                    }
                });
            }
        });
    })



});


// rating window 

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('ratingOverlay');
    const bookIdInput = document.getElementById('modalBookId');
    const sellerIdInput = document.getElementById('modalSellerId');
    const bookTitleSpan = document.getElementById('modalBookTitle');

    function openRatingModal(bookId, bookTitle, sellerId) {

        bookIdInput.value = bookId;
        sellerIdInput.value = sellerId;
        bookTitleSpan.textContent = bookTitle;

        console.log(sellerIdInput.value);
        overlay.classList.add('active');

    }

    function closeRatingModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }


    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeRatingModal();
        }
    });
    window.openRatingModal = openRatingModal;
    window.closeRatingModal = closeRatingModal;
});


$(document).on('submit', '#ratingForm', function (e) {
    e.preventDefault();






    const userRating = $('#userRating').val();
    const bookRating = $('#bookRating').val();
    const bookComment = $('#comment').val();
    const sellerId = $('#modalSellerId').val();
    const bookId = $('#modalBookId').val();




    $.ajax({
        url: '/orders/rate',
        method: 'POST',
        data: {
            userRating: parseInt(userRating),
            bookRating: parseInt(bookRating),
            bookComment: bookComment,
            sellerId: parseInt(sellerId),
            bookId: parseInt(bookId)
        },
        success: function (response) {
            closeRatingModal();
            Swal.fire({
                icon: 'success',
                title: 'Recenzija uspješno izvršena!',
                timer: 2000,
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false
            }).then(() => {

                location.reload(); // da nestane button za ocjenjivanje
            });
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška!';
            Swal.fire({
                icon: 'error',
                title: 'Greška!',
                text: errorMessage,
                timer: 3000,
                toast: true,
                position: 'bottom-end'
            });
            submitBtn.prop('disabled', false);
        }
    });
});