import { Col, Container, Row, Table } from 'react-bootstrap';

import { BOARD_SIZE, getSquare } from '../models/board';
import * as Game from '../models/game';
import * as Style from '../utils/style';

const IMAGE_SIZE_PIXELS = 55;

export default function Board(props) {
  // useEffect(() => {
  //   const isChecked = isPlayerChecked(whitePieces, blackPieces, hasStartingPositionMoved, props.isWhiteTurn);
  //   props.setIsPlayerInCheck(isChecked);
  //   if (noLegalMovesExist(whitePieces, blackPieces, hasStartingPositionMoved, props.isWhiteTurn)) {
  //     if (isChecked) { props.setIsPlayerMated(true); }
  //     else { props.setIsPlayerStalemated(true); }
  //     setIsGameOver(true);
  //   }
  // });
  const getRowColIter = (isRow, isWhiteTurn) => {
    const iter = Array.from(Array(BOARD_SIZE).keys());
    return ((isRow && !isWhiteTurn) || (!isRow && isWhiteTurn)) ? iter : [...iter].reverse();
  };
  const getTileBackgroundStyle = (row, col) => {
    const square = getSquare(row, col);
    const isSelected = Game.isSquareSelected(props.game, square);
    const isMovePossible = Game.isMovePossible(props.game, square);
    return Style.getTileBackgroundStyle(row, col, isSelected, isMovePossible);
  };
  const renderPiece = (row, col) => {
    const square = getSquare(row, col);
    if (Game.isWhitePiece(props.game, square)) {
      const image = Style.getPieceImage(Game.getWhitePiece(props.game, square), true);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
    if (Game.isBlackPiece(props.game, square)) {
      const image = Style.getPieceImage(Game.getBlackPiece(props.game, square), false);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
    return (<img width={IMAGE_SIZE_PIXELS} />);
  };
  const onSquareClick = (row, col) => {
    if (Game.isPaused(props.game)) { return; }
    const square = getSquare(row, col);
    let newGame = Object.assign({}, props.game);
    if (Game.isSelected(props.game)) {
      if (Game.isMovePossible(props.game, square)) {
        Game.move(newGame, square);
      }
      Game.resetUserSelection(newGame);
    } else {
      if (Game.isSelectionPossible(props.game, square)) {
        Game.updateUserSelection(newGame, square);
      }
    }
    props.setGame(newGame);
  };
  return (
    <Container>
      <Row>
        <Col xs={12} style={Style.getPaddingStyle(15)} />
      </Row>
      <Row>
        <Table bordered >
          <tbody>
            {getRowColIter(true, Game.isViewWhite(props.game)).map(row =>
              <tr key={row} >
                {getRowColIter(false, Game.isViewWhite(props.game)).map(col =>
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
