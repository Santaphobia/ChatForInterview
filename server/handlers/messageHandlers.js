const { Chat } = require('../models/index')
const { UserChatRelation }  = require('../models/index')

module.exports = (io, socket) => {

    const roomId = socket.roomId
    const userId = socket.userId

    const getMessages = () => {

        if(!Chat.checkRoomById(roomId)) {
            Chat.createRoom(roomId)
            UserChatRelation.createRelationUserChatTable(roomId)
            UserChatRelation.addUserInRoom(userId, roomId)
        }

        const messages = Chat.getMessageById(roomId)

        Chat.getAllChats().forEach(chat => {
            io.to(chat).emit('users', UserChatRelation.getUsersInRoom(chat))
        })
        io.in(socket.roomId).emit('messages', messages)
    }

    const getChats = () => {
        const chats = Chat.getAllChats()
        io.to(chats).emit('chats', chats)
    }

    const addMessage = (message) => {
        Chat.addMessageInRoom(message, roomId)
        // выполняем запрос на получение сообщений
        getMessages()
    }

    const removeMessage = (messageId) => {
        Chat.removeMessageById(messageId, roomId)
        getMessages()
    }

    socket.on('message:get', getMessages)
    socket.on('message:add', addMessage)
    socket.on('message:remove', removeMessage)
    socket.on('message:chats', getChats)
}
