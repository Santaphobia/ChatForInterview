// создаем HTTP-сервер
const server = require('http').createServer()
// подключаем к серверу Socket.IO
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

// Наша DB
const { Chat, User, UserChatRelation } = require('./models')

const log = console.log

// получаем обработчики событий
const registerMessageHandlers = require('./handlers/messageHandlers')
const registerUserHandlers = require('./handlers/userHandlers')
const videoChatHandlers = require('./handlers/videoChatHandlers')

const onConnection = (socket) => {

    log('User connected')

    const { roomId, userId } = socket.handshake.query

    const lastRoom = User.getLastRoom(userId, roomId)

    // Проверяем совпадает ли новая комната с предыдущей,
    // что бы оставить или убрать из нее пользователя
    if(lastRoom !== roomId) {
        UserChatRelation.removeUser(lastRoom, userId)
        User.changeLastRoom(userId, roomId)
    }

    socket.roomId = roomId
    socket.userId = userId

    socket.join(roomId)

    // Добавляем пользователя в комнату, если такая существует и пользователя в ней нет
    if(UserChatRelation.checkRoomById(socket.roomId) && !UserChatRelation.checkUserInRoom(socket.userId, socket.roomId)) {
        UserChatRelation.addUserInRoom(socket.userId, socket.roomId)
    }

    // регистрируем обработчики
    registerMessageHandlers(io, socket)
    registerUserHandlers(io, socket)
    videoChatHandlers(io, socket)

    socket.on('disconnect', () => {
        log('User disconnected')
        User.changeStatus(socket.userId, false)

        //Обновляем в каждой комнате, на стороне клиента, информацию о онлайн статусах
        Chat.getAllChats().forEach(chat => {
            io.to(chat).emit('users', UserChatRelation.getUsersInRoom(chat))
        })

        socket.leave(roomId)
    })
}

io.on('connection', onConnection)

const PORT = process.env.PORT || 5000
server.listen( PORT , () => {
    console.log(`Server ready. Port: ${PORT}`)
})
