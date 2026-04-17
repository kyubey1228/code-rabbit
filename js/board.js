class Board {
  constructor() {
    this.grid = this._createGrid();
  }

  _createGrid() {
    return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
  }

  reset() {
    this.grid = this._createGrid();
  }

  // ピースが指定座標に置けるか判定
  isValidPosition(shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (!shape[row][col]) continue;
        const newX = x + col;
        const newY = y + row;
        if (newX < 0 || newX >= BOARD_WIDTH) return false;
        if (newY >= BOARD_HEIGHT) return false;
        if (newY >= 0 && this.grid[newY][newX]) return false;
      }
    }
    return true;
  }

  // ピースをボードに固定する
  placePiece(piece) {
    const { shape, color, x, y } = piece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (!shape[row][col]) continue;
        const bx = x + col;
        const by = y + row;
        if (by >= 0) this.grid[by][bx] = color;
      }
    }
  }

  // 揃ったラインを消去して消去数を返す
  clearLines() {
    let count = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (this.grid[row].every(cell => cell !== null)) {
        this.grid.splice(row, 1);
        this.grid.unshift(Array(BOARD_WIDTH).fill(null));
        row++; // 同じ行を再チェック
        count++;
      }
    }
    return count;
  }

  // スポーン位置でブロックが重なっていればゲームオーバー
  isGameOver(piece) {
    return !this.isValidPosition(piece.shape, piece.x, piece.y);
  }
}
