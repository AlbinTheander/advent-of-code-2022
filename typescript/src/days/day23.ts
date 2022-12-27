import { Infinite2DSet } from "./utils/infinite2DSet";

export function day23(data: string) {
  const map = parse(data);
  const [result1, result2] = part1and2(map);

  console.log("The number of empty squares after 10 rounds are", result1);
  console.log("The elves stop moving after", result2, 'rounds');
}

function parse(data: string): Infinite2DSet {
  const map = new Infinite2DSet();
  data.split("\n").forEach((line, y) =>
    [...line].forEach((ch, x) => {
      if (ch === "#") map.add(x, y);
    })
  );

  return map;
}

function part1and2(map: Infinite2DSet): [number, number] {
  const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]
  const rotateDirections = () => directions.push(directions.shift())

  const alone = (x, y) => {
    for(let dx = -1; dx <= 1; dx++)
      for(let dy = -1; dy <= 1; dy++)
        if ((dx !== 0 || dy !== 0) && map.has(x+dx, y+dy)) return false
    return true
  }
  
  const getMove = (x, y) => {
    for(let [dx, dy] of directions) {
      if (dy === 0) {
        if ([-1, 0, 1].every(dy1 => !map.has(x + dx, y + dy1))) return [x + dx, y + dy]
      } else {
        if ([-1, 0, 1].every(dx1 => !map.has(x + dx1, y + dy))) return [x + dx, y + dy]
      }
    }
    return null
  }

  const getSizeScore = () => {
    const [minX, minY, maxX, maxY] = map.bounds
    return (maxX - minX + 1)*(maxY-minY+1) - map.size
  }


  let rounds = 0
  let after10 = 0
  while(true) {
    if (rounds === 10) after10 = getSizeScore()
    const moves = []
    const once = new Set<string>()
    const twice = new Set<string>()
    const toKey = (x, y) => x + ',' + y
    
    map.forEach((x, y) => {
      if (!alone(x, y)) {
        let move = getMove(x, y)
        if (move) {
          const [x1, y1] = move
          const key = toKey(x1, y1)
          if (once.has(key)) twice.add(key); else once.add(key)
          if (!twice.has(key)) moves.push([x, y, x1, y1, key])
        }
      } else {
      }
    })
    
    moves.forEach(([x, y, x1, y1, key]) => {
      if (!twice.has(key)) {
        map.remove(x, y)
        map.add(x1, y1)
      }
    })
    rounds++
    if (moves.length === 0) break;
    rotateDirections()
  }
  return [after10, rounds]
}