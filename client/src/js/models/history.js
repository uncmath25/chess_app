import * as Game from './game';

const KEY_GAME_ARR = "GAME_ARR";
const KEY_GAME_IDX = "GAME_IDX";

export const init = (gameMode, isPlayerWhite) => {
  const history = initHistory(gameMode, isPlayerWhite);
  if (Game.isGameModeAI(getGame(history)) && !isPlayerWhite) {
    const newGame = Game.copy(getGame(history));
    Game.moveAI(newGame);
    addGame(history, newGame);
  }
  return history;
};
const initHistory = (gameMode, isPlayerWhite) => ({
  [KEY_GAME_ARR]: [Game.init(gameMode, isPlayerWhite)],
  [KEY_GAME_IDX]: 0
});

export const getGame = (history) => history[KEY_GAME_ARR][history[KEY_GAME_IDX]];
export const getCurrentTurn = (history) => history[KEY_GAME_IDX];
export const getTotalTurns = (history) => history[KEY_GAME_ARR].length - 1;
export const isPaused = (history) => history[KEY_GAME_IDX] != history[KEY_GAME_ARR].length - 1;

export const goToStart = (history) => { history[KEY_GAME_IDX] = 0; }
export const goBack = (history) => {
  if (history[KEY_GAME_IDX] > 0) { history[KEY_GAME_IDX]--; }
}
export const goForward = (history) => {
  if (history[KEY_GAME_IDX] < history[KEY_GAME_ARR].length - 1) { history[KEY_GAME_IDX]++; }
}
export const goToLatest = (history) => { history[KEY_GAME_IDX] = history[KEY_GAME_ARR].length - 1; }

const addGame = (history, game) => {
  history[KEY_GAME_ARR].push(game);
  history[KEY_GAME_IDX]++;
  // Necessary, so selection is gone when go back in history
  clearPreviousUserSelection(history);
}
const clearPreviousUserSelection = (history) => {
  Game.resetUserSelection(history[KEY_GAME_ARR][history[KEY_GAME_IDX] - 1]);
}

export const resetUserSelection = (history) => {
  Game.resetUserSelection(getGame(history));
};
export const updateUserSelection = (history, square) => {
  Game.updateUserSelection(getGame(history), square);
};
export const move = (history, square) => {
  const newGame = Game.copy(getGame(history));
  Game.move(newGame, square);
  addGame(history, newGame);
  if (Game.isGameModeAI(getGame(history)) && Game.hasMoves(getGame(history))) {
    const newGame = Game.copy(getGame(history));
    Game.moveAI(newGame);
    addGame(history, newGame);
  }
};

