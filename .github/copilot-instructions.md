# GitHub Copilot Instructions

このプロジェクトはバニラ JavaScript で実装したテトリスゲームです。

## 基本方針
- レビューコメントは日本語で記述してください
- バグ・ロジックミス・セキュリティ問題を最優先で指摘してください
- 軽微な提案は「💡 提案」、重大な問題は「🚨 重大」と表記してください

## 重点確認箇所

### js/scoring.js
- レベル倍率が正しく適用されているか
- `localStorage` の読み書きで `parseInt` による型変換が行われているか
- ハイスコアの比較ロジックに問題がないか

### js/piece.js
- 回転行列の実装: `rotated[c][rows-1-r] = shape[r][c]` （時計回り90度）
- この式と異なる実装は回転方向のバグの可能性がある

### js/renderer.js
- ゴーストピースの描画位置: `isValidPosition` が false になった時点の `ghostY` が正しい落下先
- `ghostY + 1` を使っている場合はバグ

### js/game.js
- ウォールキックのオフセット値は ±1 が標準（±2 以上はピース貫通バグ）
- ハードドロップのスコア加算は 2点/セル

### js/board.js
- 境界チェック: 右端 `newX >= BOARD_WIDTH`、左端 `newX < 0`、下端 `newY >= BOARD_HEIGHT`
