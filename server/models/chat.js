const { nanoid } = require('nanoid')

const { low, FileSync } = require('./initdb')

const adapter = new FileSync('db/chat.json')

const db = low(adapter)

class Chat {

    static checkRoomById(roomId) {
       return !!db.getState()[roomId]
    }

    static createRoom(roomId) {
        db.getState()[roomId] = []
        db.write()
    }

    static getMessageById(roomId) {
        return db.getState()[roomId]
    }

    static getAllChats() {
        return Object.getOwnPropertyNames(db.getState())
    }

    static addMessageInRoom(message, roomId) {
        db.getState()[roomId]
            .push({
                // генерируем идентификатор с помощью nanoid, 8 - длина id
                messageId: nanoid(8),
                createdAt: new Date(),
                ...message
            })
        db.write()
    }

    static removeMessageById(messageId, roomId) {
        db.get(roomId).remove({ messageId }).write()
    }

}

module.exports = Chat


