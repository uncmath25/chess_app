import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Board from './views/Board';
import Header, { IS_PLAYER_WHITE } from './views/Header';
import Info from './views/Info';
import * as Game from './models/game';
import * as History from './models/history';

export default function App() {
  const [history, setHistory] = useState(History.init(Game.DEFAULT_GAME_MODE, IS_PLAYER_WHITE));
  useEffect(() => {
    // console.log(history);
    const onKeyDown = (e) => {
      if (e.key === 'ArrowDown'){ goToStart(); }
      if (e.key === 'ArrowLeft'){ goBack(); }
      if (e.key === 'ArrowRight'){ goForward(); }
      if (e.key === 'ArrowUp'){ goToLatest(); }
    }
     window.addEventListener('keydown', onKeyDown);
     return () => window.removeEventListener('keydown', onKeyDown);
  });
  const goToStart = () => {
    const newHistory = {...history};
    History.goToStart(newHistory);
    setHistory(newHistory);
  };
  const goBack = () => {
    const newHistory = {...history};
    History.goBack(newHistory);
    setHistory(newHistory);
  };
  const goForward = () => {
    const newHistory = {...history};
    History.goForward(newHistory);
    setHistory(newHistory);
  };
  const goToLatest = () => {
    const newHistory = {...history};
    History.goToLatest(newHistory);
    setHistory(newHistory);
  };
  return (
    <div>
      <Header setHistory={setHistory} />
      <Container>
        <Row>
          <Col sm={12} md={9} lg={{ span: 8 }} xl={{ span: 5, offset: 2 }}>
            <Board history={history} setHistory={setHistory} />
          </Col>
          <Col sm={12} md={12} lg={{ span: 4 }} xl={{ span: 3, offset: 2 }}>
            <Info history={history} setHistory={setHistory} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
