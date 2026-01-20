/* public/javascripts/chatUI.js */

document.addEventListener('DOMContentLoaded', function () {
    
    // Dohvaćamo podatke iz "mosta" (ako ti zatrebaju u ovoj skripti)
    const config = window.chatConfig || {};

    // --- LOGIKA ZA SLANJE PRIJAVE (REPORT) ---
    $('#reportForm').on('submit', function(e) {
        e.preventDefault();

        const formData = {
            reportedUserId: $('input[name="reportedUserId"]').val(),
            reason: $('select[name="reason"]').val(),
            description: $('textarea[name="description"]').val(),
            type: 'KORISNIK' 
        };

        $.ajax({
            url: '/admin/reports/user', 
            method: 'POST',
            data: formData,
            success: function(response) {
                window.closeReportModal(); // Pozivamo globalnu funkciju
                
                // Provjera da li postoji SweetAlert
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Poslano!', 'Vaša prijava je zaprimljena.', 'success');
                } else {
                    alert('Vaša prijava je zaprimljena.');
                }
                
                $('#reportForm')[0].reset(); 
            },
            error: function(err) {
                console.error(err);
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Greška!', 'Došlo je do greške prilikom slanja prijave.', 'error');
                } else {
                    alert('Došlo je do greške.');
                }
            }
        });
    });
});

/* --- GLOBALNE FUNKCIJE ZA MODAL --- */
/* Moraju biti na window objektu zbog onclick="" u HTML-u */

window.openReportModal = function() {
    const modal = document.getElementById('reportModal');
    if(modal) modal.style.display = 'flex';
};

window.closeReportModal = function() {
    const modal = document.getElementById('reportModal');
    if(modal) modal.style.display = 'none';
};

// Zatvaranje na klik izvan modala
window.onclick = function(event) {
    const modal = document.getElementById('reportModal');
    if (event.target == modal) {
        window.closeReportModal();
    }
};