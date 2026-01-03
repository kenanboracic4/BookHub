document.addEventListener('DOMContentLoaded', function() {
    const data = window.adminData;
    const colors = {
        blue: '#2563eb',
        green: '#059669',
        red: '#dc2626',
        orange: '#d97706',
        purple: '#7c3aed',
        gray: '#9ca3af'
    };

    // 1. KORISNICI
    new Chart(document.getElementById('usersChart'), {
        type: 'doughnut',
        data: {
            labels: ['Prodavači', 'Kupci'],
            datasets: [{
                data: [data.users.prodavaci, data.users.kupci],
                backgroundColor: [colors.blue, colors.purple]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 2. STATUS KNJIGA
    new Chart(document.getElementById('booksStatusChart'), {
        type: 'pie',
        data: {
            labels: ['Aktivno', 'Prodano', 'Arhivirano'],
            datasets: [{
                data: [data.books.aktivno, data.books.prodano, data.books.arhivirano],
                backgroundColor: [colors.green, colors.blue, colors.gray]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 3. OGLASI
    new Chart(document.getElementById('ordersChart'), {
        type: 'polarArea',
        data: {
            labels: ['Završeno', 'Otkazano', 'Odbijeno'],
            datasets: [{
                data: [data.orders.zavrseno, data.orders.otkazano, data.orders.odbijeno],
                backgroundColor: [colors.green, colors.orange, colors.red]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 4. ŽANROVI
    new Chart(document.getElementById('genresChart'), {
        type: 'bar',
        data: {
            labels: data.popularGenres.map(g => g.genre?.name || 'N/A'),
            datasets: [{
                label: 'Broj knjiga',
                data: data.popularGenres.map(g => parseInt(g.bookCount)),
                backgroundColor: colors.blue
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
});