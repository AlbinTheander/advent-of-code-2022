import { getBuildCombinations } from "../day19"

test('day 19 stuff', () => {
  const costs: Quad[] = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [2, 1, 0, 0],
    [1, 0, 1, 0]
  ]
  const material= [2, 1, 0, 0]
  const combs = getBuildCombinations(costs, material)
  expect(combs).toBe(5)
})