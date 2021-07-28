import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
// styles
import { Container } from 'react-bootstrap'
// components
import { Home } from "./components/Home";
import { ChatRoom } from "./components/ChatRoom";



export const App = () => (
  <Router>
    <Container style={{ maxWidth: '1280px' }}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/:roomId" component={ChatRoom}/>
          <Route path="*" render={({location}) => (
              <Redirect
                  to={{
                      pathname: "/",
                      state: { from: location }
                  }}
              />
          )} />
      </Switch>
    </Container>
  </Router>
)
