$(document).on('click', '.btn-buy-book', function (e) {
    e.preventDefault();

    // Uzmi ID iz data-id atributa dugmeta koje je kliknuto
    const bookId = $(this).data('id');

    $.ajax({
        url: '/cart/add/' + bookId,
        method: 'POST',
        success: function (data) {
            if (data.success) {
                // Ažuriraj broj u krugu koristeći ID koji smo stavili
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

                // Otvori meni
                $('#cartNav').css('width', '460px');
                $('#overlay').show();

                osvjeziSadrzajKorpe();
            }
        }
    });
});

function osvjeziSadrzajKorpe() {
    $.get('/cart/items', function(data) {
        if (data.success) {
            const container = $('#cartContent');
            container.empty(); // Očisti stari sadržaj

            if (data.items.length === 0) {
                container.append('<p class="empty-cart-msg">Vaša korpa je prazna.</p>');
                $('#cartTotalSum').text('0.00 KM');
                return;
            }

            let ukupno = 0;
            data.items.forEach(item => {
                const knjiga = item.Book;
                ukupno += parseFloat(knjiga.price);

                // Generišemo HTML za svaku stavku
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
                // AŽURIRAMO OBA BROJAČA KOJA IMAŠ U HEADERU
                $('.cart-count-bubble, .cart-badge-count').text(data.cartCount);
                
                // Ponovo učitavamo stavke da se ukloni obrisana
                osvjeziSadrzajKorpe();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Uklonjeno!',
                    timer: 1000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
            }
        },
        error: function(err) {
            console.log("Greška pri brisanju:", err);
        }
    });
}