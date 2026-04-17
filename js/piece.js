class Piece {
  constructor(type) {
    const def = TETROMINOES[type];
    this.type = type;
    this.shape = def.shape.map(row => [...row]);
    this.color = def.color;
    this.x = Math.floor((BOARD_WIDTH - this.shape[0].length) / 2);
    this.y = 0;
  }

  static random() {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    return new Piece(type);
  }

  // 時計回りに90度回転
  rotate() {
    const rows = this.shape.length;
    const cols = this.shape[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        rotated[c][rows - 1 - r] = this.shape[r][c];
      }
    }
    this.shape = rotated;
  }

  clone() {
    const p = new Piece(this.type);
    p.shape = this.shape.map(row => [...row]);
    p.x = this.x;
    p.y = this.y;
    return p;
  }
}
