const { User }  = require('../models/index')
const { Chat } = require('../models/index')
const { UserChatRelation } = require('../models/index')

module.exports = (io, socket) => {

    const getUsers = () => {
        Chat.getAllChats().forEach(chat => {
            io.to(chat).emit('users', UserChatRelation.getUsersInRoom(chat))
        })
    }

    const addUser = ({ username, userId }) => {
        if (!User.checkUserById(userId)) {
            User.createUser(userId, username, socket.roomId, true)
        } else {
            if(!User.checkEqualsName(userId, username) ) {
                User.changeNameById(userId, username)
            }
            User.changeStatus(userId)
        }
        getUsers()
    }

    const getUsersArray = () => {
        io.to(socket.roomId).emit('all users array', UserChatRelation.getUsersArrayInRoom(socket.roomId, socket.userId))
    }

    socket.on('userArray:get', getUsersArray)
    socket.on('user:get', getUsers)
    socket.on('user:add', addUser)

}
