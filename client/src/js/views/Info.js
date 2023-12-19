import { Col, Container, Row, Table } from 'react-bootstrap';

import * as Game from '../models/game';
import { getPaddingStyle } from '../utils/style';

export default function Info(props) {
  // const getResult = () => {
  //   let result = "";
  //   if (props.isPlayerMated) {
  //     result = props.isWhiteTurn ? "Checkmate: Black Wins!" : "Checkmate: White Wins!";
  //   }
  //   if (props.isPlayerStalemated) { result = "Stalemate..."; }
  //   return result;
  // };
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
            {/* <tr>
              <td>CHECKED</td>
              <td>{props.isPlayerInCheck ? "Yes" : "No"}</td>
            </tr> */}
            {/* <tr>
              <td>RESULT</td>
              <td>{getResult()}</td>
            </tr> */}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}
