import React, {useState} from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

import Board from './components/Board';
import Header from './components/Header';
import Info from './components/Info';

export default function App() {
  const [testMessage, setTestMessage] = useState("");
  return (
    <div>
      <Header testMessage={testMessage} setTestMessage={setTestMessage} />
      <Container>
        <Row>
          <Col sm={12} md={9} lg={{ span: 7, offset: 1 }} xl={{ span: 5, offset: 2 }}>
            <Board />
            {/* {testMessage} */}
          </Col>
          <Col sm={12} md={3} lg={{ span: 3, offset: 1 }} xl={{ span: 3, offset: 2 }}>
            <Info />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
