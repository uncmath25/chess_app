import { Col, Container, Row, Table } from 'react-bootstrap';

import { BOARD_SIZE, getSquare } from '../models/board';
import * as Game from '../models/game';
import * as History from '../models/history';
import * as Style from '../utils/style';

const IMAGE_SIZE_PIXELS = 55;

export default function Board(props) {
  const getRowColIter = (isRow) => {
    const game = History.getGame(props.history);
    const isWhiteTurn = Game.isViewWhite(game);
    const iter = Array.from(Array(BOARD_SIZE).keys());
    return ((isRow && !isWhiteTurn) || (!isRow && isWhiteTurn)) ? iter : [...iter].reverse();
  };
  const getTileBackgroundStyle = (row, col) => {
    const game = History.getGame(props.history);
    const square = getSquare(row, col);
    const isSelected = Game.isSquareSelected(game, square);
    const isMovePossible = Game.isMovePossible(game, square);
    return Style.getTileBackgroundStyle(row, col, isSelected, isMovePossible);
  };
  const renderPiece = (row, col) => {
    const game = History.getGame(props.history);
    const square = getSquare(row, col);
    if (Game.isWhitePiece(game, square)) {
      const image = Style.getPieceImage(Game.getWhitePiece(game, square), true);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
    if (Game.isBlackPiece(game, square)) {
      const image = Style.getPieceImage(Game.getBlackPiece(game, square), false);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
    return (<img width={IMAGE_SIZE_PIXELS} />);
  };
  const onSquareClick = (row, col) => {
    if (History.isPaused(props.history)) { return; }
    const square = getSquare(row, col);
    const game = History.getGame(props.history);
    const newHistory = {...props.history};
    if (Game.isSelected(game)) {
      if (Game.isMovePossible(game, square)) {
        History.move(newHistory, square);
      }
      History.resetUserSelection(newHistory);
    } else {
      if (Game.isSelectionPossible(game, square)) {
        History.updateUserSelection(newHistory, square);
      }
    }
    props.setHistory(newHistory);
  };
  return (
    <Container>
      <Row>
        <Col xs={12} style={Style.getPaddingStyle(15)} />
      </Row>
      <Row>
        <Table bordered >
          <tbody>
            {getRowColIter(true).map(row =>
              <tr key={row} >
                {getRowColIter(false).map(col =>
                  <td key={col} style={getTileBackgroundStyle(row, col)}>
                    <div style={{aspectRatio: 1 / 1}} onClick={() => onSquareClick(row, col)}>
                      {renderPiece(row, col)}
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}
