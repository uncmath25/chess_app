export const BOARD_SIZE = 8;
const COLS = 'abcdefgh';
const PIECE_PAWN = "P";
const PIECE_KNIGHT = "N";
const PIECE_BISHOP = "B";
const PIECE_ROOK = "R";
const PIECE_QUEEN = "Q";
const PIECE_KING = "K";

export const getSquareNotation = (row, col) => COLS[col] + (row + 1);

export const initEmptySquares = () => {
  let boardInfo = {};
  for (var row = 0; row < BOARD_SIZE; row++) {
    for (var col = 0; col < BOARD_SIZE; col++) {
      boardInfo[getSquareNotation(row, col)] = "";
    }
  }
  return boardInfo;
}

export const initWhitePieces = () => {
  let boardInfo = initEmptySquares();
  for (var col = 0; col < BOARD_SIZE; col++) {
    boardInfo[getSquareNotation(1, col)] = PIECE_PAWN;
  }
  boardInfo[getSquareNotation(0, 0)] = PIECE_ROOK;
  boardInfo[getSquareNotation(0, 1)] = PIECE_KNIGHT;
  boardInfo[getSquareNotation(0, 2)] = PIECE_BISHOP;
  boardInfo[getSquareNotation(0, 3)] = PIECE_QUEEN;
  boardInfo[getSquareNotation(0, 4)] = PIECE_KING;
  boardInfo[getSquareNotation(0, 5)] = PIECE_BISHOP;
  boardInfo[getSquareNotation(0, 6)] = PIECE_KNIGHT;
  boardInfo[getSquareNotation(0, 7)] = PIECE_ROOK;
  return boardInfo;
}

export const initBlackPieces = () => {
  let boardInfo = initEmptySquares();
  for (var col = 0; col < BOARD_SIZE; col++) {
    boardInfo[getSquareNotation(6, col)] = PIECE_PAWN;
  }
  boardInfo[getSquareNotation(7, 0)] = PIECE_ROOK;
  boardInfo[getSquareNotation(7, 1)] = PIECE_KNIGHT;
  boardInfo[getSquareNotation(7, 2)] = PIECE_BISHOP;
  boardInfo[getSquareNotation(7, 3)] = PIECE_QUEEN;
  boardInfo[getSquareNotation(7, 4)] = PIECE_KING;
  boardInfo[getSquareNotation(7, 5)] = PIECE_BISHOP;
  boardInfo[getSquareNotation(7, 6)] = PIECE_KNIGHT;
  boardInfo[getSquareNotation(7, 7)] = PIECE_ROOK;
  return boardInfo;
}

export const getPieceImage = (isWhite, piece) => {
  if (isWhite) {
    switch(piece) {
      case PIECE_PAWN:
        return require('../../assets/piece_images/pawn_white.png');
      case PIECE_KNIGHT:
        return require('../../assets/piece_images/knight_white.png');
      case PIECE_BISHOP:
        return require('../../assets/piece_images/bishop_white.png');
      case PIECE_ROOK:
        return require('../../assets/piece_images/rook_white.png');
      case PIECE_QUEEN:
        return require('../../assets/piece_images/queen_white.png');
      case PIECE_KING:
        return require('../../assets/piece_images/king_white.png');
    }
  } else {
    switch(piece) {
      case PIECE_PAWN:
        return require('../../assets/piece_images/pawn_black.png');
      case PIECE_KNIGHT:
        return require('../../assets/piece_images/knight_black.png');
      case PIECE_BISHOP:
        return require('../../assets/piece_images/bishop_black.png');
      case PIECE_ROOK:
        return require('../../assets/piece_images/rook_black.png');
      case PIECE_QUEEN:
        return require('../../assets/piece_images/queen_black.png');
      case PIECE_KING:
        return require('../../assets/piece_images/king_black.png');
    }
  }
}

export const getMoveSquares = (row, col, whitePieces, blackPieces, isWhiteTurn) => {
  switch(isWhiteTurn ? whitePieces[getSquareNotation(row, col)] : blackPieces[getSquareNotation(row, col)]) {
    case PIECE_PAWN:
      return isWhiteTurn ? getPawnMoveSquares(row, col, whitePieces, blackPieces, isWhiteTurn) : getPawnMoveSquares(row, col, blackPieces, whitePieces, isWhiteTurn);
    case PIECE_KNIGHT:
      return isWhiteTurn ? getKnightMoveSquares(row, col, whitePieces) : getKnightMoveSquares(row, col, blackPieces);
    case PIECE_BISHOP:
      return isWhiteTurn ? getBishopMoveSquares(row, col, whitePieces, blackPieces) : getBishopMoveSquares(row, col, blackPieces, whitePieces);
    case PIECE_ROOK:
      return isWhiteTurn ? getRookMoveSquares(row, col, whitePieces, blackPieces) : getRookMoveSquares(row, col, blackPieces, whitePieces);
    case PIECE_QUEEN:
      return isWhiteTurn ? getQueenMoveSquares(row, col, whitePieces, blackPieces) : getQueenMoveSquares(row, col, blackPieces, whitePieces);
    case PIECE_KING:
      return isWhiteTurn ? getKingMoveSquares(row, col, whitePieces) : getKingMoveSquares(row, col, blackPieces);
  }
}

const getPawnMoveSquares = (row, col, pieces, otherPieces, isWhiteTurn) => {
  let moveSquares = initEmptySquares();
  const nextRow = row + (isWhiteTurn ? 1 : -1);
  if (!pieces[getSquareNotation(nextRow, col)] && !otherPieces[getSquareNotation(nextRow, col)]) {
    moveSquares[getSquareNotation(nextRow, col)] = true;
  }
  const startRow = isWhiteTurn ? 1 : BOARD_SIZE - 2
  const farRow = row + (isWhiteTurn ? 2 : -2);
  if (row == startRow && !pieces[getSquareNotation(farRow, col)] && !otherPieces[getSquareNotation(farRow, col)]) {
    moveSquares[getSquareNotation(farRow, col)] = true;
  }
  if (col >= 1 && otherPieces[getSquareNotation(nextRow, col - 1)]) {
    moveSquares[getSquareNotation(nextRow, col - 1)] = true;
  }
  if (col <= BOARD_SIZE - 2 && otherPieces[getSquareNotation(nextRow, col + 1)]) {
    moveSquares[getSquareNotation(nextRow, col + 1)] = true;
  }
  return moveSquares;
}

const getKnightMoveSquares = (row, col, pieces) => {
  let moveSquares = initEmptySquares();
  const iter = [-2, -1, 1, 2];
  iter.forEach((i) => {
    if (row + i >= 0 && row + i < BOARD_SIZE) {
      [-(3 - Math.abs(i)), (3 - Math.abs(i))].forEach((j) => {
        if (col + j >= 0 && col + j < BOARD_SIZE) {
          if (!pieces[getSquareNotation(row + i, col + j)]) {
            moveSquares[getSquareNotation(row + i, col + j)] = true;
          }
        }
      });
    }
  });
  return moveSquares;
}

const getMoveInDirection = (row, col, pieces, otherPieces, moveSquares, dir) => {
  let k = 1;
  while (k >= 0 && k < BOARD_SIZE && !pieces[getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) {
    moveSquares[getSquareNotation(row + dir[0]*k, col + dir[1]*k)] = true;
    if (otherPieces[getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) { break; }
    k++;
  }
}

const getBishopMoveSquares = (row, col, pieces, otherPieces) => {
  let moveSquares = initEmptySquares();
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(dir =>
    getMoveInDirection(row, col, pieces, otherPieces, moveSquares, dir)
  )
  return moveSquares;
}

const getRookMoveSquares = (row, col, pieces, otherPieces) => {
  let moveSquares = initEmptySquares();
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(dir =>
    getMoveInDirection(row, col, pieces, otherPieces, moveSquares, dir)
  )
  return moveSquares;
}

const getQueenMoveSquares = (row, col, pieces, otherPieces) => {
  return {...getBishopMoveSquares(row, col, pieces, otherPieces), ...getRookMoveSquares(row, col, pieces, otherPieces)};
}

const getKingMoveSquares = (row, col, pieces) => {
  let moveSquares = initEmptySquares();
  [-1, 0, 1].forEach((i) => {
    if (row + i >= 0 && row + i < BOARD_SIZE) {
      [-1, 0, 1].forEach((j) => {
        if (col + j >= 0 && col + j < BOARD_SIZE) {
          if (!pieces[getSquareNotation(row + i, col + j)]) {
            moveSquares[getSquareNotation(row + i, col + j)] = true;
          }
        }
      });
    }
  });
  return moveSquares;
}
