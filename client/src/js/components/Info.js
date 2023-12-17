import { Col, Container, Row, Table } from 'react-bootstrap';

import { getPaddingStyle } from '../utils/style';

export default function Info(props) {
  return (
    <Container>
      <Row>
        <Col xs={12} style={getPaddingStyle(15)} />
      </Row>
      <Row>
        <Table bordered >
          <tbody>
            <tr>
              <td>TURN</td>
              <td>{props.isWhiteTurn ? "White" : "Black"}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}
