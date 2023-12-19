import * as Board from '../models/board';

export const getPaddingStyle = (size) => ({
  padding: size + "px"
});

export const getPieceImage = (piece, isWhite) => {
  if (isWhite) {
    switch(piece) {
      case Board.PAWN:
        return require('../../assets/piece_images/pawn_white.png');
      case Board.KNIGHT:
        return require('../../assets/piece_images/knight_white.png');
      case Board.BISHOP:
        return require('../../assets/piece_images/bishop_white.png');
      case Board.ROOK:
        return require('../../assets/piece_images/rook_white.png');
      case Board.QUEEN:
        return require('../../assets/piece_images/queen_white.png');
      case Board.KING:
        return require('../../assets/piece_images/king_white.png');
    }
  } else {
    switch(piece) {
      case Board.PAWN:
        return require('../../assets/piece_images/pawn_black.png');
      case Board.KNIGHT:
        return require('../../assets/piece_images/knight_black.png');
      case Board.BISHOP:
        return require('../../assets/piece_images/bishop_black.png');
      case Board.ROOK:
        return require('../../assets/piece_images/rook_black.png');
      case Board.QUEEN:
        return require('../../assets/piece_images/queen_black.png');
      case Board.KING:
        return require('../../assets/piece_images/king_black.png');
    }
  }
};

export const getTileBackgroundStyle = (row, col, isSelected, isMove) => {
  let style = {opacity: 0.7};
  const isLightSquare = (row + col) % 2 == 1;
  style['backgroundColor'] = isLightSquare ? 'rgb(230, 230, 230)' : 'rgb(0, 110, 0)';
  if (isSelected) {
    style['backgroundColor'] = isLightSquare ? 'rgb(230, 230, 0)' : 'rgb(150, 200, 50)';
  }
  if (isMove) {
    style['backgroundColor'] = isLightSquare ? 'rgb(180, 230, 230)' : 'rgb(120, 180, 180)';
  }
  return style;
};
