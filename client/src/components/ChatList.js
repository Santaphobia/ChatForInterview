import { Nav } from 'react-bootstrap'


export const ChatList = ( {chats} ) => {

    const chatItemRender = (el) => {
        return (<Nav.Item key={el}>
            <Nav.Link href={`/${el}`}> {el} </Nav.Link>
        </Nav.Item>)
    }

    return (
        <Nav variant="tabs" >
            {chats.map(chatItemRender)}
        </Nav>
    )
}
