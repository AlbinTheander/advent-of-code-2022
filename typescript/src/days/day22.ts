import { Array2D, toChar2D } from "./utils/Array2D";

export function day22(data: string) {
  const map = parse(data)
  const result1 = part1(map);
  const result2 = part2(map);

  console.log('The flat password is', result1);
  console.log('The cubic password is', result2);
}

function parse(data: string): { map: Array2D<string, string>, directions: [number, string][]} {
  const [mapPart, directionPart] = data.split('\n\n')
  const mapLines = mapPart.split('\n')
  const maxLen = Math.max(...mapLines.map(l => l.length))
  const paddedMapLines = mapLines.map(line => line + ' '.repeat(maxLen - line.length))
  const map = toChar2D(paddedMapLines.join('\n'), ' ')
  const directions: [number, string][] = (directionPart + 'N').match(/\d+[A-Z]/g).map((d) =>  [+d.slice(0, -1), d.slice(-1)])
  return { map, directions }
}

function part1({map, directions}: { map: Array2D<string, string>, directions: [number, string][]}) {
  let x = 0;
  let y = 0;
  let dx = 1
  let dy = 0

  
  const walkToNextSpot = (maxSteps: number) => {
    for (let i = 0; i < maxSteps; i++) {
      let nextX = (x + dx + map.width) % map.width
      let nextY = (y + dy + map.height) % map.height
      while (map.get(nextX, nextY) === ' ') {
        nextX = (nextX + dx + map.width) % map.width
        nextY = (nextY + dy + map.height) % map.height
      }
      if (map.get(nextX, nextY) === '#') return
      x = nextX
      y = nextY
    }
  }

  const turn = (spin: string) => {
    if (spin === 'R') {
      ([dx, dy] = [-dy, dx])
    } else if (spin === 'L') {
      ([dx, dy] = [dy, -dx])
    }
  }

  walkToNextSpot(Infinity)
  directions.forEach(([steps, spin]: [number, string]) => {
    walkToNextSpot(steps)
    turn(spin)
  })

  const dirScore = [2, 0, 0][dx+1] + [3, 0, 1][dy + 1]
  return (y+1) * 1000 + (x+1) * 4 + dirScore
}

type State = {x: number, y: number, dx: number, dy: number, dir: string}

function part2({map, directions}: { map: Array2D<string, string>, directions: [number, string][]}) {

  const step = (state: State): State => {
    const sides = [
      ' AB', 
      ' C ', 
      'DE', 
      'F  '
    ]
  
    let {x, y, dx, dy, dir } = state
    if (map.get(x + dx, y + dy) !== ' ') return { ...state, x: x+dx, y: y+dy }
    const currentSide = sides[Math.floor(y / 50)][Math.floor(x / 50)]
    if (currentSide === 'A' && dx === -1) { // D
      // console.log(state, 'A -> D')
      const x2 = 0
      const y2 = 149 - y % 50
      const dx2 = 1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy, dir })
      return { x: x2, y: y2, dx: dx2, dy, dir }
    }
    if (currentSide === 'A' && dy === -1) { // F
      // console.log(state, 'A -> F')
      const x2 = 0
      const y2 = 150 + x % 50
      const dx2 = 1
      const dy2 = 0
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'B' && dx === 1) { // E
      // console.log(state, 'B -> E')
      const y2 = 149 - y % 50
      const x2 = 99
      const dx2 = -1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy, dir })
      return { x: x2, y: y2, dx: dx2, dy, dir }
    }
    if (currentSide === 'B' && dy === -1) { // F
      // console.log(state, 'B -> F')
      const x2 = x % 50
      const y2 = 199
      // console.log('Jump', state, '->', { x: x2, y: y2, dx, dy, dir })
      return { x: x2, y: y2, dx, dy, dir }
    }
    if (currentSide === 'B' && dy === 1) { // C
      // console.log(state, 'B -> C')
      const x2 = 99
      const y2 = 50 + x % 50
      const dx2 = -1
      const dy2 = 0
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'C' && dx === -1) { // D
      // console.log(state, 'C -> D')
      const x2 = y % 50
      const y2 = 100
      const dx2 = 0
      const dy2 = 1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'C' && dx === 1) { // B
      // console.log(state, 'C -> B')
      const x2 = 100 + y % 50
      const y2 = 49
      const dx2 = 0
      const dy2 = -1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'D' && dx === -1) { // A
      // console.log(state, 'D -> A')
      const x2 = 50
      const y2 = 49 - y % 50
      const dx2 = 1
      const dy2 = 0
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'D' && dy === -1) { // C
      // console.log(state, 'D -> C')
      const x2 = 50
      const y2 = 50 + x % 50
      const dx2 = 1
      const dy2 = 0
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'E' && dx === 1) { // B
      // console.log(state, 'E -> B')
      const x2 = 149
      const y2 = 49 - y % 50
      const dx2 = -1
      const dy2 = 0
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'E' && dy === 1) { // F
      // console.log(state, 'E -> F')
      const x2 = 49
      const y2 = 150 + x % 50
      const dx2 = -1
      const dy2 = 0
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'F' && dx === -1) { // A
      // console.log(state, 'F -> A')
      const x2 = 50 + y % 50
      const y2 = 0
      const dx2 = 0
      const dy2 = 1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'F' && dx === 1) { // E
      // console.log(state, 'F -> E')
      const x2 = 50 + y % 50
      const y2 = 149
      const dx2 = 0
      const dy2 = -1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    if (currentSide === 'F' && dy=== 1) { // B
      // console.log(state, 'F -> B')
      const x2 = 100 + x % 50
      const y2 = 0
      const dx2 = 0
      const dy2 = 1
      // console.log('Jump', state, '->', { x: x2, y: y2, dx: dx2, dy: dy2, dir })
      return { x: x2, y: y2, dx: dx2, dy: dy2, dir }
    }
    throw Error('I can solve this!: ' + JSON.stringify(state))
  }

  const turn = (state: State, spin: string): State => {
    // console.log('Turn', spin, state)
    const {dx, dy, dir} = state
    const DIRS = 'RDLU'
    const dirIndex = DIRS.indexOf(dir)
    if (spin === 'R')
      return {...state, dx: -dy, dy: dx, dir: DIRS[(dirIndex + 1) % DIRS.length] }
    else if (spin === 'L')
      return {...state, dx: dy, dy: -dx, dir: DIRS[(dirIndex + 3) % DIRS.length] }
    return state
  }

  let state: State = { x: 50, y: 0, dx: 1, dy: 0, dir: 'R' }

  directions.forEach(([steps, spin]) => {
    for(let i = 0; i < steps; i++) {
      const nextState = step(state)
      if (map.get(nextState.x, nextState.y) === '#') break
      state = nextState
    }
    state = turn(state, spin)
  })

  const dirScores = { R: 0, D: 1, L: 2, U: 3 }
  const dirScore = [2, 0, 0][state.dx+1] + [3, 0, 1][state.dy + 1]
  return (state.y+1) * 1000 + (state.x+1) * 4 + dirScore
}