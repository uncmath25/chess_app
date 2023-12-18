import { Button, Navbar, Nav } from 'react-bootstrap';

// import { getResource } from '../utils/apiClient';
import * as Game from '../utils/game';
import { getPaddingStyle } from '../utils/style';

const LOGO = require('../../assets/logo.ico');
const TITLE = 'Chess App';

export default function Header(props) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>
        <span style={getPaddingStyle(5)} />
        <img
          alt=""
          src={LOGO}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        <span style={getPaddingStyle(5)} />
        {TITLE}
      </Navbar.Brand>
      {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
      </Navbar.Collapse>
      <Navbar.Brand>
        <Button variant="success" onClick={() => props.setGame(Game.changeView(props.game))}>
          Switch View
        </Button>
        <span style={getPaddingStyle(5)} />
        <Button variant="danger" onClick={() => props.setGame(Game.init())}>
          Reset
        </Button>
        {/* <Button variant="danger" onClick={() => getResource("test").then(data => props.setTestMessage(data.message))}>
          Test API
        </Button> */}
      </Navbar.Brand>
    </Navbar>
  );
}
