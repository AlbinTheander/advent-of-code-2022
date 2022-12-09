type Move = [string, number];

export function day09(data: string) {
  const moves: Move[] = data.split('\n').map(line => {
    const parts = line.split(' ');
    return [parts[0], +parts[1]];
  })
  const result1 = part2(moves);
  const result2 = data[1];

  console.log('First result', result1);
  console.log('Second result', result2);
}

function part1(moves: Move[]) {
  let headX = 0;
  let headY = 0;
  let tailX = 0;
  let tailY = 0;
  let tailsPos = new Set<string>();
  for (let [dir, length] of moves) {
    console.log('Moving', dir, length);
    for(let i = 0; i < length; i++) {
      switch(dir) {
        case 'U': headY--; break;
        case 'R': headX++; break;
        case 'D': headY++; break;
        case 'L': headX--; break;
      }
      ([tailX, tailY] = moveNext([headX, headY], [tailX, tailY]))
      tailsPos.add(tailX + '-' + tailY);
    }
  }
  console.log(tailsPos);
  console.log(tailsPos.size)
}
function part2(moves: Move[]) {
  let chain: [number, number][] = Array(10).fill(0).map(() => [0, 0]);
  let tailsPos = new Set<string>();
  for (let [dir, length] of moves) {

    for(let i = 0; i < length; i++) {
      switch(dir) {
        case 'U': chain[0][1]--; break;
        case 'R': chain[0][0]++; break;
        case 'D': chain[0][1]++; break;
        case 'L': chain[0][0]--; break;
      }
      for (let p = 1; p < chain.length; p++ ) {
        (chain[p] = moveNext(chain[p-1], chain[p]))
      }
      tailsPos.add(chain[9].toString());
    }
  }
  console.log(tailsPos);
  console.log(tailsPos.size)
}

function moveNext([x1, y1], [x2, y2]): [number, number] {
  let x3 = x2, y3 = y2
  if (Math.abs(x1 - x2) > 1 || Math.abs(y1 - y2) > 1) {
    if (x2 < x1) { x3++ } else if (x2 > x1) { x3-- }
    if (y2 < y1) { y3++ } else if (y2 > y1) { y3-- }
  }
  return [x3, y3];
}