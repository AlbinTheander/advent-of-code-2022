type Move = [string, number]
type Pos = { x: number, y: number }
type Rope = Pos[]

export function day09(data: string) {
  const moves: Move[] = data.split('\n').map(line => {
    const parts = line.split(' ');
    return [parts[0], +parts[1]];
  })
  const result1 = part1(moves);
  const result2 = part2(moves);

  console.log('The tail of the two knot rope covers', result1, 'coordinates');
  console.log('The tail of the ten knot rope covers', result2, 'coordinates');
}

function part1(moves: Move[]) {
  const rope = Array(2).fill({x: 0, y: 0});
  return runIt(rope, moves);
}

function part2(moves: Move[]) {
  const rope = Array(10).fill({x: 0, y: 0});
  return runIt(rope, moves);
}

function runIt(originalRope: Rope, moves: Move[]): number {
  let rope = originalRope;
  let tailPositions = new Set<string>();

  for(let [direction, length] of moves) {
    for(let i = 0; i < length; i++) {
      rope = update(rope, direction);
      const {x, y} = rope[rope.length-1];
      tailPositions.add(`${x},${y}`)
    }
  }
  return tailPositions.size;
}

function update(rope: Rope, direction: string): Rope {
  const newRope = [];
  newRope.push(movePos(rope[0], direction));
  for (let i = 1; i < rope.length; i++) {
    newRope.push(moveNext(newRope[i-1], rope[i]));
  }
  return newRope;
}

function movePos({x, y}: Pos, direction: string): Pos {
  switch(direction) {
    case 'U': return { x, y: y-1 };
    case 'R': return { x: x+1, y };
    case 'D': return { x, y: y+1 };
    case 'L': return { x: x-1, y };
  }
}

function moveNext(target: Pos, pos: Pos): Pos {
  if (Math.abs(target.x - pos.x) > 1 || Math.abs(target.y - pos.y) > 1) {
    const x = (pos.x < target.x) ? (pos.x + 1) :
              (pos.x > target.x) ? (pos.x - 1) : pos.x
    const y = (pos.y < target.y) ? (pos.y + 1) :
              (pos.y > target.y) ? (pos.y - 1) : pos.y
    return {x, y}
  }
  return pos
}