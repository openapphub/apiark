export interface DiffLine {
  type: "equal" | "add" | "remove";
  content: string;
  leftNum: number | null;
  rightNum: number | null;
}

/**
 * Compute a line-level diff between two strings using a simplified Myers algorithm.
 */
export function computeLineDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  // Simple LCS-based diff
  const m = linesA.length;
  const n = linesB.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  let i = m;
  let j = n;
  const ops: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      ops.push({ type: "equal", content: linesA[i - 1], leftNum: i, rightNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: "add", content: linesB[j - 1], leftNum: null, rightNum: j });
      j--;
    } else if (i > 0) {
      ops.push({ type: "remove", content: linesA[i - 1], leftNum: i, rightNum: null });
      i--;
    }
  }

  ops.reverse();
  return ops;
}
