import { useState, useEffect } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';

import { BOARD_SIZE, getSquareNotation, initEmptySquares, initWhitePieces, initBlackPieces, getPieceImage, getMoveSquares } from '../utils/pieces';
import { getPaddingStyle } from '../utils/style';

export default function Board(props) {
  const [whitePieces, setWhitePieces] = useState(initWhitePieces());
  const [blackPieces, setBlackPieces] = useState(initBlackPieces());
  const [selectedSquare, setSelectedSquare] = useState("");
  const [moveSquares, setMoveSquares] = useState({});
  useEffect(() => {
    if (props.reset) {
      props.setIsWhiteTurn(true);
      setWhitePieces(initWhitePieces);
      setBlackPieces(initBlackPieces);
      setSelectedSquare("");
      setMoveSquares({});
      props.updateReset(false);
    }
  });
  const onSquareClick = (row, col) => {
    // logClick(row, col, whitePieces, blackPieces);
    const square = getSquareNotation(row, col);
    if (selectedSquare) {
      if (moveSquares[square]) {
        if (props.isWhiteTurn) {
          setWhitePieces(movePiece(whitePieces, selectedSquare, square));
          if (blackPieces[square]) { setBlackPieces(removePiece(blackPieces, square)); }
        } else {
          setBlackPieces(movePiece(blackPieces, selectedSquare, square));
          if (whitePieces[square]) { setWhitePieces(removePiece(whitePieces, square)); }
        }
        setSelectedSquare("");
        setMoveSquares({});
        props.setIsWhiteTurn(!props.isWhiteTurn);
      } else {
        setSelectedSquare("");
        setMoveSquares({});
      }
    } else {
      if (props.isWhiteTurn && whitePieces[square]) {
        setSelectedSquare(square);
        setMoveSquares(getMoveSquares(row, col, whitePieces, blackPieces, props.isWhiteTurn));
      } else if (!props.isWhiteTurn && blackPieces[square]) {
        setSelectedSquare(square);
        setMoveSquares(getMoveSquares(row, col, whitePieces, blackPieces, props.isWhiteTurn));
      }
    }
  };
  return (
    <Container>
      <Row>
        <Col xs={12} style={getPaddingStyle(15)} />
      </Row>
      <Row>
        <Table bordered >
          <tbody>
            {getRowIter(props.isPlayerWhite).map(row =>
              <tr key={row} >
                {getColIter(props.isPlayerWhite).map(col =>
                  <td key={col} style={getTileBackgroundStyle(row, col, selectedSquare, moveSquares)}>
                    <div style={{aspectRatio: 1 / 1}} onClick={() => onSquareClick(row, col)}>
                      {renderPiece(true, whitePieces[getSquareNotation(row, col)])}
                      {renderPiece(false, blackPieces[getSquareNotation(row, col)])}
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

const getRowIter = (isWhiteTurn) => {
  let rowIter = [];
  if (isWhiteTurn) {
    for (var row = BOARD_SIZE - 1; row >= 0; row--) { rowIter.push(row); }
  } else {
    for (var row = 0; row <= BOARD_SIZE - 1; row++) { rowIter.push(row); }
  }
  return rowIter;
}

const getColIter = (isWhiteTurn) => {
  let colIter = [];
  if (isWhiteTurn) {
    for (var col = 0; col <= BOARD_SIZE - 1; col++) { colIter.push(col); }
  } else {
    for (var col = BOARD_SIZE - 1; col >= 0; col--) { colIter.push(col); }
  }
  return colIter;
}

const getTileBackgroundStyle = (row, col, selectedSquare, moveSquares) => {
  let style = {opacity: 0.7};
  const isLightSquare = (row + col) % 2 == 1;
  style['backgroundColor'] = isLightSquare ? 'rgb(230, 230, 230)' : 'rgb(0, 110, 0)';
  const square = getSquareNotation(row, col);
  if (square == selectedSquare) {
    style['backgroundColor'] = isLightSquare ? 'rgb(230, 230, 0)' : 'rgb(150, 200, 50)';
  }
  if (moveSquares[square]) {
    style['backgroundColor'] = isLightSquare ? 'rgb(180, 230, 230)' : 'rgb(120, 180, 180)';
  }
  return style;
}

const renderPiece = (isWhite, piece) => {
  if (piece) {
    return (<img src={getPieceImage(isWhite, piece)} width="55" />);
  }
}

const logClick = (row, col, whitePieces, blackPieces) => {
  const square = getSquareNotation(row, col);
    if (whitePieces[square]) {
      console.log(`White ${whitePieces[square]} at ${square}`)
    } else if (blackPieces[square]) {
      console.log(`Black ${blackPieces[square]} at ${square}`)
    } else {
      console.log(`No pieces at ${square}`)
    }
}

const movePiece = (pieces, oldSquare, newSquare) => {
  const newPieces = Object.assign({}, pieces)
  newPieces[newSquare] = newPieces[oldSquare];
  newPieces[oldSquare] = "";
  return newPieces;
}

const removePiece = (pieces, square) => {
  const newPieces = Object.assign({}, pieces)
  newPieces[square] = "";
  return newPieces;
}
