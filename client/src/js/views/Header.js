import { useState } from 'react';
import { Button, Form, Navbar, Nav } from 'react-bootstrap';

// import { getResource } from '../utils/apiClient';
import * as BoardModel from '../models/board';
import * as UserModel from '../models/user';
import { getPaddingStyle } from '../utils/style';

const LOGO = require('../../assets/logo.ico');
const TITLE = 'Chess App';
const GAME_MODE_SANDBOX = "SANDBOX";
const GAME_MODE_SWITCH = "SWITCH";
const GAME_MODE_AI = "AI";
const GAME_MODES = [GAME_MODE_SANDBOX, GAME_MODE_SWITCH, GAME_MODE_AI];
export const DEFAULT_GAME_MODE = GAME_MODE_SANDBOX;
export const IS_PLAYER_WHITE_DEFAULT = true;

export default function Header(props) {
  const [gameMode, setGameMode] = useState(DEFAULT_GAME_MODE);
  const [isPlayerWhite, setIsPlayerWhite] = useState(IS_PLAYER_WHITE_DEFAULT);
  const startNewGame = () => {
    props.setBoard(BoardModel.init());
    props.setUser(UserModel.init(isPlayerWhite, gameMode == GAME_MODE_SWITCH));
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>
        <span style={getPaddingStyle(5)} />
        <img
          src={LOGO}
          width="40"
          height="40"
        />
        <span style={getPaddingStyle(5)} />
        {TITLE}
      </Navbar.Brand>
      {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
      </Navbar.Collapse>
      <Navbar.Brand>
        <Form className='d-flex'>
          <Form.Select value={gameMode} onChange={(event) => setGameMode(event.target.value) } >
            {Array.from(Array(GAME_MODES.length).keys()).map(
              i => <option key={i}>{GAME_MODES[i]}</option>
            )}
          </Form.Select>
          <span style={getPaddingStyle(5)} />
          <Form.Check name="isPlayerWhite" label="White"
                      checked={isPlayerWhite} onChange={() => setIsPlayerWhite(!isPlayerWhite)} />
          <span style={getPaddingStyle(5)} />
          <Button variant="danger" onClick={() => startNewGame()}>
            New Game
          </Button>
        </Form>
        {/* <Button variant="danger" onClick={() => getResource("test").then(data => props.setTestMessage(data.message))}>
          Test API
        </Button> */}
      </Navbar.Brand>
    </Navbar>
  );
}
