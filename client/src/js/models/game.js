import * as AI from './ai';
import * as Board from './board';
import * as Move from '../models/move';
import * as User from '../models/user';

export const GAME_MODE_SANDBOX = "SANDBOX";
export const GAME_MODE_SWITCH = "SWITCH";
export const GAME_MODE_AI = "AI";
export const GAME_MODES = [GAME_MODE_SANDBOX, GAME_MODE_SWITCH, GAME_MODE_AI];
export const DEFAULT_GAME_MODE = GAME_MODE_SANDBOX;

const KEY_BOARD = "BOARD";
const KEY_USER = "USER";
const KEY_AI = "AI";
const KEY_IS_PLAYER_WHITE = "IS_PLAYER_WHITE";
const KEY_GAME_MODE = "GAME_MODE";
const KEY_IS_WHITE_TURN = "IS_WHITE_TURN";
const KEY_IS_PAUSED = "IS_PAUSED";

export const init = (gameMode, isPlayerWhite) => ({
  [KEY_BOARD]: Board.init(),
  [KEY_USER]: User.init(),
  [KEY_AI]: {},
  [KEY_GAME_MODE]: gameMode,
  [KEY_IS_PLAYER_WHITE]: isPlayerWhite,
  [KEY_IS_WHITE_TURN]: true,
  [KEY_IS_PAUSED]: false
});

const getBoard = (game) => game[KEY_BOARD];
const getUser = (game) => game[KEY_USER];
const getAI = (game) => game[KEY_AI];
const getGameMode = (game) => game[KEY_GAME_MODE];
export const isWhiteTurn = (game) => game[KEY_IS_WHITE_TURN];
export const isPaused = (user) => user[KEY_IS_PAUSED];

const endTurn = (game) => { game[KEY_IS_WHITE_TURN] = !game[KEY_IS_WHITE_TURN]; }

export const isWhitePiece = (game, square) => Board.isWhitePiece(getBoard(game), square);
export const getWhitePiece = (game, square) => Board.getWhitePiece(getBoard(game), square);
export const isBlackPiece = (game, square) => Board.isBlackPiece(getBoard(game), square);
export const getBlackPiece = (game, square) => Board.getBlackPiece(getBoard(game), square);

export const isSelected = (game) => User.isSelected(getUser(game));
export const getSelectedSquare = (game) => User.getSelectedSquare(getUser(game));
export const isSquareSelected = (game, square) => User.isSquareSelected(getUser(game), square);
export const isMovePossible = (game, square) => User.isMovePossible(getUser(game), square);

export const isViewWhite = (game) => {
  return getGameMode(game) == GAME_MODE_SWITCH ? isWhiteTurn(game) : game[KEY_IS_PLAYER_WHITE];
}

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
  User.setPossibleMoves(getUser(game), Move.getMoves(getBoard(game), isWhiteTurn(game), square));
}

export const move = (game, newSquare) => {
  Board.move(getBoard(game), isWhiteTurn(game), getSelectedSquare(game), newSquare);
  endTurn(game);
  if (getGameMode(game) == GAME_MODE_AI) {
    Board.move(getBoard(game), isWhiteTurn(game), ...AI.getMove(getAI(game), getBoard(game)));
    endTurn(game);
  }
  resetUserSelection(game);
}
