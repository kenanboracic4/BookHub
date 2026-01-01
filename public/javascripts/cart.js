$(document).on('click', '.btn-buy-book', function (e) { // dodavanje u korpu 
    e.preventDefault();

   
    const bookId = $(this).data('id');
    $('#cart-message').hide();

    $.ajax({
        url: '/cart/add/' + bookId,
        method: 'POST',
        success: function (data) {
            if (data.success) {
              
                $('.cart-count-bubble, .cart-badge-count').text(data.cartCount).show();

                Swal.fire({
                    icon: 'success',
                    title: 'Dodano u korpu!',
                    text: data.message,
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });

                
                $('#cartNav').css('width', '460px');
                $('#overlay').show();

                osvjeziSadrzajKorpe();
            }
        },
        error: function(xhr){
          const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'Došlo je do greške';
        
        Swal.fire({
                    icon: 'error',
                    title: errorMsg,
                    timer: 1000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
        }
    });
});

function osvjeziSadrzajKorpe() {
    $.get('/cart/items', function(data) {
        if (data.success) {
            const container = $('#cartContent');
            container.empty();

            if (data.items.length === 0) {
                container.append('<p class="empty-cart-msg">Vaša korpa je prazna.</p>');
                $('#cartTotalSum').text('0.00 KM');
                return;
            }

            let ukupno = 0;
            data.items.forEach(item => {
                const knjiga = item.Book;
                ukupno += parseFloat(knjiga.price);

               
                const itemHtml = `
                    <div class="cart-item">
                        <img src="${knjiga.imageUrl || '/images/default-book.png'}" alt="${knjiga.title}">
                        <div class="cart-item-info">
                            <h4>${knjiga.title}</h4>
                            <p>${parseFloat(knjiga.price).toFixed(2)} KM</p>
                        </div>
                        <button class="remove-item" onclick="deleteItem(${knjiga.id})">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                `;
                container.append(itemHtml);
            });

            $('#cartTotalSum').text(ukupno.toFixed(2) + ' KM');
        }
    });
}
function deleteItem(id) {
    $.ajax({
        url: '/cart/delete/' + id,
        method: 'DELETE',
        success: function (data) {
            if (data.success) {
              
                $('.cart-count-bubble, .cart-badge-count').text(data.cartCount);
                
                
                osvjeziSadrzajKorpe();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Uklonjeno!',
                    timer: 1000,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                });
            }
        },
        error: function(err) {
            console.log("Greška pri brisanju:", err);
        }
    });
}