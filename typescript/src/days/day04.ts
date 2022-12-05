export function day04(data: string) {
  const lines: number[][] = data.split('\n').map(line => line.match(/\d+/g).map(Number))
  const result1 = part1(lines);
  const result2 = part2(lines);

  console.log('Pairs where one section contains the other', result1);
  console.log('Number of overlapping sections', result2);
}

function part1(spans: number[][]) {
  let containing = spans.filter(([min1, max1, min2, max2]) => contains(min1, max1, min2, max2) || contains(min2, max2, min1, max1));
  return containing.length;
}
function part2(spans: number[][]) {
  let containing = spans.filter(([min1, max1, min2, max2]) => overlaps(min1, max1, min2, max2));
  return containing.length;
}

function contains(min1: number, max1: number, min2: number, max2: number): boolean {
  return (min1 <= min2) && max1 >= max2
}

function overlaps(min1: number, max1: number, min2: number, max2: number): boolean {
  return contains(min1, max1, min2, max2) ||
         contains(min2, max2, min1, max1) ||
         (min1 <= min2 && max1 >= min2) ||
         (min1 <= max2 && max1 >= max2)
}


