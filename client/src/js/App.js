import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Board from './views/Board';
import Header, { IS_PLAYER_WHITE_DEFAULT } from './views/Header';
import Info from './views/Info';
import * as BoardModel from './models/board';
import * as UserModel from './models/user';

export default function App() {
  const [board, setBoard] = useState(BoardModel.init());
  const [user, setUser] = useState(UserModel.init(IS_PLAYER_WHITE_DEFAULT));
  // const [testMessage, setTestMessage] = useState("");
  useEffect(() => {console.log(board); console.log(user)});
  return (
    <div>
      <Header setBoard={setBoard} setUser={setUser} />
      <Container>
        <Row>
          <Col sm={12} md={9} lg={{ span: 7, offset: 1 }} xl={{ span: 5, offset: 2 }}>
            <Board board={board} setBoard={setBoard}
                   user={user} setUser={setUser} />
            {/* {testMessage} */}
          </Col>
          <Col sm={12} md={12} lg={{ span: 3, offset: 1 }} xl={{ span: 3, offset: 2 }}>
            <Info board={board} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
