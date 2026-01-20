
document.addEventListener('DOMContentLoaded', function () {


    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('success') === 'true') {
        
        if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: 'success',
                title: 'Profil uspješno ažuriran!'
            });
        }

      
        window.history.replaceState({}, document.title, window.location.pathname);
    }

   
    
    const filterBtn = document.getElementById('filterBtn');

    
    const filterBooks = () => {
        const statusElement = document.getElementById('statusFilter');
        const dateElement = document.getElementById('dateFilter');
        const priceElement = document.getElementById('priceFilter');
        const titleElement = document.getElementById('titleFilter');

      
        if (!statusElement) return;

        const status = statusElement.value;
        const date = dateElement.value;
        const price = priceElement.value;
        const title = titleElement.value;

        const params = new URLSearchParams();

        if (status !== 'all') params.append('status', status);

        
        if (price !== "") {
            params.append('price', price);
        } else if (title !== "") {
            params.append('title', title);
        } else if (date !== "") {
            params.append('date', date);
        }

        
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    
    if (filterBtn) {
        filterBtn.addEventListener('click', filterBooks);
    }
});