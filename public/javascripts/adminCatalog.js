$(document).ready(function() {
    $('#genre-inline-form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const genreName = $(this).find('input[name="name"]').val();
        
        $.ajax({
            url: '/admin/catalog/genre',
            method: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify({
                name: genreName
            }),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uspješno dodano!',
                    timer: 2000,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                }).then(() => {
                    $form.closest('.catalog-card').find('.simple-table tbody').append(`
                        <tr>
                            <td>${genreName}</td>
                            <td class="text-right">
                                <button class="btn-icon-only btn-delete"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                    
                    $form.find('input[name="name"]').val('');
                });
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška pri dodavanju žanra.';
                Swal.fire({
                    icon: 'error',
                    title: 'Greška!',
                    text: errorMessage,
                    timer: 3000,
                    toast: true,
                    position: 'bottom-end'
                });
            }
        }); 
    });

    $('#language-inline-form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const languageName = $(this).find('input[name="name"]').val();
        
        $.ajax({
            url: '/admin/catalog/language',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: languageName
            }),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uspješno dodano!',
                    timer: 2000,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                }).then(() => {
                    $form.closest('.catalog-card').find('.simple-table tbody').append(`
                        <tr>
                            <td>${languageName}</td>
                            <td class="text-right">
                                <button class="btn-icon-only btn-delete"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                    
                    $form.find('input[name="name"]').val('');
                });
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška pri dodavanju jezika.';
                Swal.fire({
                    icon: 'error',
                    title: 'Greška!',
                    text: errorMessage,
                    timer: 3000,
                    toast: true,
                    position: 'bottom-end'
                });
            }
        }); 
    });

   
    
    $('#location-inline-form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const locationName = $form.find('input[name="name"]').val();
        
        $.ajax({
            url: '/admin/catalog/location',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: locationName
            }),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uspješno dodano!',
                    timer: 2000,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                }).then(() => {
                    $form.closest('.catalog-card').find('.simple-table tbody').append(`
                        <tr>
                            <td>${locationName}</td>
                            <td class="text-right">
                                <button class="btn-icon-only btn-delete"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                    $form.find('input[name="name"]').val('');
                });
            },
                error: function(xhr) {
                    const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Greška!',
                        text: errorMessage,
                        timer: 3000,
                        toast: true,
                        position: 'bottom-end'
                    });
                }
            }); 
        });
    });
    
       $('#condition-inline-form').on('submit', function(e) {
        e.preventDefault(); 
        
        const $form = $(this);
        const conditionName = $form.find('input[name="name"]').val();
        
        $.ajax({
            url: '/admin/catalog/condition',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: conditionName
            }),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uspješno dodano!',
                    timer: 2000,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                }).then(() => {
                    $form.closest('.catalog-card').find('.simple-table tbody').append(`
                        <tr>
                            <td>${conditionName}</td>
                            <td class="text-right">
                                <button class="btn-icon-only btn-delete"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                    $form.find('input[name="name"]').val('');
                });
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Greška.';
                Swal.fire({
                    icon: 'error',
                    title: 'Greška!',
                    text: errorMessage,
                    timer: 3000,
                    toast: true,
                    position: 'bottom-end'
                });
            }
        }); 
    

   
    

    

});