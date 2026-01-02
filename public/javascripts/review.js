
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

              $(`.rate-btn-${bookId}`).addClass('disabled-btn');
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