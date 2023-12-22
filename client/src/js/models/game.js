import * as AI from './ai';
import * as Board from './board';
import * as Castle from './castle';
import * as Move from './move';
import * as User from './user';

const GAME_MODE_SANDBOX = "SANDBOX";
const GAME_MODE_AI_RANDOM = "AI_RANDOM";
const GAME_MODE_AI_DEPTH_1 = "AI_DEPTH_1";
const GAME_MODE_AI_DEPTH_2 = "AI_DEPTH_2";
export const GAME_MODES = [
  GAME_MODE_SANDBOX,
  GAME_MODE_AI_RANDOM,
  GAME_MODE_AI_DEPTH_1,
  GAME_MODE_AI_DEPTH_2
];
// export const DEFAULT_GAME_MODE = GAME_MODE_SANDBOX;
// export const DEFAULT_GAME_MODE = GAME_MODE_AI_RANDOM;
// export const DEFAULT_GAME_MODE = GAME_MODE_AI_DEPTH_1;
export const DEFAULT_GAME_MODE = GAME_MODE_AI_DEPTH_2;

const KEY_BOARD = "BOARD";
const KEY_USER = "USER";
const KEY_AI = "AI";
const KEY_IS_WHITE_TURN = "IS_WHITE_TURN";
const KEY_CASTLE = "CASTLE";
const KEY_IS_CHECKED = "IS_CHECKED";
const KEY_HAS_MOVES = "HAS_MOVES";

export const init = (gameMode) => ({
  [KEY_BOARD]: Board.init(),
  [KEY_USER]: User.init(),
  [KEY_AI]: buildAIConfig(gameMode),
  [KEY_IS_WHITE_TURN]: true,
  [KEY_CASTLE]: Castle.init(),
  [KEY_IS_CHECKED]: false,
  [KEY_HAS_MOVES]: true
});
const buildAIConfig = (gameMode) => {
  const config = {};
  if (gameMode == GAME_MODE_AI_RANDOM) { AI.setType(config, AI.AI_TYPE_RANDOM) }
  if (gameMode == GAME_MODE_AI_DEPTH_1) { AI.setType(config, AI.AI_TYPE_DEPTH_1) }
  if (gameMode == GAME_MODE_AI_DEPTH_2) { AI.setType(config, AI.AI_TYPE_DEPTH_2) }
  return config;
};

export const copy = (game) => ({
  [KEY_BOARD]: Board.copy(getBoard(game)),
  [KEY_USER]: {...getUser(game)},
  [KEY_AI]: {...getAI(game)},
  [KEY_IS_WHITE_TURN]: isWhiteTurn(game),
  [KEY_CASTLE]: getCastle(game),
  [KEY_IS_CHECKED]: isChecked(game),
  [KEY_HAS_MOVES]: hasMoves(game)
});

const getBoard = (game) => game[KEY_BOARD];
const getUser = (game) => game[KEY_USER];
const getAI = (game) => game[KEY_AI];
export const isWhiteTurn = (game) => game[KEY_IS_WHITE_TURN];
const getCastle = (game) => game[KEY_CASTLE];
export const isChecked = (game) => game[KEY_IS_CHECKED];
export const hasMoves = (game) => game[KEY_HAS_MOVES];

export const isWhitePiece = (game, square) => Board.isWhitePiece(getBoard(game), square);
export const getWhitePiece = (game, square) => Board.getWhitePiece(getBoard(game), square);
export const isBlackPiece = (game, square) => Board.isBlackPiece(getBoard(game), square);
export const getBlackPiece = (game, square) => Board.getBlackPiece(getBoard(game), square);

export const isSelected = (game) => User.isSelected(getUser(game));
export const getSelectedSquare = (game) => User.getSelectedSquare(getUser(game));
export const isSquareSelected = (game, square) => User.isSquareSelected(getUser(game), square);
export const isMovePossible = (game, square) => User.isMovePossible(getUser(game), square);

export const isSelectionPossible = (game, square) => {
  return (isWhiteTurn(game) && Board.isWhitePiece(getBoard(game), square)) ||
  (!isWhiteTurn(game) && Board.isBlackPiece(getBoard(game), square))
};
export const resetUserSelection = (game) => {
  User.setSelectedSquare(getUser(game), "");
  User.setPossibleMoves(getUser(game), []);
}
export const updateUserSelection = (game, square) => {
  User.setSelectedSquare(getUser(game), square);
  User.setPossibleMoves(getUser(game),
    Move.getLegalMoves(getBoard(game), isWhiteTurn(game), getCastle(game), square));
}

export const move = (game, newSquare) => {
  Board.move(getBoard(game), isWhiteTurn(game), getSelectedSquare(game), newSquare);
  Castle.update(getCastle(game), getSelectedSquare(game));
  endTurn(game);
}
export const moveAI = (game) => {
  const [oldSquare, newSquare] = AI.getMove(
    getAI(game), getBoard(game), isWhiteTurn(game), getCastle(game));
  console.log([oldSquare, newSquare]);
  Board.move(getBoard(game), isWhiteTurn(game), oldSquare, newSquare);
  Castle.update(getCastle(game), oldSquare);
  endTurn(game);
}
const endTurn = (game) => {
  game[KEY_IS_WHITE_TURN] = !game[KEY_IS_WHITE_TURN];
  game[KEY_IS_CHECKED] = Move.isPlayerChecked(getBoard(game), isWhiteTurn(game));
  game[KEY_HAS_MOVES] = Move.doesLegalMoveExist(getBoard(game), isWhiteTurn(game), getCastle(game));
}

export const getPoints = (game, isWhite) => Board.getPoints(getBoard(game), isWhite);
