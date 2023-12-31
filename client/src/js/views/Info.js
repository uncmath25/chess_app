import { Button, Col, Container, Row, Table } from 'react-bootstrap';

import * as Game from '../models/game';
import * as History from '../models/history';
import { getPaddingStyle } from '../utils/style';

const HISTORY_TABLE_HEIGHT_PX = "380px";

export default function Info(props) {
  const getPointSpread = () => {
    const whitePoints = Game.getPoints(History.getGame(props.history), true);
    const blackPoints = Game.getPoints(History.getGame(props.history), false);
    if (whitePoints == blackPoints) { return "EVEN"; }
    if (whitePoints > blackPoints) { return "White +" + (whitePoints - blackPoints); }
    return "Black +" + (blackPoints - whitePoints);
  };
  const isChecked = () => Game.isChecked(History.getGame(props.history));
  const getResult = () => {
    const game = History.getGame(props.history);
    if (!Game.hasMoves(game)) {
      if (Game.isChecked(game)) {
        return Game.isWhiteTurn(game) ? "Checkmate: Black Wins!" : "Checkmate: White Wins!";
      }
      return "Stalemate...";
    }
    return "";
  };
  const goToStart = () => {
    const newHistory = {...props.history};
    History.goToStart(newHistory);
    props.setHistory(newHistory);
  };
  const goBack = () => {
    const newHistory = {...props.history};
    History.goBack(newHistory);
    props.setHistory(newHistory);
  };
  const goForward = () => {
    const newHistory = {...props.history};
    History.goForward(newHistory);
    props.setHistory(newHistory);
  };
  const goToLatest = () => {
    const newHistory = {...props.history};
    History.goToLatest(newHistory);
    props.setHistory(newHistory);
  };
  const getTurns = () => {
    const totalTurns = History.getTotalTurns(props.history);
    const turnsArr = [];
    const len = ((totalTurns % 2) ? (totalTurns - 1) / 2 : totalTurns / 2) + 1;
    for (let i = 1; i <= len; i++) {
      // TODO: Add actual chess move notation
      const whiteMoveNotation = "?";
      const blackMoveNotation = "?";
      turnsArr.push([whiteMoveNotation, blackMoveNotation]);
    }
    turnsArr[len - 1][1] = "";
    if (totalTurns % 2 == 0) { turnsArr[len - 1][0] = ""; }
    return turnsArr;
  };
  const highlightCell = (row, col) => {
    const currentTurn = History.getCurrentTurn(props.history);
    const currentTurnRow = (currentTurn % 2 == 0) ? currentTurn / 2 : (currentTurn - 1) / 2;
    const currentTurnCol = (currentTurn % 2 == 0) ? 0 : 1;
    return currentTurnRow == row && currentTurnCol == col;
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
              <td>POINTS</td>
              <td>{getPointSpread()}</td>
            </tr>
            <tr>
              <td>CHECKED</td>
              <td>{isChecked() ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>RESULT</td>
              <td>{getResult()}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row>
        <Col xs={3}>
          <Button variant="primary" onClick={() => goToStart()}>{"<<"}</Button>
        </Col>
        <Col xs={3}>
          <Button variant="warning" onClick={() => goBack()}>{"<"}</Button>
        </Col>
        <Col xs={3}>
          <Button variant="warning" onClick={() => goForward()}>{">"}</Button>
        </Col>
        <Col xs={3}>
          <Button variant="primary" onClick={() => goToLatest()}>{">>"}</Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} style={getPaddingStyle(5)} />
      </Row>
      <Row>
        <div style={{overflow: "scroll", height: HISTORY_TABLE_HEIGHT_PX}} >
          <Table bordered >
            <thead>
              <tr>
                <th/>
                <th>White</th>
                <th>Black</th>
              </tr>
            </thead>
            <tbody>
              {getTurns().map((row, rowIdx) =>
                <tr key={rowIdx} >
                  <td key={"Turn"} >{rowIdx + 1}</td>
                  <td key={"White"} className={highlightCell(rowIdx, 0) ? "bg-warning" : ""}>{row[0]}</td>
                  <td key={"Black"} className={highlightCell(rowIdx, 1) ? "bg-warning" : ""}>{row[1]}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Row>
    </Container>
  );
}
