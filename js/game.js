class Game {
  constructor() {
    this.board = new Board();
    this.scoring = new Scoring();
    this.renderer = new Renderer(
      document.getElementById('board'),
      document.getElementById('next-canvas'),
      document.getElementById('hold-canvas')
    );

    this.currentPiece = null;
    this.nextPiece = null;
    this.holdPiece = null;
    this.holdUsed = false;

    this.isRunning = false;
    this.isPaused = false;
    this.dropTimer = null;

    // DAS/ARR 用タイマー
    this._dasTimer = null;
    this._arrTimer = null;

    this._bindUI();
    this._bindKeys();
    this._updateStats();
  }

  _bindUI() {
    document.getElementById('start-btn').addEventListener('click', () => this.start());
    document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
    document.getElementById('restart-btn').addEventListener('click', () => this.start());
  }

  _bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (!this.isRunning || this.isPaused) return;
      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          this._moveLeft();
          this._startDAS('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          this._moveRight();
          this._startDAS('right');
          break;
        case 'ArrowDown':  e.preventDefault(); this._softDrop(); break;
        case 'ArrowUp':    e.preventDefault(); this._rotate(); break;
        case 'Space':      e.preventDefault(); this._hardDrop(); break;
        case 'KeyC':       e.preventDefault(); this._hold(); break;
        case 'KeyP':       e.preventDefault(); this.togglePause(); break;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        this._clearDAS();
      }
    });
  }

  // DAS 開始: DAS_DELAY 後に ARR を開始する
  _startDAS(direction) {
    this._clearDAS();
    this._dasTimer = setTimeout(() => {
      this._arrTimer = setInterval(() => {
        if (!this.isRunning || this.isPaused) {
          this._clearDAS();
          return;
        }
        if (direction === 'left') this._moveLeft();
        else this._moveRight();
      }, ARR_DELAY);
    }, DAS_DELAY);
  }

  // BUG: _arrTimer (setInterval) がクリアされていない。
  // キーを離してもARRが動き続け、ピースが意図せず移動し続ける。
  _clearDAS() {
    clearTimeout(this._dasTimer);
    this._dasTimer = null;
    // clearInterval(this._arrTimer) が抜けている
    this._arrTimer = null;
  }

  start() {
    this.board.reset();
    this.scoring.reset();
    this.holdPiece = null;
    this.holdUsed = false;
    this.nextPiece = Piece.random();
    this._spawn();
    this.isRunning = true;
    this.isPaused = false;
    document.getElementById('start-btn').disabled = true;
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('pause-btn').textContent = 'PAUSE';
    document.getElementById('game-over-screen').classList.add('hidden');
    this._scheduleDrops();
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this._stopDrops();
      document.getElementById('pause-btn').textContent = 'RESUME';
    } else {
      this._scheduleDrops();
      document.getElementById('pause-btn').textContent = 'PAUSE';
    }
  }

  _scheduleDrops() {
    this._stopDrops();
    this.dropTimer = setInterval(() => this._tick(), this.scoring.getDropInterval());
  }

  _stopDrops() {
    if (this.dropTimer) {
      clearInterval(this.dropTimer);
      this.dropTimer = null;
    }
  }

  _tick() {
    if (!this._moveDown()) {
      this._lock();
    }
  }

  _spawn() {
    this.currentPiece = this.nextPiece;
    this.nextPiece = Piece.random();
    if (this.board.isGameOver(this.currentPiece)) {
      this._gameOver();
    }
    this._render();
  }

  _lock() {
    this.board.placePiece(this.currentPiece);
    const lines = this.board.clearLines();
    if (lines > 0) {
      this.scoring.addLines(lines);
      this._scheduleDrops();
    }
    this.holdUsed = false;
    this._updateStats();
    this._spawn();
  }

  _moveLeft() {
    if (this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x - 1, this.currentPiece.y)) {
      this.currentPiece.x--;
      this._render();
    }
  }

  _moveRight() {
    if (this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x + 1, this.currentPiece.y)) {
      this.currentPiece.x++;
      this._render();
    }
  }

  _moveDown() {
    if (this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      this._render();
      return true;
    }
    return false;
  }

  _softDrop() {
    if (this._moveDown()) {
      this.scoring.score += 1; // ソフトドロップ: 1セル = 1点
      this._updateStats();
    }
  }

  _hardDrop() {
    let cells = 0;
    while (this._moveDown()) cells++;
    // BUG: ハードドロップは 2点/セル が正しいが 1点/セル になっている
    this.scoring.score += cells;
    this._updateStats();
    this._lock();
  }

  // ウォールキック付き回転: 壁際でも回転できるようオフセットを試みる
  _rotate() {
    const clone = this.currentPiece.clone();
    clone.rotate();

    // BUG: ウォールキックのオフセットが 2 になっており、壁を突き抜けて
    // 反対側に出ることがある。正しくは ±1
    const kicks = [0, 2, -2];
    for (const offset of kicks) {
      if (this.board.isValidPosition(clone.shape, clone.x + offset, clone.y)) {
        this.currentPiece.shape = clone.shape;
        this.currentPiece.x = clone.x + offset;
        this._render();
        return;
      }
    }
  }

  _hold() {
    if (this.holdUsed) return;
    if (this.holdPiece) {
      const tmp = this.holdPiece;
      this.holdPiece = new Piece(this.currentPiece.type);
      this.currentPiece = tmp;
      this.currentPiece.x = Math.floor((BOARD_WIDTH - this.currentPiece.shape[0].length) / 2);
      this.currentPiece.y = 0;
    } else {
      this.holdPiece = new Piece(this.currentPiece.type);
      this.currentPiece = this.nextPiece;
      this.nextPiece = Piece.random();
    }
    this.holdUsed = true;
    this._render();
  }

  _gameOver() {
    this.isRunning = false;
    this._stopDrops();
    document.getElementById('start-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
    document.getElementById('game-over-screen').classList.remove('hidden');
  }

  _render() {
    this.renderer.render(this.board, this.currentPiece, this.nextPiece, this.holdPiece, this.holdUsed);
  }

  _updateStats() {
    document.getElementById('score').textContent = this.scoring.score.toLocaleString();
    document.getElementById('high-score').textContent = this.scoring.highScore.toLocaleString();
    document.getElementById('level').textContent = this.scoring.level;
    document.getElementById('lines').textContent = this.scoring.lines;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
