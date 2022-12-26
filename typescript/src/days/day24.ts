import { arrayCopy2, to2DArray } from "./utils";

const EMPTY = 0
const WALL = 16
const UP = 1
const RIGHT = 2
const DOWN = 4
const LEFT = 8

export function day24(data: string) {
  const map: number[][] = data.split('\n').map(line => [...line].map(ch => {
    switch (ch) {
      case '#': return WALL
      case '^': return UP
      case '>': return RIGHT
      case 'v': return DOWN
      case '<': return LEFT
      default: return 0
    }
  }))
  const result1 = 0 // part1(map);
  const result2 = part2(map);

  console.log('SECOND: ', 1365, 'TOO HIGH')

  console.log('First result', result1);
  console.log('Second result', result2);
}

type State = {
  x: number,
  y: number,
  map: number[][],
  togo: number,
  steps: number,
}

function part1(map: number[][]) {
  const TARGET_X = map[0].length-2
  const TARGET_Y = map.length-1
  const dist = (x, y) => TARGET_X - x + TARGET_Y - y
  const checked = new Set<string>()
  let queue = [{ x: 1, y: 0, map, togo: dist(1, 0), steps: 0 }]
  const addToQueue = (s: State) => {
    const key = s.x + ',' + s.y + ',' + s.steps
    if (checked.has(key)) return
    checked.add(key)
    queue.push(s)
  }
  let turns = 0
  let best = Infinity
  while(queue.length > 0) {
    const state = queue.shift()
    const { x, y, map, togo, steps } = state
    if (togo + steps >= best) continue
    if (togo === 0) {
      if (steps < best) {
        best = steps;
        console.log('New Best', best)
      }
      continue
    }
    const newMap = updateMap(map)
    if (newMap[y+1][x] === EMPTY) {
      addToQueue({x, y: y+1, map: newMap, togo: dist(x, y+1), steps: steps + 1});
    }
    if (newMap[y][x+1] === EMPTY) {
      addToQueue({x: x+1, y, map: newMap, togo: dist(x+1, y), steps: steps + 1});
    }
    if (newMap[y][x] === EMPTY) {
      addToQueue({x, y, map: newMap, togo, steps: steps + 1});
    }
    if (y !== 0 && newMap[y-1][x] === EMPTY) {
      addToQueue({x, y: y-1, map: newMap, togo: dist(x, y-1), steps: steps + 1});
    }
    if (newMap[y][x-1] === EMPTY) {
      addToQueue({x: x-1, y, map: newMap, togo: dist(x, y-1), steps: steps + 1});
    }
    queue.sort((s1, s2) => {
      return (s1.togo - s2.togo) || (s1.steps - s2.steps)
    })
  }
  return best
}

type State2 = {
  x: number,
  y: number,
  map: number[][],
  togo: number,
  steps: number,
  timings: number[]
}

function part2(map: number[][]) {
  const routeLen = map.length-1 + map[0].length- 3
  const TARGET_X = map[0].length-2
  const TARGET_Y = map.length-1
  const dist = (x, y) => TARGET_X - x + TARGET_Y - y
  const checked = new Map<string, number>()
  let queue = [{ x: 1, y: 0, map, togo: routeLen * 3, steps: 0, timings: [] }]
  const addToQueue = (s: State2) => {
    const {x, y, steps, togo} = s
    const key = x + ',' + y + ',' + steps
    const previous = checked.get(key)
    if (previous !== undefined && previous <= togo) return
    if (previous !== undefined) console.log('UPDATING', previous, {...s, map: undefined })
    checked.set(key, togo)
    queue.push(s)
  }
  let turns = 0
  let best = Infinity
  while(queue.length > 0) {
    const state = queue.shift()
    const { x, y, map, togo, steps } = state
    if (togo + steps >= best) continue
    if (togo === 0) {
      if (steps < best) {
        best = steps;
        console.log('New Best', best, {...state, map: undefined })
      }
      continue
    }
    const leg = Math.ceil(togo / routeLen)
    if (leg === 1 || leg === 3) {
      if (x === TARGET_X && y === TARGET_Y) throw Error('Banan')
      let timings = state.timings
      if (timings.length < 3-leg) timings = timings.concat(steps)
      const newMap = updateMap(map)
      if (newMap[y][x+1] === EMPTY) {
        addToQueue({x: x+1, y, map: newMap, togo: togo-1, steps: steps + 1, timings});
      }
      if (newMap[y+1][x] === EMPTY) {
        addToQueue({x, y: y+1, map: newMap, togo: togo-1, steps: steps + 1, timings});
      }
      if (newMap[y][x] === EMPTY) {
        addToQueue({x, y, map: newMap, togo, steps: steps + 1, timings});
      }
      if (newMap[y][x-1] === EMPTY) {
        addToQueue({x: x-1, y, map: newMap, togo: togo+1, steps: steps + 1, timings});
      }
      if (y !== 0 && newMap[y-1][x] === EMPTY) {
        addToQueue({x, y: y-1, map: newMap, togo: togo+1, steps: steps + 1, timings});
      }
    } else {
      if (x === 1 && y === 0) throw Error('Banan2')
      const newMap = updateMap(map)
      let timings = state.timings
      if (timings.length === 0) timings = timings.concat(steps)
      if (newMap[y][x-1] === EMPTY) {
        addToQueue({x: x-1, y, map: newMap, togo: togo-1, steps: steps + 1, timings});
      }
      if (newMap[y-1][x] === EMPTY) {
        addToQueue({x, y: y-1, map: newMap, togo: togo-1, steps: steps + 1, timings});
      }
      if (newMap[y][x] === EMPTY) {
        addToQueue({x, y, map: newMap, togo, steps: steps + 1, timings});
      }
      if (newMap[y][x+1] === EMPTY) {
        addToQueue({x: x+1, y, map: newMap, togo: togo+1, steps: steps + 1, timings});
      }
      if (y !== TARGET_Y && newMap[y+1][x] === EMPTY) {
        addToQueue({x, y: y+1, map: newMap, togo: togo+1, steps: steps + 1, timings});
      }
    }
    queue.sort((s1, s2) => {
      return (s1.togo - s2.togo) || (s1.steps - s2.steps)
    })
  }
  return best}

function upFrom(y: number, map: number[][]) {
  if (y === 1) return map.length - 2
  return y-1
}
function rightFrom(x: number, map: number[][]) {
  if (x === map[0].length-2) return 1
  return x+1
}
function downFrom(y: number, map: number[][]) {
  if (y === map.length-2) return 1
  return y+1
}
function leftFrom(x: number, map: number[][]) {
  if (x === 1) return map[0].length - 2
  return x-1
}

function updateMap(map: number[][]) {
  const newMap = arrayCopy2(map, EMPTY)
  map.forEach((line, y) => line.forEach((n, x) => {
    if (n === WALL) { newMap[y][x] = WALL; return }
    if (n & UP) { newMap[upFrom(y, map)][x] |= UP }
    if (n & RIGHT) {newMap[y][rightFrom(x, map)] |= RIGHT }
    if (n & DOWN) { newMap[downFrom(y, map)][x] |= DOWN }
    if (n & LEFT) { newMap[y][leftFrom(x, map)] |= LEFT };
  }))
  return newMap
}


function printMap(m: number[][], x: number, y: number) {
  const toChar = (x: number): string => {
    const count = [UP, RIGHT, DOWN, LEFT].filter(d => (d & x) !== 0).length
    if (count > 1) return count.toString()
    return { [EMPTY]: '.', [WALL]: '#', [UP]: '^', [RIGHT]: '>', [DOWN]: 'v', [LEFT]: '<', 32: 'E' }[x]
  }
  const old = m[y][x]
  m[y][x] = 32
  console.log(m.map(l => l.map(toChar).join('')).join('\n'))
  m[y][x] = old
}