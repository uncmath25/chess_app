import React, {useState} from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Board from './components/Board';
import Header from './components/Header';
import Info from './components/Info';

export default function App() {
  const [isPlayerWhite, setIsPlayerWhite] = useState(true);
  const [reset, updateReset] = useState(false);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isPlayerInCheck, setIsPlayerInCheck] = useState(false);
  const [isPlayerMated, setIsPlayerMated] = useState(false);
  const [isPlayerStalemated, setIsPlayerStalemated] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  return (
    <div>
      <Header isPlayerWhite={isPlayerWhite} setIsPlayerWhite={setIsPlayerWhite}
        updateReset={updateReset}
        testMessage={testMessage} setTestMessage={setTestMessage}
      />
      <Container>
        <Row>
          <Col sm={12} md={9} lg={{ span: 7, offset: 1 }} xl={{ span: 5, offset: 2 }}>
            <Board isPlayerWhite={isPlayerWhite} setIsPlayerWhite={setIsPlayerWhite}
              reset={reset} updateReset={updateReset}
              isWhiteTurn={isWhiteTurn} setIsWhiteTurn={setIsWhiteTurn}
              isPlayerInCheck={isPlayerInCheck} setIsPlayerInCheck={setIsPlayerInCheck}
              setIsPlayerMated={setIsPlayerMated} setIsPlayerStalemated={setIsPlayerStalemated}
            />
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
