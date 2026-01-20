
// 1. GLOBALNA PORUKA 
window.openBroadcastModal = function() {
    Swal.fire({
        title: 'Nova globalna obavijest',
        text: 'Svi korisnici će dobiti ovu poruku u svoj Inbox.',
        input: 'textarea',
        inputPlaceholder: 'Unesite tekst poruke ovdje...',
        showCancelButton: true,
        confirmButtonText: 'Pošalji svima',
        confirmButtonColor: '#2563eb',
        cancelButtonText: 'Odustani',
        showLoaderOnConfirm: true,
        preConfirm: (message) => {
            if (!message) {
                Swal.showValidationMessage('Poruka ne može biti prazna!');
                return false;
            }
            return $.ajax({
                url: '/admin/broadcast',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ content: message })
            }).catch(error => {
                Swal.showValidationMessage(`Greška: ${error.responseJSON?.message || 'Neuspješno slanje'}`);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Poslano!', 'Sistemska poruka je uspješno kreirana.', 'success');
        }
    });
};

// 2. (REPORT)
window.handleReport = function(id, action) {
    const actionText = action === 'dismiss' ? 'odbaciti ovu prijavu' : 'izvršiti sankciju';
    const confirmButtonColor = action === 'dismiss' ? '#64748b' : '#ef4444';

    Swal.fire({
        title: 'Jeste li sigurni?',
        text: `Želite li ${actionText}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Da, potvrdi!',
        cancelButtonText: 'Odustani'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `/admin/reports/${id}/${action}`,
                method: 'POST',
                success: function(response) {
                  
                    $(`#report-row-${id}`).fadeOut(500, function() {
                        $(this).remove();
                    });
                    
                    
                    setTimeout(() => {
                         if ($('tbody tr').length === 0) {
                             $('tbody').html(`
                                <tr>
                                    <td colspan="6" style="text-align: center; padding: 20px; color: #64748b;">
                                        Trenutno nema aktivnih prijava.
                                    </td>
                                </tr>
                             `);
                         }
                    }, 600);

                    Swal.fire('Uspješno!', response.message, 'success');
                },
                error: function(error) {
                    console.error(error);
                    Swal.fire('Greška!', 'Došlo je do problema prilikom obrade.', 'error');
                }
            });
        }
    });
};