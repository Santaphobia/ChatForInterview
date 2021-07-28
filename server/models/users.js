const { low, FileSync } = require('./initdb')

const adapter = new FileSync('db/users.json')

const db = low(adapter)

class User {

    static checkUserById(id) {
        return !!db.getState().users[id]
    }

    static createUser(id, username, roomId, online = true) {
        db.getState().users[id] = { username, online: online, lastRoom: roomId }
        db.write()
    }

    static getLastRoom(id, roomId) {
        if(User.checkUserById(id)) {
            return db.getState().users[id].lastRoom
        }
        return roomId
    }

    static checkEqualsName(id, name) {
        return db.getState().users[id].username === name
    }

    static changeNameById(id, name) {
        db.getState().users[id].username = name
        db.write()
    }

    static changeStatus(id, status = true) {
        db.getState().users[id].online = status
        db.write()
    }

    static getUsersByArrayId(array = []) {
        let users = {}
        array.forEach( el => {
            if(el in db.getState().users) {
                users[el] = db.getState().users[el]
            }
        })

        return users
    }

    static changeLastRoom(id, roomId) {
        db.getState().users[id].lastRoom = roomId
        db.write()
    }


}

module.exports = User
