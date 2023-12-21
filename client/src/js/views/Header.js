import { useState } from 'react';
import { Button, Form, Navbar, Nav } from 'react-bootstrap';

import * as Game from '../models/game';
import * as History from '../models/history';
import { getPaddingStyle } from '../utils/style';

const LOGO = require('../../assets/logo.ico');
const TITLE = 'Chess App';
export const IS_VIEW_SWITCHED = false;
export const IS_PLAYER_WHITE = true;

export default function Header(props) {
  const [isViewSwitched, setIsViewSwitched] = useState(IS_VIEW_SWITCHED);
  const [gameMode, setGameMode] = useState(Game.DEFAULT_GAME_MODE);
  const [isPlayerWhite, setIsPlayerWhite] = useState(IS_PLAYER_WHITE);
  const switchView = () => {
    const newHistory = {...props.history};
    History.switchView(newHistory, !isViewSwitched);
    props.setHistory(newHistory);
    setIsViewSwitched(!isViewSwitched);
  };
  const startNewGame = () => {
    props.setHistory(History.init(gameMode, isPlayerWhite, isViewSwitched));
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
        <Form.Check name="switchView" label="Switch View"
                      checked={isViewSwitched} onChange={() => switchView()} />
          <span style={getPaddingStyle(5)} />
          <Form.Select value={gameMode} onChange={(event) => setGameMode(event.target.value) } >
            {Array.from(Array(Game.GAME_MODES.length).keys()).map(
              i => <option key={i}>{Game.GAME_MODES[i]}</option>
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
      </Navbar.Brand>
    </Navbar>
  );
}
