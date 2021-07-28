import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

import { useLocalStorage, useSocketRef } from '../hooks'

export const useChat = (roomId) => {
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])

  const [userId] = useLocalStorage('userId', nanoid(8))
  const [username] = useLocalStorage('username')
  const [socketRef] = useSocketRef(roomId, userId)

  useEffect(() => {

    socketRef.current.emit('user:add', { username, userId })
    socketRef.current.on('users', (users) => {
      setUsers(users)
    })

    socketRef.current.emit('message:get')
    socketRef.current.on('messages', (messages) => {
      const newMessages = messages.map((msg) =>
        msg.userId === userId ? { ...msg, currentUser: true } : msg
      )
      setMessages(newMessages)
    })

    socketRef.current.emit('message:chats')
    socketRef.current.on('chats', (chats) => {
      setChats(chats)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, userId, username, socketRef])


  const sendMessage = ({ messageText, senderName }) => {
    socketRef.current.emit('message:add', {
      userId,
      messageText,
      senderName
    })
  }

  const removeMessage = (id) => {
    socketRef.current.emit('message:remove', id)
  }

  return { users, messages, chats, sendMessage, removeMessage, socketRef }
}
