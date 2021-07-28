import { useParams } from 'react-router-dom'

import { useLocalStorage, useChat, useVideoChat } from '../hooks'

import { MessageForm } from './MessageForm'
import { MessageList } from './MessageList'
import { UserList } from './UserList'
import { ChatList } from './ChatList'
import { Video } from "./Video";

import { Container } from 'react-bootstrap'
import styled from "styled-components";


const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

export function ChatRoom() {
    const { roomId } = useParams()
    const [username] = useLocalStorage('username', 'anonimus')
    const { users, messages, chats, sendMessage, removeMessage, socketRef } = useChat(roomId)
    const { userVideoRef, peers } = useVideoChat(roomId, socketRef)

  return (
    <Container>
      <h2 className='text-center'>Room: {roomId}</h2>
        <UserList users={users} />
        <Container className='d-flex justify-content-between'>
            <Container style={{ maxWidth: '5%' }} className='d-flex flex-column'>
                <ChatList chats={chats} />
            </Container>
            <Container style={{ maxWidth: '55%' }}>
                <MessageList messages={messages} removeMessage={removeMessage} />
            </Container>
            <Container style={{ maxWidth: '35%' }}>
                <StyledVideo muted ref={userVideoRef} autoPlay playsInline />
                {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                    );
                })}
            </Container>
        </Container>
      <MessageForm username={username} sendMessage={sendMessage} />
    </Container>
  )
}
