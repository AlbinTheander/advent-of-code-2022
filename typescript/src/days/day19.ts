import { sum } from "./utils";

type BluePrint = {
  id: number,
  costs: number[][]
}

export function day19(data: string) {
  const blueprints = parse(data)
  const result1 = 'balab' // part1(blueprints);
  const result2 = part2(blueprints);

  console.log('First result', result1);
  console.log('Second result', result2);
}

const ORE = 0
const CLAY = 1
const OBSIDIAN = 2
const GEODE = 3

function part1(blueprints: BluePrint[]) {
  let result = 0;
  blueprints.forEach(b => {
    const geodes = search(b, 24)
    console.log('result 1', b.id, geodes)
    result += geodes * b.id
  })
  return result
}

function part2(blueprints: BluePrint[]) {
  let result = 1
  blueprints.slice(0, 3).forEach(b => {
    const geodes = search(b, 32)
    console.log('result 2', b.id, geodes)
    result += result * geodes
  })
  return result
}

type State = { robots: number[], material: number[], time: number, didBuild: boolean }

function search(blueprint: BluePrint, minutes: number): number {
  const queue = [{robots: [1, 0, 0, 0], material: [0, 0, 0, 0], time: 0, didBuild: false }]
  const bests = Array(minutes+1).fill(queue[0])
  while(queue.length > 0) {
    const state = queue.shift()
    if (state.material[GEODE] < bests[state.time].material[GEODE]-1) continue;
    if (state.material[GEODE] > bests[state.time].material[GEODE]) bests[state.time] = state
    if (state.time === minutes) continue
    if (canBuild(GEODE, state, blueprint)) {
      queue.push(getStateAfterBuild(GEODE, state, blueprint))
      continue;
    }
    queue.push(getStateAfterWait(state));
    [OBSIDIAN, CLAY, ORE].forEach(mineral => {
      if (shouldBuild(mineral, state, blueprint)) {
        queue.push(getStateAfterBuild(mineral, state, blueprint))
      } 
    })
  }
  return bests[minutes].material[GEODE]
}

function getStateAfterWait(oldState: State): State {
  const {robots} = oldState
  const material = oldState.material.map((m, n) => m + oldState.robots[n])
  const time = oldState.time + 1
  return { robots, material, time, didBuild: false }

}

function getStateAfterBuild(robot: number, oldState: State, blueprint: BluePrint): State {
  const robots = oldState.robots.slice()
  robots[robot]++
  const material = oldState.material.map((m, n) => m + oldState.robots[n] - blueprint.costs[robot][n])
  return { robots, material, time: oldState.time+1, didBuild: true }
}

function shouldBuild(robot: number, state: State, blueprint: BluePrint) {
  const possible = canBuild(robot, state, blueprint)
  if (!possible) return false

  const maxNeeded = Math.max(...blueprint.costs.map(c => c[robot]))
  if (state.robots[robot] >= maxNeeded) return false

  // if (state.material[robot] >= maxNeeded * 3) return false

  if (state.didBuild) return true
  
  const prevMaterial = state.material.map((m, i) => m - state.robots[i])
  if (canBuild(robot, {...state, material: prevMaterial }, blueprint)) return false

  return true
}

function canBuild(robot: number, state: State, blueprint: BluePrint) {
  const possible = blueprint.costs[robot].every((c, i) => c <= state.material[i])
  // if (!possible) { console.log(state.time, 'Could not build', robot, state) }
  return possible
}

export function getBuildCombinations(costs: number[][], material: number[]) {
  let combinations = []
  
  function walk(robotIx: number, materialLeft: number[]): number[][] {
    if (robotIx === 4) return [[0, 0, 0, 0]]
    const result = walk(robotIx+1, materialLeft)
    if (costs[robotIx].every((c, j) => c <= materialLeft[j])) {
      const mAfterBuild: number[] = [materialLeft[0] - costs[robotIx][0], materialLeft[1] - costs[robotIx][1], materialLeft[2] - costs[robotIx][2], materialLeft[3] - costs[robotIx][3]]
      const deeper = walk(robotIx+1, mAfterBuild).map((d: number[]) => { d[robotIx]++; return d })
      return result.concat(deeper)
    }
    return result
  }

  return walk(0, material)
}


function parse(data: string): BluePrint[] {
  return data.split('\n').map(line => {
    const [id, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian] = line.match(/\d+/g).map(Number)
    return {
      id,
      costs: [
        [ oreOre, 0, 0, 0],
        [ clayOre, 0, 0, 0],
        [ obsidianOre, obsidianClay, 0, 0],
        [ geodeOre, 0, geodeObsidian, 0]
      ]
    }
  })
}