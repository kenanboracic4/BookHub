

document.addEventListener('DOMContentLoaded', () => {
    
   
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sideNav = document.getElementById('sideNav');

    
    const cartTriggers = document.querySelectorAll('.cart-trigger');
    const cartNav = document.getElementById('cartNav');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const overlay = document.getElementById('overlay');

    
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterPanel = document.getElementById('filterPanel');

    
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');

   
    
    const closeAll = () => {
        if (sideNav) sideNav.classList.remove('open');
        if (cartNav) cartNav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');

       
        if (filterPanel && filterPanel.classList.contains('active')) {
            filterPanel.classList.remove('active');
            if (filterToggleBtn) filterToggleBtn.classList.remove('active');
        }
        
        document.body.style.overflow = 'auto';
    };

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (sideNav) sideNav.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

   
    if (cartTriggers.length > 0) {
        cartTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (cartNav) cartNav.classList.add('open');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';

               
                if (typeof osvjeziSadrzajKorpe === 'function') {
                    osvjeziSadrzajKorpe();
                }
            });
        });
    }

    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (filterPanel) filterPanel.classList.toggle('active');
            filterToggleBtn.classList.toggle('active');
        });
    }


    if (closeBtn) closeBtn.addEventListener('click', closeAll);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeAll);
    if (overlay) overlay.addEventListener('click', closeAll);


    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeAll();
    });


    
    if (notifBtn && notifDropdown) {
       
        notifBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            notifDropdown.classList.toggle('active');
        });

       
        window.addEventListener('click', (e) => {
            if (notifDropdown.classList.contains('active')) {
               
                if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
                    notifDropdown.classList.remove('active');
                }
            }
        });
    }
});