// TODO: Represents all user interactions with the board - maybe better name exists?
import * as Board from './board';

const KEY_IS_PLAYER_WHITE = "IS_PLAYER_WHITE";
const KEY_ENABLE_SWITCH = "ENABLE_SWITCH";
const KEY_IS_GAME_OVER = "IS_GAME_OVER";
const KEY_SELECTED_SQUARE = "SELECTED_SQUARE";
const KEY_POSSIBLE_MOVES = "POSSIBLE_MOVES";

export const isGameOver = (user) => user[KEY_IS_GAME_OVER];
export const isSelected = (user) => user[KEY_SELECTED_SQUARE] != "";
export const getSelectedSquare = (user) => user[KEY_SELECTED_SQUARE];
export const isSquareSelected = (user, square) => user[KEY_SELECTED_SQUARE] == square;
export const isMovePossible = (user, square) => user[KEY_POSSIBLE_MOVES].includes(square);

export const setSelectedSquare = (user, square) => { user[KEY_SELECTED_SQUARE] = square };
export const setPossibleMoves = (user, possibleMoves) => { user[KEY_POSSIBLE_MOVES] = possibleMoves };

export const init = (isPlayerWhite, enableSwitch) => ({
  [KEY_IS_PLAYER_WHITE]: isPlayerWhite,
  [KEY_ENABLE_SWITCH]: enableSwitch,
  [KEY_IS_GAME_OVER]: false,
  [KEY_SELECTED_SQUARE]: "",
  [KEY_POSSIBLE_MOVES]: []
});

export const isViewWhite = (user, board) => {
  return user[KEY_ENABLE_SWITCH] ? Board.isWhiteTurn(board) : user[KEY_IS_PLAYER_WHITE];
}
