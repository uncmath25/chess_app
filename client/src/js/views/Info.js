import { Col, Container, Row, Table } from 'react-bootstrap';

import * as Game from '../models/game';
import { getPaddingStyle } from '../utils/style';

export default function Info(props) {
  const getResult = () => {
    if (!Game.hasMoves(props.game)) {
      if (Game.isChecked(props.game)) {
        return Game.isWhiteTurn(props.game) ? "Checkmate: Black Wins!" : "Checkmate: White Wins!";
      }
      return "Stalemate...";
    }
    return "";
  };
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
              <td>{Game.isWhiteTurn(props.game) ? "White" : "Black"}</td>
            </tr>
            <tr>
              <td>CHECKED</td>
              <td>{Game.isChecked(props.game) ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>RESULT</td>
              <td>{getResult()}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}
