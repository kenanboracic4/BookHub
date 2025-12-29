$(document).ready(function () {
    $('.notif-item-link').click(function (e) {
        e.preventDefault(); 
        
        const $this = $(this);
        const notifId = $this.data('id');
        const targetUrl = $this.attr('href');

        $.ajax({
            url: '/notifications/read/' + notifId,
            method: 'PUT',
            success: function (data) {
                console.log("Notifikacija označena kao pročitana");
                
                window.location.href = targetUrl;
            },
            error: function (xhr) {
                console.error("Greška:", xhr);
                
                window.location.href = targetUrl;
            }
        });
    });
});