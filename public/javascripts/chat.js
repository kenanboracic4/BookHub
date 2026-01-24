$(document).ready(function () {
    const socket = io();

   
    socket.emit('joinRoom', roomId);
    
    //  Ulaz u sobu za notifikacije 
    socket.emit('joinUserGlobal', currentUserId);

    // Slanje poruke putem forme
    $('#chatForm').on('submit', function (e) {
        e.preventDefault();
        const message = $('#messageInput').val();
        if (!message) return;

        socket.emit('sendMessage', {
            conversationId: roomId,
            senderId: currentUserId,
            content: message
        });

        $('#messageInput').val(''); 
    });

    // Slusa nove poruke u trenutno otvorenom chatu
    socket.on('newMessage', function(data){
        const messageClass = data.senderId == currentUserId ? 'outgoing' : 'incoming';
        
        // Dodaj poruku u listu
        $('#messagesList').append(`
            <div class="message ${messageClass}">
                <div class="msg-bubble">${data.content}</div>
                <span class="msg-time">${new Date(data.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `);
        
       
        $('#messagesList').scrollTop($('#messagesList')[0].scrollHeight);
    });

    // Slusamo notifikacije za sve ostale chatove 
    // mijenjanje konverzacije
    socket.on('updateNotification', function(data) {
       
        const convBox = $(`.conv-link[data-id="${data.conversationId}"]`);
        
        if (convBox.length > 0) {
          
            const convHtml = convBox.clone(true); 
            
            
            convBox.remove();
            $('.conv-scroll-area').prepend(convHtml);
            
           
            const newConvBox = $(`.conv-link[data-id="${data.conversationId}"]`);

           
            if (data.conversationId != roomId) {
                newConvBox.addClass('unread-conversation');
                
               
                let badge = newConvBox.find('.unread-count-badge');
                if (badge.length > 0) {
                    badge.text(parseInt(badge.text()) + 1);
                } else {
                    newConvBox.find('.img-wrapper').append(`<span class="unread-count-badge">1</span>`);
                }

              
                let mainCount = $('#main-message-count');
                if (mainCount.length > 0) {
                    let currentTotal = parseInt(mainCount.text()) || 0;
                    mainCount.text(currentTotal + 1);
                }
            }
        
            

        } else {
         
            location.reload(); 
        }
    });

    // Klik na konverzaciju u sidebaru (seen)
    $('.conv-link').click(function(e){
        e.preventDefault();
        const convId = $(this).data('id');

        $.ajax({
            url: '/chat/read/' + convId,
            method: 'PUT',
            success: function () {
                window.location.href = '/chat/inbox/' + convId;
            },
            error: function (xhr) {
                console.error("Greška pri markiranju:", xhr);
            }
        });
    });
});