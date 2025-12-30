
module.exports = {


    async renderChatPage(req,res){


        res.render('chat');
    },

    async renderMessagePage(req,res){
        res.render('messages');
    }

}