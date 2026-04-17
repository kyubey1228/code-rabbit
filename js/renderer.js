class Renderer {
  constructor(boardCanvas, nextCanvas, holdCanvas) {
    this.boardCtx = boardCanvas.getContext('2d');
    this.nextCtx = nextCanvas.getContext('2d');
    this.holdCtx = holdCanvas.getContext('2d');
  }

  _drawCell(ctx, x, y, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    // ハイライト
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, 4);
    ctx.globalAlpha = 1;
  }

  _drawBoard(board) {
    this.boardCtx.clearRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
    // グリッド線
    this.boardCtx.strokeStyle = '#1e1e2e';
    this.boardCtx.lineWidth = 0.5;
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      for (let c = 0; c < BOARD_WIDTH; c++) {
        this.boardCtx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        if (board.grid[r][c]) {
          this._drawCell(this.boardCtx, c, r, board.grid[r][c]);
        }
      }
    }
  }

  _drawPiece(piece) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          this._drawCell(this.boardCtx, piece.x + c, piece.y + r, piece.color);
        }
      }
    }
  }

  _drawMiniPiece(ctx, piece, dimmed = false) {
    ctx.clearRect(0, 0, 120, 120);
    if (!piece) return;
    const color = dimmed ? '#555' : piece.color;
    const offsetX = Math.floor((4 - piece.shape[0].length) / 2);
    const offsetY = Math.floor((4 - piece.shape.length) / 2);
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          this._drawCell(ctx, offsetX + c, offsetY + r, color);
        }
      }
    }
  }

  render(board, currentPiece, nextPiece, holdPiece, holdUsed) {
    this._drawBoard(board);
    if (currentPiece) {
      this._drawPiece(currentPiece);
    }
    this._drawMiniPiece(this.nextCtx, nextPiece);
    this._drawMiniPiece(this.holdCtx, holdPiece, holdUsed);
  }
}
