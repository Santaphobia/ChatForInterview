import io from 'socket.io-client'
import {useEffect, useRef} from "react";

const SERVER_URL = 'http://localhost:5000'

export const useSocketRef = (roomId, userId) => {
    const socketRef = useRef(null)
    useEffect(() => {
        socketRef.current = io(SERVER_URL, {
            query: {roomId, userId}
        })

    }, [userId, roomId])

    return [ socketRef ]
}
