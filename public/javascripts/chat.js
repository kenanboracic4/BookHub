$(document).ready(function () {
    const socket = io();

    // Ulazimo u sobu trenutne konverzacije (roomId je definisan u message.ejs)
    socket.emit('joinRoom', roomId);
    
    // NOVO: Ulazimo u ličnu sobu za notifikacije (currentUserId iz message.ejs)
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

    // Slušamo nove poruke u trenutno otvorenom chatu
    socket.on('newMessage', function(data){
        const messageClass = data.senderId == currentUserId ? 'outgoing' : 'incoming';
        
        // Dodajemo poruku u listu
        $('#messagesList').append(`
            <div class="message ${messageClass}">
                <div class="msg-bubble">${data.content}</div>
                <span class="msg-time">${new Date(data.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `);
        
        // Automatski scroll na dno
        $('#messagesList').scrollTop($('#messagesList')[0].scrollHeight);
    });

    // NOVO: Slušamo notifikacije za sve ostale chatove i globalni brojač
   // Slušamo notifikacije za update sidebara bez refresha
    socket.on('updateNotification', function(data) {
        // Pronađi konverzaciju u sidebaru pomoću data-id atributa
        const convBox = $(`.conv-link[data-id="${data.conversationId}"]`);
        
        if (convBox.length > 0) {
            // 1. POMJERANJE NA VRH: Uzmi cijeli HTML element te konverzacije
            const convHtml = convBox.clone(true); // clone(true) čuva i klik evente
            
            // 2. UKLONI ga sa trenutne pozicije i STAVI na početak liste
            convBox.remove();
            $('.conv-scroll-area').prepend(convHtml);
            
            // Ponovo selektuj taj novi (pomjereni) element da bi ga modifikovao
            const newConvBox = $(`.conv-link[data-id="${data.conversationId}"]`);

            // 3. STIL I BROJAČ: Ako to nije chat u kojem trenutno sjedimo, dodaj efekte
            if (data.conversationId != roomId) {
                newConvBox.addClass('unread-conversation');
                
                // Update malog kružića sa brojem poruka
                let badge = newConvBox.find('.unread-count-badge');
                if (badge.length > 0) {
                    badge.text(parseInt(badge.text()) + 1);
                } else {
                    newConvBox.find('.img-wrapper').append(`<span class="unread-count-badge">1</span>`);
                }

                // Update glavnog brojača u Headeru
                let mainCount = $('#main-message-count');
                if (mainCount.length > 0) {
                    let currentTotal = parseInt(mainCount.text()) || 0;
                    mainCount.text(currentTotal + 1);
                }
            }
            
            // 4. TEKST PORUKE: Promijeni naslov knjige ili dodaj preview zadnje poruke
            // Ako želiš da se ispod naslova knjige vidi tekst poruke, uradi ovo:
            

        } else {
            // Ako konverzacija uopšte ne postoji (neko ti je prvi put poslao poruku)
            // Ovdje je najbolje uraditi reload da Sequelize povuče sve asocijacije (ime, sliku, knjigu)
            // Alternativno, možeš kroz socket poslati CIJELI objekt konverzacije
           
            location.reload(); 
        }
    });

    // Klik na konverzaciju u sidebaru (označavanje kao pročitano)
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