import { PriorityQueue } from "./PriorityQueue";
import { sum } from "./utils";

type BluePrint = {
  id: number,
  costs: number[][]
}

export function day19(data: string) {
  const blueprints = parse(data)
  const result1 = part1(blueprints);
  console.log('First result', result1);
  const result2 = part2(blueprints);
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
    result += geodes * b.id
  })
  return result
}

function part2(blueprints: BluePrint[]) {
  let result = 1
  blueprints.slice(0, 3).forEach(b => {
    const geodes = search(b, 32)
    console.log('result 2', b.id, geodes)
    result *= geodes
  })
  return result
}

type State = { robots: number[], material: number[], time: number, didBuild: boolean }

function search(blueprint: BluePrint, minutes: number): number {
  const score = (s: State) => s.time * 10000 + s.material[3]
  const queue = new PriorityQueue<State>((s1, s2) => score(s1) <= score(s2))
  queue.add({robots: [1, 0, 0, 0], material: [0, 0, 0, 0], time: 0, didBuild: false })
  const bests = Array(minutes+1).fill(queue.items[0])
  while(!queue.empty) {
    const state = queue.pop()
    if (state.material[GEODE] < bests[state.time].material[GEODE]-1) continue;
    if (state.material[GEODE] > bests[state.time].material[GEODE]) bests[state.time] = state
    if (state.time === minutes) continue

    // 1. If we can build a geode machine, do it and nothing else.
    if (canBuild(GEODE, state, blueprint)) {
      queue.add(getStateAfterBuild(GEODE, state, blueprint))
      continue;
    }
    let possibleBuilds = 0;
    // Check for each material if it's relevant to build them
    [OBSIDIAN, CLAY, ORE].forEach(mineral => {
      if (shouldBuild(mineral, state, blueprint)) {
        const stateAfterBuild = getStateAfterBuild(mineral, state, blueprint)
        queue.add(stateAfterBuild)
        possibleBuilds++
      }
    })
    // if 2 or more robots can be built, don't consider waiting (because we 
    // probably have enough material already). Questionable, but seem to work
    if (possibleBuilds < 2) queue.add(getStateAfterWait(state));
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
  // Check if it's possible to build
  const possible = canBuild(robot, state, blueprint)
  if (!possible) return false

  // If we produce the amount of material that is needed for any robot, don't
  // build more factories.
  const maxNeeded = Math.max(...blueprint.costs.map(c => c[robot]))
  if (state.robots[robot] >= maxNeeded) return false

  // If didn't wait last time, it's okay to build
  if (state.didBuild) return true
  
  // Otherwise, if waited last time and we _could_ build then, don't
  // build now
  const prevMaterial = state.material.map((m, i) => m - state.robots[i])
  if (canBuild(robot, {...state, material: prevMaterial }, blueprint)) return false

  // Otherwise, we're good to go
  return true
}

function canBuild(robot: number, state: State, blueprint: BluePrint) {
  const possible = blueprint.costs[robot].every((c, i) => c <= state.material[i])
  return possible
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