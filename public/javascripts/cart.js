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
                $('#cart-badge').text(data.cartCount);

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
                $('#cartNav').css('width', '300px');
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
                        <button class="remove-item" onclick="ukloniIzKorpe(${knjiga.id})">
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