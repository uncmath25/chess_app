export const BOARD_SIZE = 8;
const COLS = 'abcdefgh';
const PIECE_PAWN = "P";
const PIECE_KNIGHT = "N";
const PIECE_BISHOP = "B";
const PIECE_ROOK = "R";
const PIECE_QUEEN = "Q";
const PIECE_KING = "K";
const MOVE_SHORT_CASTLE = "o";
const MOVE_LONG_CASTLE = "O";

export const getSquareNotation = (row, col) => COLS[col] + (row + 1);

export const initWhitePieces = () => {
  let boardInfo = {};
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
  let boardInfo = {};
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

export const getMoveSquares = (row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn, skipCheck=false) => {
  let moveSquares = getRawMoveSquares(row, col, pieces, otherPieces, isWhiteTurn);
  addCastleMoves(moveSquares, row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn);
  if (skipCheck) { return moveSquares; }
  let legalMoveSquares = [];
  const oldSquare = getSquareNotation(row, col);
  moveSquares.forEach((newSquare) => {
    const updatedPieces = movePiece(pieces, oldSquare, newSquare);
    const updatedOtherPieces = removePiece(otherPieces, newSquare);
    const whitePieces = isWhiteTurn ? updatedPieces : updatedOtherPieces;
    const blackPieces = isWhiteTurn ? updatedOtherPieces : updatedPieces;
    if (!isPlayerChecked(whitePieces, blackPieces, hasStartingPositionMoved, isWhiteTurn)) {
      legalMoveSquares.push(newSquare);
    }
  });
  return legalMoveSquares;
}

export const movePiece = (pieces, oldSquare, newSquare) => {
  const newPieces = Object.assign({}, pieces)
  newPieces[newSquare] = newPieces[oldSquare];
  handlePawnPromotion(newPieces, oldSquare, newSquare);
  handleCastles(newPieces, oldSquare, newSquare);
  newPieces[oldSquare] = "";
  return newPieces;
}

// TODO: Update pawn promotion besides just queen
const handlePawnPromotion = (pieces, oldSquare, newSquare) => {
  if (pieces[oldSquare] == PIECE_PAWN && (newSquare[1] == 1 || newSquare[1] == BOARD_SIZE)) {
    pieces[newSquare] = PIECE_QUEEN;
  }
}

const handleCastles = (pieces, oldSquare, newSquare) => {
  [1, BOARD_SIZE].forEach((row) => {
    if (oldSquare == "e" + row) {
      if (newSquare == "g" + row) {
        pieces["g" + row] = PIECE_KING;
        pieces["f" + row] = PIECE_ROOK;
        pieces["h" + row] = "";
      }
      if (newSquare == "a" + row) {
        pieces["c" + row] = PIECE_KING;
        pieces["d" + row] = PIECE_ROOK;
        pieces["a" + row] = "";
      }
    }
  });
}

export const removePiece = (pieces, square) => {
  const newPieces = Object.assign({}, pieces)
  newPieces[square] = "";
  return newPieces;
}

// HARD_CODED_RULE
export const initHasStaringPositionMoved = () => {
  let hasStartingPositionMoved = {};
  hasStartingPositionMoved["a1"] = false;
  hasStartingPositionMoved["e1"] = false;
  hasStartingPositionMoved["h1"] = false;
  hasStartingPositionMoved["a8"] = false;
  hasStartingPositionMoved["e8"] = false;
  hasStartingPositionMoved["h8"] = false;
  return hasStartingPositionMoved;
}

// HARD_CODED_RULE
export const updateHasStaringPositionMoved = (hasStartingPositionMoved, oldSquare) => {
  const newHasStartingPositionMoved = Object.assign({}, hasStartingPositionMoved)
  if (["a1", "e1", "h1", "a8", "e8", "h8"].includes(oldSquare)) {
    newHasStartingPositionMoved[oldSquare] = true;
  }
  return newHasStartingPositionMoved;
}

export const getRawMoveSquares = (row, col, pieces, otherPieces, isWhiteTurn) => {
  switch (pieces[getSquareNotation(row, col)]) {
    case PIECE_PAWN:
      return getPawnMoveSquares(row, col, pieces, otherPieces, isWhiteTurn);
    case PIECE_KNIGHT:
      return getKnightMoveSquares(row, col, pieces);
    case PIECE_BISHOP:
      return getBishopMoveSquares(row, col, pieces, otherPieces);
    case PIECE_ROOK:
      return getRookMoveSquares(row, col, pieces, otherPieces);
    case PIECE_QUEEN:
      return getQueenMoveSquares(row, col, pieces, otherPieces);
    case PIECE_KING:
      return getKingMoveSquares(row, col, pieces, isWhiteTurn);
  }
}

const getPawnMoveSquares = (row, col, pieces, otherPieces, isWhiteTurn) => {
  let moveSquares = [];
  const nextRow = row + (isWhiteTurn ? 1 : -1);
  if (!pieces[getSquareNotation(nextRow, col)] && !otherPieces[getSquareNotation(nextRow, col)]) {
    moveSquares.push(getSquareNotation(nextRow, col));
  }
  const startRow = isWhiteTurn ? 1 : BOARD_SIZE - 2
  const farRow = row + (isWhiteTurn ? 2 : -2);
  if (row == startRow && !pieces[getSquareNotation(farRow, col)] && !otherPieces[getSquareNotation(farRow, col)]) {
    moveSquares.push(getSquareNotation(farRow, col));
  }
  if (col >= 1 && otherPieces[getSquareNotation(nextRow, col - 1)]) {
    moveSquares.push(getSquareNotation(nextRow, col - 1));
  }
  if (col <= BOARD_SIZE - 2 && otherPieces[getSquareNotation(nextRow, col + 1)]) {
    moveSquares.push(getSquareNotation(nextRow, col + 1));
  }
  return moveSquares;
}

const getKnightMoveSquares = (row, col, pieces) => {
  let moveSquares = [];
  const iter = [-2, -1, 1, 2];
  iter.forEach((i) => {
    if (row + i >= 0 && row + i < BOARD_SIZE) {
      [-(3 - Math.abs(i)), (3 - Math.abs(i))].forEach((j) => {
        if (col + j >= 0 && col + j < BOARD_SIZE) {
          if (!pieces[getSquareNotation(row + i, col + j)]) {
            moveSquares.push(getSquareNotation(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
}

const getMoveInDirection = (row, col, pieces, otherPieces, moveSquares, dir) => {
  let k = 1;
  while (row + dir[0]*k >= 0 && row + dir[0]*k < BOARD_SIZE
    && col + dir[1]*k >= 0 && col + dir[1]*k < BOARD_SIZE
    && !pieces[getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) {
    moveSquares.push(getSquareNotation(row + dir[0]*k, col + dir[1]*k));
    if (otherPieces[getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) { break; }
    k++;
  }
}

const getBishopMoveSquares = (row, col, pieces, otherPieces) => {
  let moveSquares = [];
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(dir =>
    getMoveInDirection(row, col, pieces, otherPieces, moveSquares, dir)
  )
  return moveSquares;
}

const getRookMoveSquares = (row, col, pieces, otherPieces) => {
  let moveSquares = [];
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(dir =>
    getMoveInDirection(row, col, pieces, otherPieces, moveSquares, dir)
  )
  return moveSquares;
}

const getQueenMoveSquares = (row, col, pieces, otherPieces) => {
  return [...getBishopMoveSquares(row, col, pieces, otherPieces), ...getRookMoveSquares(row, col, pieces, otherPieces)];
}

const getKingMoveSquares = (row, col, pieces, isWhiteTurn) => {
  let moveSquares = [];
  [-1, 0, 1].forEach((i) => {
    if (row + i >= 0 && row + i < BOARD_SIZE) {
      [-1, 0, 1].forEach((j) => {
        if (col + j >= 0 && col + j < BOARD_SIZE) {
          if (!pieces[getSquareNotation(row + i, col + j)]) {
            moveSquares.push(getSquareNotation(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
}

export const isPlayerChecked = (whitePieces, blackPieces, hasStartingPositionMoved, isWhiteTurn) => {
  const pieces = isWhiteTurn ? whitePieces : blackPieces;
  const otherPieces = isWhiteTurn ? blackPieces : whitePieces;
  let kingSquare = "";
  Object.keys(pieces).forEach((square) => {
    if (pieces[square] == PIECE_KING) {
      kingSquare = square;
      return;
    }
  });
  return isSquareChecked(kingSquare, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn);
}

export const isSquareChecked = (square, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn) => {
  let foundCheck = false;
  for (var row = 0; row < BOARD_SIZE; row++) {
    for (var col = 0; col < BOARD_SIZE; col++) {
      if (otherPieces[getSquareNotation(row, col)]) {
        getMoveSquares(row, col, otherPieces, pieces, hasStartingPositionMoved, !isWhiteTurn, true).forEach((moveSquare) => {
          if (moveSquare == square) {
            foundCheck = true;
            return;
          }
        });
      }
    }
  }
  return foundCheck;
}

export const noLegalMovesExist = (whitePieces, blackPieces, hasStartingPositionMoved, isWhiteTurn) => {
  const pieces = isWhiteTurn ? whitePieces : blackPieces;
  const otherPieces = isWhiteTurn ? blackPieces : whitePieces;
  let foundLegalMove = false;
  for (var row = 0; row < BOARD_SIZE; row++) {
    for (var col = 0; col < BOARD_SIZE; col++) {
      if (pieces[getSquareNotation(row, col)]) {
        if (getMoveSquares(row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn).length > 0) {
          foundLegalMove = true;
          return;
        }
      }
    }
  }
  return !foundLegalMove;
}

const addCastleMoves = (moveSquares, row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn) => {
  if (pieces[getSquareNotation(row, col)] != PIECE_KING) { return; }
  if (isWhiteTurn && getSquareNotation(row, col) == "e1") {
    if (!hasStartingPositionMoved["e1"] && !hasStartingPositionMoved["h1"]) {
      if (!pieces["f1"] && !pieces["g1"]) {
        // TODO: Add check rules
        moveSquares.push("g1");
      }
    }
  }
}