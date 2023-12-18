import * as Game from './game';

const MOVE_SHORT_CASTLE = "o";
const MOVE_LONG_CASTLE = "O";

export const getMoveSquares = (row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn, skipCheck=false) => {
  let moveSquares = getRawMoveSquares(row, col, pieces, otherPieces, isWhiteTurn);
  addCastleMoves(moveSquares, row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn);
  if (skipCheck) { return moveSquares; }
  let legalMoveSquares = [];
  const oldSquare = Game.getSquareNotation(row, col);
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
  if (pieces[oldSquare] == PAWN && (newSquare[1] == 1 || newSquare[1] == Game.BOARD_SIZE)) {
    pieces[newSquare] = QUEEN;
  }
}

const handleCastles = (pieces, oldSquare, newSquare) => {
  [1, Game.BOARD_SIZE].forEach((row) => {
    if (oldSquare == "e" + row) {
      if (newSquare == "g" + row) {
        pieces["g" + row] = KING;
        pieces["f" + row] = ROOK;
        pieces["h" + row] = "";
      }
      if (newSquare == "a" + row) {
        pieces["c" + row] = KING;
        pieces["d" + row] = ROOK;
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
  switch (pieces[Game.getSquareNotation(row, col)]) {
    case PAWN:
      return getPawnMoveSquares(row, col, pieces, otherPieces, isWhiteTurn);
    case KNIGHT:
      return getKnightMoveSquares(row, col, pieces);
    case BISHOP:
      return getBishopMoveSquares(row, col, pieces, otherPieces);
    case ROOK:
      return getRookMoveSquares(row, col, pieces, otherPieces);
    case QUEEN:
      return getQueenMoveSquares(row, col, pieces, otherPieces);
    case KING:
      return getKingMoveSquares(row, col, pieces, isWhiteTurn);
  }
}

const getPawnMoveSquares = (row, col, pieces, otherPieces, isWhiteTurn) => {
  let moveSquares = [];
  const nextRow = row + (isWhiteTurn ? 1 : -1);
  if (!pieces[Game.getSquareNotation(nextRow, col)] && !otherPieces[Game.getSquareNotation(nextRow, col)]) {
    moveSquares.push(Game.getSquareNotation(nextRow, col));
  }
  const startRow = isWhiteTurn ? 1 : Game.BOARD_SIZE - 2
  const farRow = row + (isWhiteTurn ? 2 : -2);
  if (row == startRow && !pieces[Game.getSquareNotation(farRow, col)] && !otherPieces[Game.getSquareNotation(farRow, col)]) {
    moveSquares.push(Game.getSquareNotation(farRow, col));
  }
  if (col >= 1 && otherPieces[Game.getSquareNotation(nextRow, col - 1)]) {
    moveSquares.push(Game.getSquareNotation(nextRow, col - 1));
  }
  if (col <= Game.BOARD_SIZE - 2 && otherPieces[Game.getSquareNotation(nextRow, col + 1)]) {
    moveSquares.push(Game.getSquareNotation(nextRow, col + 1));
  }
  return moveSquares;
}

const getKnightMoveSquares = (row, col, pieces) => {
  let moveSquares = [];
  const iter = [-2, -1, 1, 2];
  iter.forEach((i) => {
    if (row + i >= 0 && row + i < Game.BOARD_SIZE) {
      [-(3 - Math.abs(i)), (3 - Math.abs(i))].forEach((j) => {
        if (col + j >= 0 && col + j < Game.BOARD_SIZE) {
          if (!pieces[Game.getSquareNotation(row + i, col + j)]) {
            moveSquares.push(Game.getSquareNotation(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
}

const getMoveInDirection = (row, col, pieces, otherPieces, moveSquares, dir) => {
  let k = 1;
  while (row + dir[0]*k >= 0 && row + dir[0]*k < Game.BOARD_SIZE
    && col + dir[1]*k >= 0 && col + dir[1]*k < Game.BOARD_SIZE
    && !pieces[Game.getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) {
    moveSquares.push(Game.getSquareNotation(row + dir[0]*k, col + dir[1]*k));
    if (otherPieces[Game.getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) { break; }
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
    if (row + i >= 0 && row + i < Game.BOARD_SIZE) {
      [-1, 0, 1].forEach((j) => {
        if (col + j >= 0 && col + j < Game.BOARD_SIZE) {
          if (!pieces[Game.getSquareNotation(row + i, col + j)]) {
            moveSquares.push(Game.getSquareNotation(row + i, col + j));
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
    if (pieces[square] == KING) {
      kingSquare = square;
      return;
    }
  });
  return isSquareChecked(kingSquare, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn);
}

export const isSquareChecked = (square, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn) => {
  let foundCheck = false;
  for (var row = 0; row < Game.BOARD_SIZE; row++) {
    for (var col = 0; col < Game.BOARD_SIZE; col++) {
      if (otherPieces[Game.getSquareNotation(row, col)]) {
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
  for (var row = 0; row < Game.BOARD_SIZE; row++) {
    for (var col = 0; col < Game.BOARD_SIZE; col++) {
      if (pieces[Game.getSquareNotation(row, col)]) {
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
  if (pieces[Game.getSquareNotation(row, col)] != KING) { return; }
  if (isWhiteTurn && Game.getSquareNotation(row, col) == "e1") {
    if (!hasStartingPositionMoved["e1"] && !hasStartingPositionMoved["h1"]) {
      if (!pieces["f1"] && !pieces["g1"]) {
        // TODO: Add check rules
        moveSquares.push("g1");
      }
    }
  }
}