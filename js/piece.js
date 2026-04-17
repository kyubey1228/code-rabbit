class Piece {
  constructor(type) {
    const def = TETROMINOES[type];
    this.type = type;
    this.shape = def.shape.map(row => [...row]);
    this.color = def.color;
    this.x = Math.floor((BOARD_WIDTH - this.shape[0].length) / 2);
    this.y = 0;
  }

  // 7種類のピースが必ず1回ずつ出現する7bagランダマイザー
  static random() {
    if (!Piece._bag || Piece._bagIndex >= Piece._bag.length) {
      Piece._bag = Piece._shuffle([...PIECE_TYPES]);
      Piece._bagIndex = 0;
    }
    return new Piece(Piece._bag[Piece._bagIndex++]);
  }

  // Fisher-Yates シャッフル
  static _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      // BUG: (i + 1) とすべきところを i にしているため、
      // arr[0] は常に i=1 のときしか交換対象にならず出現確率が偏る
      const j = Math.floor(Math.random() * i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

Piece._bag = null;
Piece._bagIndex = 0;
