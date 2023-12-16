import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { getPaddingStyle } from '../utils/style';

export default function Info(props) {
  return (
    <Container>
      <Row>
        <Col xs={12} style={getPaddingStyle(20)} />
      </Row>
      <Row>
        Info
      </Row>
    </Container>
  );
}
