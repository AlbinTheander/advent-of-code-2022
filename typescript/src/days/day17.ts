export function day17(data: string) {
  const result1 = part1(data)
  const result2 = part2(data);

  console.log('After 2022 pieces, the height of the pile is', result1);
  console.log('After 1000000000000 pieces, the height is', result2);
}

const masks = [1, 2, 4, 8, 16, 32, 64]
const pieces = [
  [4 + 8 + 16 + 32],
  [8, 4 + 8 + 16, 8],
  [16, 16, 4+8+16],
  [4, 4, 4, 4],
  [4 + 8, 4 + 8]
]

function part1(wind: string) {
  return simulate(wind, 2022)
}

function part2(wind: string) {
  /*
    The idea is to find three points in time (p1, p2, p3) where:
       * The same wind index is used
       * The same piece is about to fall
       * The number of pieces fallen between p1 och p2 is the same as p2 and p3
       * The depth increase between p1 and p2 is the same as p2 and p3
    
    If we find this, we assume that it will always repeat in the same way with these intervals. Then it's mostly
    a matter of finding how many whole loops like this will be made, etc.
  */
  const map = new Map<string, { count1: number, depth1: number, count2: number, depth2: number }>()
  const keyOf = (windIx: number, pieceIx: number) => `${windIx}-${pieceIx}`;
  let loopStart = 0
  let loopEnd = 0
  let depthAtLoopStart = 0
  let depthAtLoopEnd = 0 
  const callback = (windIx: number, pieceCount: number, depth: number) => {
    const pieceIx = pieceCount % pieces.length;
    const key = keyOf(windIx, pieceIx)
    const old = map.get(key)
    if (old) {
      if (old.count2 === 0) {
        map.set(key, { ...old, count2: pieceCount, depth2: depth })
      } else {
        const countDiff1 = old.count2 - old.count1
        const countDiff2 = pieceCount - old.count2
        const depthDiff1 = old.depth2 - old.depth1
        const depthDiff2 = depth - old.depth2
        if (countDiff1 === countDiff2 && depthDiff1 === depthDiff2) {
          loopStart = old.count1
          loopEnd = old.count2
          depthAtLoopStart = old.depth1
          depthAtLoopEnd = old.depth2
          return false
        }
      }
    } else {
      map.set(key, { count1: pieceCount, depth1: depth, count2: 0, depth2: 0 })
    }
    return true
  }
  // First simulation just to find the loop values
  simulate(wind, 10000, callback)

  // Now, let's do some calculations for the whole loops
  const loopSize = loopEnd - loopStart
  const wholeLoops = Math.floor((1000000000000 - loopStart) / loopSize)
  const rest = (1000000000000 - loopStart) % loopSize

  // And finally how many will be done for the leftover piece
  const restDepth = simulate(wind, loopEnd + rest) - depthAtLoopEnd
  
  // And put it all together
  return wholeLoops * (depthAtLoopEnd - depthAtLoopStart) + depthAtLoopStart + restDepth
}

// returns true if the simulation should continue
type Callback = (windIx: number, pieceCount: number, depth: number) => boolean

function simulate(wind: string, maxSteps: number, beforeEachPiece: Callback = () => true): number {
  let windIx = 0
  const getWind = () => wind[windIx++ % wind.length]
  let well: number[] = []
  let freeLines = (): number => {
    let i = 0
    while(i < well.length && well[i] === 0) i++
    return i
  }
  const getDepth = () => well.length - freeLines()

  for (let i = 0; i < maxSteps; i++) {
    if (!beforeEachPiece(windIx % wind.length, i, getDepth())) break;
    let piece = pieces[i % pieces.length]
    const pieceHeight = piece.length;
    const free = freeLines()
    let needed = 3 + pieceHeight - free
    while (needed < 0) { well.shift(); needed++; }
    for (let i = 0; i < needed; i++) well.unshift(0)
    let y = 0
    while (true) {
      let dir = getWind()
      if (dir === '<' && canMoveLeft(piece, well, y)) piece = piece.map(line => line >> 1)
      if (dir === '>' && canMoveRight(piece, well, y)) piece = piece.map(line => line << 1)
      if (!canDrop(piece, well, y)) break;
      y++
    }
    piece.forEach((line, i) => well[y + i] |= line)
  }

  return getDepth()
}

function canMoveLeft(piece: number[], well: number[], y: number) {
  if (piece.some(line => line & 1)) return false  // Already to the left
  const movedLeft = piece.map(line => line >> 1)
  return movedLeft.every((line, i) => (line & well[i + y]) === 0)
}

function canMoveRight(piece: number[], well: number[], y: number) {
  if (piece.some(line => line & 64)) return false  // Already to the right
  const movedRight = piece.map(line => line << 1)
  return movedRight.every((line, i) => (line & well[i + y]) === 0)
}

function canDrop(piece: number[], well: number[], y: number) {
  if (y + piece.length === well.length) return false  // Already at bottom
  return piece.every((line, i) => (line & well[i + y + 1]) === 0)
}

function printWell(well: number[], piece: number[] = [], y = -1) {
  if (y >= 0) {
    well = well.slice()
    piece.forEach((line, i) => well[y + i] = well[y] | line)
  }
  for(let line of well) {
    console.log(masks.map(m => (line & m) === 0 ? '.' : '#').join(''), line, line.toString(2))
  }
  console.log('')
}