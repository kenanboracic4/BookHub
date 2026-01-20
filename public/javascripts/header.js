/* public/javascripts/header.js */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. SELEKTOVANJE ELEMENATA --- */
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sideNav = document.getElementById('sideNav');

    // Cart (Korpa) elementi
    const cartTriggers = document.querySelectorAll('.cart-trigger');
    const cartNav = document.getElementById('cartNav');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const overlay = document.getElementById('overlay');

    // Filter elementi
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterPanel = document.getElementById('filterPanel');

    // Notifikacije
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');

    /* --- 2. FUNKCIJE --- */
    
    const closeAll = () => {
        if (sideNav) sideNav.classList.remove('open');
        if (cartNav) cartNav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');

        // Zatvori filtere ako su otvoreni
        if (filterPanel && filterPanel.classList.contains('active')) {
            filterPanel.classList.remove('active');
            if (filterToggleBtn) filterToggleBtn.classList.remove('active');
        }
        
        document.body.style.overflow = 'auto'; // Vrati skrolanje
    };

    /* --- 3. EVENT LISTENERI --- */

    // Otvaranje lijevog menija
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (sideNav) sideNav.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Otvaranje korpe (može biti više dugmadi za otvaranje)
    if (cartTriggers.length > 0) {
        cartTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (cartNav) cartNav.classList.add('open');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Pozovi funkciju iz cart.js ako je učitana
                if (typeof osvjeziSadrzajKorpe === 'function') {
                    osvjeziSadrzajKorpe();
                }
            });
        });
    }

    // Toggle za filtere
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (filterPanel) filterPanel.classList.toggle('active');
            filterToggleBtn.classList.toggle('active');
        });
    }

    // Zatvaranje (X dugmad i Overlay)
    if (closeBtn) closeBtn.addEventListener('click', closeAll);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeAll);
    if (overlay) overlay.addEventListener('click', closeAll);

    // Zatvaranje na ESC tipku
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeAll();
    });

    /* --- 4. LOGIKA ZA NOTIFIKACIJE --- */
    
    if (notifBtn && notifDropdown) {
        // Toggle na klik zvonceta
        notifBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stopira da klik ne ode na window odmah
            notifDropdown.classList.toggle('active');
        });

        // Zatvaranje na klik bilo gdje sa strane
        window.addEventListener('click', (e) => {
            if (notifDropdown.classList.contains('active')) {
                // Ako klik nije na zvoncetu I nije unutar dropdown-a
                if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
                    notifDropdown.classList.remove('active');
                }
            }
        });
    }
});