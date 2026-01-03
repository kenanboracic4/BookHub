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


// brisanje 

$(document).on('click', '.btn-delete', function (e) {
    
    const $btn = $(this);
    const id = $btn.data('id');
    const type = $btn.data('type'); 
    const $row = $btn.closest('tr');

    Swal.fire({
        title: 'Jeste li sigurni?',
        text: "Nećete moći vratiti ovaj podatak!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Da, obriši!',
        cancelButtonText: 'Odustani'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `/admin/catalog/${type}/${id}`,
                method: 'DELETE',
                success: function(response) {
                    if (response.success) {
                       
                        $row.fadeOut(400, function() {
                            $(this).remove();
                        });

                        Swal.fire({
                            icon: 'success',
                            title: 'Obrisano!',
                            toast: true,
                            position: 'bottom-end',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                },
                error: function() {
                    Swal.fire('Greška!', 'Nije moguće obrisati stavku.', 'error');
                }
            });
        }
    });
});


// edit
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    
    const $btn = $(this);
    const $row = $btn.closest('tr');
    const $nameCell = $row.find('td:first-child');
    const id = $btn.data('id');
    const type = $btn.data('type');

  
    const isEditing = $row.hasClass('editing-mode');

    if (!isEditing) {
       
        const currentName = $nameCell.text().trim();
        $row.addClass('editing-mode');

     
        $nameCell.html(`<input type="text" class="edit-input" value="${currentName}" style="width: 100%; padding: 4px; border: 1px solid #2563eb; border-radius: 4px;">`);

      
        $btn.html('<i class="fa-solid fa-check" style="color: #059669;"></i>');
        
      
        $nameCell.find('input').focus();

    } else {
       
        const newName = $nameCell.find('input').val().trim();

        if (!newName) {
            Swal.fire('Greška!', 'Polje ne smije biti prazno.', 'error');
            return;
        }

        $.ajax({
            url: `/admin/catalog/${type}/${id}`,
            method: 'PUT', 
            contentType: 'application/json',
            data: JSON.stringify({ name: newName }),
            success: function(response) {
                if (response.success) {
                    $nameCell.text(newName);
                    $row.removeClass('editing-mode');
                    $btn.html('<i class="far fa-edit"></i>'); 

                    Swal.fire({
                        icon: 'success',
                        title: 'Spremljeno!',
                        toast: true,
                        position: 'bottom-end',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            },
            error: function(xhr) {
                console.error("Greška sa servera:", xhr.status);
                Swal.fire('Greška!', 'Server nije prihvatio izmjenu.', 'error');
            }
        });
    }
});