// TODO: Represents all user interactions with the board - maybe better name exists?
const KEY_SELECTED_SQUARE = "SELECTED_SQUARE";
const KEY_POSSIBLE_MOVES = "POSSIBLE_MOVES";

export const init = () => ({
  [KEY_SELECTED_SQUARE]: "",
  [KEY_POSSIBLE_MOVES]: []
});

export const isSelected = (user) => user[KEY_SELECTED_SQUARE] != "";
export const getSelectedSquare = (user) => user[KEY_SELECTED_SQUARE];
export const isSquareSelected = (user, square) => user[KEY_SELECTED_SQUARE] == square;
export const isMovePossible = (user, square) => user[KEY_POSSIBLE_MOVES].includes(square);

export const setSelectedSquare = (user, square) => { user[KEY_SELECTED_SQUARE] = square };
export const setPossibleMoves = (user, possibleMoves) => { user[KEY_POSSIBLE_MOVES] = possibleMoves };
