class Scoring {
  constructor() {
    this.reset();
    this.highScore = 0;
  }

  reset() {
    this.score = 0;
    this.level = 0;  // 0始まりに変更
    this.lines = 0;
  }

  // ライン消去時の得点加算（レベル倍率付き）
  addLines(count) {
    // BUG: level が 0 から始まるため、最初は * 0 になりスコアが入らない
    // 正しくは SCORE_TABLE[count] * (this.level + 1)
    this.score += SCORE_TABLE[count] * this.level;
    this.lines += count;
    this.level = Math.floor(this.lines / LINES_PER_LEVEL);
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  getDropInterval() {
    const idx = Math.min(this.level, DROP_SPEEDS.length - 1);
    return DROP_SPEEDS[idx];
  }
}
