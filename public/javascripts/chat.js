



$(document).ready(function () {
    const socket = io();

    socket.emit('joinRoom',roomId);

    $('#chatForm').on('submit', function (e) {
        e.preventDefault();

        const message = $('#messageInput').val();
        if (!message) {
            return;
        }
        socket.emit('sendMessage',{ // salje poruku na server
            conversationId: roomId,
            senderId: currentUserId,
            content: message
        });

        $('#messageInput').val(''); 
        return false;

        })
    
    socket.on('newMessage', function(data){ // slusa poruke koje dodju na server
        console.log('uslo');
        const messageClass = data.senderId == currentUserId ? 'outgoing' : 'incoming';
        
        $('#messagesList').append(`
            <div class="message ${messageClass}">
                <div class="msg-bubble">
                    ${data.content}
                </div>
                <span class="msg-time">
                    ${new Date(data.createdAt).toLocaleTimeString('en-US')}
                </span>
            </div>
        `);
        if(data.senderId == currentUserId) {
        $('#messageInput').val('');
    }
    });

});