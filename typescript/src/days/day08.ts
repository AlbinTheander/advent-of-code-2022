import { arrayCopy2, column, prod, sum, to2DArray } from "./utils/utils";

export function day08(data: string) {
  const trees = to2DArray(data, '', true)

  const result1 = part1(trees);
  const result2 = part2(trees);

  console.log('Number of visible trees', result1);
  console.log('View score for the best tree house position', result2);
}

function part1(trees: number[][]): number {
  const canBeSeen = (x: number, y: number) => {
    const height = trees[y][x]
    const views = treeViews(trees, x, y);
    return views.some(direction => direction.every(t => t < height))
  }
  let count = 0;
  trees.forEach((row, y) => row.forEach((_, x) => {
    if (canBeSeen(x, y)) count++;
  }))
  return count;
}

function part2(trees: number[][]) {
  const viewSize = (x: number, y: number): number => {
    const views = treeViews(trees, x, y)
    return views.map(view => {
      let n = 0
      while(n < view.length && view[n] < trees[y][x]) n++;
      if (n < view.length) n++;
      return n;
    }).reduce(prod)
  }

  const viewSizes = trees.flatMap((row, y) => row.map((_, x) => viewSize(x, y)))
  return Math.max(...viewSizes)
}

const treeViews = (trees: number[][], x: number, y: number): [number[], number[], number[], number[]] => {
  const row = trees[y]
  const col = column(trees, x)
  const left = row.slice(0, x).reverse()
  const right = row.slice(x+1)
  const above = col.slice(0, y).reverse()
  const below = col.slice(y+1)

  return [above, right, below, left];
}