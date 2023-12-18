import { useState, useEffect } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';

import * as Game from '../utils/game';
import * as Style from '../utils/style';

export default function Board(props) {
  // const [isGameOver, setIsGameOver] = useState(false);
  // const [moveSquares, setMoveSquares] = useState([]);
  // const [hasStartingPositionMoved, setHasStartingPositionMoved] = useState(initHasStaringPositionMoved());
  // useEffect(() => {
  //   if (props.reset) {
  //     setIsGameOver(false);
  //     props.setIsWhiteTurn(true);
  //     props.setIsPlayerInCheck(false);
  //     props.setIsPlayerMated(false);
  //     props.setIsPlayerStalemated(false);
  //     setWhitePieces(initWhitePieces());
  //     setBlackPieces(initBlackPieces());
  //     setSelectedSquare("");
  //     setMoveSquares([]);
  //     setHasStartingPositionMoved(initHasStaringPositionMoved());
  //     props.updateReset(false);
  //   } else {
  //     const isChecked = isPlayerChecked(whitePieces, blackPieces, hasStartingPositionMoved, props.isWhiteTurn);
  //     props.setIsPlayerInCheck(isChecked);
  //     if (noLegalMovesExist(whitePieces, blackPieces, hasStartingPositionMoved, props.isWhiteTurn)) {
  //       if (isChecked) { props.setIsPlayerMated(true); }
  //       else { props.setIsPlayerStalemated(true); }
  //       setIsGameOver(true);
  //     }
  //   }
  // });
  const getRowColIter = (isRow, isWhiteTurn) => {
    const iter = Array.from(Array(Game.BOARD_SIZE).keys());
    return ((isRow && !isWhiteTurn) || (!isRow && isWhiteTurn)) ? iter : [...iter].reverse();
  };
  const getTileBackgroundStyle = (row, col, moveSquares) => {
    const isSelected = Game.isSquareSelected(props.game, row, col);
    // const isMove = moveSquares.includes(square);
    const isMove = false;
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
  //   const square = Game.getSquareNotation(row, col);
    if (Game.getSelectedSquare(props.game)) {
      console.log("Move");
  //     if (moveSquares.includes(square)) {
  //       if (props.isWhiteTurn) {
  //         setWhitePieces(movePiece(whitePieces, selectedSquare, square));
  //         if (blackPieces[square]) { setBlackPieces(removePiece(blackPieces, square)); }
  //       } else {
  //         setBlackPieces(movePiece(blackPieces, selectedSquare, square));
  //         if (whitePieces[square]) { setWhitePieces(removePiece(whitePieces, square)); }
  //       }
  //       setHasStartingPositionMoved(updateHasStaringPositionMoved(
  //       hasStartingPositionMoved, selectedSquare));
      props.setGame(Game.clearSelectedSquare(props.game));
  //       setMoveSquares([]);
  //       props.setIsWhiteTurn(!props.isWhiteTurn);
  //     } else {
  //       setSelectedSquare("");
  //       setMoveSquares([]);
  //     }
    } else {
      if (Game.isSelectedSquareMovable(props.game, row, col)) {
        props.setGame(Game.setSelectedSquare(props.game, row, col));
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
                  <td key={col} style={getTileBackgroundStyle(row, col, "", [])}>
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
