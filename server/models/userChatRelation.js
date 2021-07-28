const User = require('./users')

const { low, FileSync } = require('./initdb')

const adapter = new FileSync('db/user_chat_relation.json')

const db = low(adapter)

class UserChatRelation {

    static createRelationUserChatTable(roomId) {
        db.getState()[roomId] = []
        db.write()
    }

    static addUserInRoom(userId, roomId) {
        db.getState()[roomId].push(userId)
        db.write()
    }

    static checkRoomById(roomId) {
        return !!db.getState()[roomId]
    }

    static checkUserInRoom(userId, roomId) {
        return db.getState()[roomId].includes(userId)
    }

    static getUsersInRoom(roomId) {
        return User.getUsersByArrayId(db.getState()[roomId])
    }

    static getUsersArrayInRoom(roomId, userId) {
        return db.getState()[roomId].filter(id => id !== userId)
    }

    static removeUser(roomId, userId) {
        db.get(roomId).pull(userId).write()
    }


}

module.exports = UserChatRelation
