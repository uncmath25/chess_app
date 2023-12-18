import React, {useState, useEffect} from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Board from './components/Board';
import Header from './components/Header';
import Info from './components/Info';
import * as Game from './utils/game';

export default function App() {
  const [game, setGame] = useState(Game.init());
  // const [isPlayerWhite, setIsPlayerWhite] = useState(true);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isPlayerInCheck, setIsPlayerInCheck] = useState(false);
  const [isPlayerMated, setIsPlayerMated] = useState(false);
  const [isPlayerStalemated, setIsPlayerStalemated] = useState(false);
  // const [testMessage, setTestMessage] = useState("");
  // useEffect(() => {console.log(game)});
  return (
    <div>
      <Header game={game} setGame={setGame} />
      <Container>
        <Row>
          <Col sm={12} md={9} lg={{ span: 7, offset: 1 }} xl={{ span: 5, offset: 2 }}>
            {/* <Board isPlayerWhite={isPlayerWhite} setIsPlayerWhite={setIsPlayerWhite}
              reset={reset} updateReset={updateReset}
              isWhiteTurn={isWhiteTurn} setIsWhiteTurn={setIsWhiteTurn}
              isPlayerInCheck={isPlayerInCheck} setIsPlayerInCheck={setIsPlayerInCheck}
              setIsPlayerMated={setIsPlayerMated} setIsPlayerStalemated={setIsPlayerStalemated}
            /> */}
            <Board game={game} setGame={setGame} />
            {/* {testMessage} */}
          </Col>
          <Col sm={12} md={12} lg={{ span: 3, offset: 1 }} xl={{ span: 3, offset: 2 }}>
            <Info isWhiteTurn={isWhiteTurn} isPlayerInCheck={isPlayerInCheck}
              isPlayerMated={isPlayerMated} isPlayerStalemated={isPlayerStalemated}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
