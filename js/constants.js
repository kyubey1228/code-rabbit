const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00FFFF' },
  O: { shape: [[1, 1], [1, 1]], color: '#FFFF00' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#AA00FF' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#FF7700' },
};

const PIECE_TYPES = Object.keys(TETROMINOES);

// レベルごとの落下間隔 (ms)
const DROP_SPEEDS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100];

// レベルアップに必要なライン数
const LINES_PER_LEVEL = 10;

// ライン数ごとの基本スコア
const SCORE_TABLE = [0, 100, 300, 500, 800];

// DAS: キーを押し続けてから連続移動が始まるまでの遅延 (ms)
const DAS_DELAY = 167;
// ARR: 連続移動の間隔 (ms)
const ARR_DELAY = 33;
