import { Col, Container, Row, Table } from 'react-bootstrap';

import { BOARD_SIZE } from '../utils/board';
import * as Game from '../utils/game';
import * as Style from '../utils/style';

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
    const isSelected = Game.isSquareSelected(props.game, row, col);
    const isMove = Game.isMovePossible(props.game, row, col);
    return Style.getTileBackgroundStyle(row, col, isSelected, isMove);
  };
  const renderPiece = (row, col) => {
    const IMAGE_SIZE_PIXELS = 55;
    if (Game.getWhitePiece(props.game, row, col)) {
      const image = Style.getPieceImage(Game.getWhitePiece(props.game, row, col), true);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
    if (Game.getBlackPiece(props.game, row, col)) {
      const image = Style.getPieceImage(Game.getBlackPiece(props.game, row, col), false);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
  };
  const onSquareClick = (row, col) => {
    if (Game.isGameOver(props.game)) { return; }
    if (Game.existsSelectedSquare(props.game)) {
      if (Game.isMovePossible(props.game, row, col)) {
        console.log("Move");
        props.setGame(Game.move(props.game, row, col));
      } else {
        console.log("No Move");
        props.setGame(Game.clearSelection(props.game));
      }
    } else {
      if (Game.isSelectionPossible(props.game, row, col)) {
        props.setGame(Game.select(props.game, row, col));
      }
    }
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
