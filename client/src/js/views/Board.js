import { Col, Container, Row, Table } from 'react-bootstrap';

import * as BoardModel from '../models/board';
import * as UserModel from '../models/user';
import * as Move from '../models/move';
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
    const iter = Array.from(Array(BoardModel.BOARD_SIZE).keys());
    return ((isRow && !isWhiteTurn) || (!isRow && isWhiteTurn)) ? iter : [...iter].reverse();
  };
  const getTileBackgroundStyle = (row, col) => {
    const square = BoardModel.getSquare(row, col);
    const isSelected = UserModel.isSquareSelected(props.user, square);
    const isMovePossible = UserModel.isMovePossible(props.user, square);
    return Style.getTileBackgroundStyle(row, col, isSelected, isMovePossible);
  };
  const renderPiece = (row, col) => {
    const square = BoardModel.getSquare(row, col);
    if (BoardModel.isWhitePiece(props.board, square)) {
      const image = Style.getPieceImage(BoardModel.getWhitePiece(props.board, square), true);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
    if (BoardModel.isBlackPiece(props.board, square)) {
      const image = Style.getPieceImage(BoardModel.getBlackPiece(props.board, square), false);
      return (<img src={image} width={IMAGE_SIZE_PIXELS} />);
    }
  };
  const onSquareClick = (row, col) => {
    if (UserModel.isGameOver(props.board)) { return; }
    const square = BoardModel.getSquare(row, col);
    if (UserModel.isSelected(props.user)) {
      if (UserModel.isMovePossible(props.user, square)) { move(square); }
      updateUserSelection("", []);
    } else {
      if (isSelectionPossible(square)) {
        updateUserSelection(square, Move.getMoves(props.board, square));
      }
    }
  };
  const move = (newSquare) => {
    let newBoard = Object.assign({}, props.board);
    BoardModel.move(newBoard, UserModel.getSelectedSquare(props.user), newSquare);
    props.setBoard(newBoard);
  };
  const isSelectionPossible = (square) => {
    return (BoardModel.isWhiteTurn(props.board) && BoardModel.isWhitePiece(props.board, square)) ||
    (!BoardModel.isWhiteTurn(props.board) && BoardModel.isBlackPiece(props.board, square))
  };
  const updateUserSelection = (square, possibleMoves) => {
    const newUser = Object.assign({}, props.user)
    UserModel.setSelectedSquare(newUser, square);
    UserModel.setPossibleMoves(newUser, possibleMoves);
    props.setUser(newUser);
  };
  return (
    <Container>
      <Row>
        <Col xs={12} style={Style.getPaddingStyle(15)} />
      </Row>
      <Row>
        <Table bordered >
          <tbody>
            {getRowColIter(true, UserModel.isViewWhite(props.user, props.board)).map(row =>
              <tr key={row} >
                {getRowColIter(false, UserModel.isViewWhite(props.user, props.board)).map(col =>
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
