class Scoring {
  constructor() {
    this.reset();
    this.highScore = 0;
  }

  reset() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
  }

  // ライン消去時の得点加算
  addLines(count) {
    this.score += SCORE_TABLE[count];
    this.lines += count;
    this.level = Math.floor(this.lines / LINES_PER_LEVEL) + 1;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  getDropInterval() {
    const idx = Math.min(this.level - 1, DROP_SPEEDS.length - 1);
    return DROP_SPEEDS[idx];
  }
}
