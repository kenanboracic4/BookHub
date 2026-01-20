/* public/javascripts/bookDetail.js */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. TOAST NOTIFIKACIJE (Provjera URL parametara)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        Toast.fire({
            icon: 'success',
            title: 'Akcija uspješna!'
        });
        // Ukloni parametar iz URL-a da se ne prikazuje ponovo na refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. PREUZIMANJE PODATAKA IZ EJS-a (Most)
    // Ovi podaci su definirani u EJS fajlu prije učitavanja ove skripte
    const context = window.bookContext || {};
    // Ako ti trebaju roomId ili currentUserId kasnije u JS-u, dostupni su ovdje:
    // console.log("User ID:", context.currentUserId);

    // 3. AJAX PRIJAVA (REPORT)
    $('#reportForm').on('submit', function (e) {
        e.preventDefault();

        const formData = {
            reportedUserId: $('input[name="targetId"]').val(),
            reason: $('select[name="reason"]').val(),
            description: $('textarea[name="description"]').val(),
            type: 'KNJIGA'
        };

        $.ajax({
            url: '/admin/reports/user',
            method: 'POST',
            data: formData,
            success: function (response) {
                window.closeReportModal(); // Pozivamo funkciju definiranu ispod
                Swal.fire({
                    icon: 'success',
                    title: 'Prijavljeno!',
                    text: 'Hvala vam. Administratori će pregledati ovaj oglas.',
                    confirmButtonColor: '#2563eb'
                });
                $('#reportForm')[0].reset();
            },
            error: function (err) {
                console.error(err);
                Swal.fire('Greška!', 'Došlo je do problema prilikom slanja prijave.', 'error');
            }
        });
    });
});

/* --- GLOBALNE FUNKCIJE ZA MODALE --- */
/* Moraju biti na window objektu jer ih pozivaš preko onclick="" u HTML-u */

// Report Modal
window.openReportModal = function() {
    document.getElementById('reportModal').style.display = 'flex';
};

window.closeReportModal = function() {
    document.getElementById('reportModal').style.display = 'none';
};

// Comment Modal
window.openCommentModal = function() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Spriječi skrolanje pozadine
};

window.closeCommentModal = function() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Vrati skrolanje
};

// Zatvaranje na klik izvan modala (Objedinjeno)
window.onclick = function (event) {
    const reportModal = document.getElementById('reportModal');
    const commentModal = document.getElementById('commentModal');

    if (event.target === reportModal) {
        window.closeReportModal();
    }
    if (event.target === commentModal) {
        window.closeCommentModal();
    }
};