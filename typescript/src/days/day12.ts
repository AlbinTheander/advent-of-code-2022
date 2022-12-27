import { arrayCopy2, to2DArray } from "./utils/utils";

export function day12(data: string) {
  const map = to2DArray(data, '', false)
  const result1 = part1(arrayCopy2(map, undefined));
  const result2 = part2(map);

  console.log('The least number of steps from the start is', result1);
  console.log('The least number of steps from ground level is', result2);
}

function part1(map: string[][]) {
  const goalY = map.findIndex((row) => row.includes('E'))
  const goalX = map[goalY].indexOf('E')
  const startY = map.findIndex((row) => row.includes('S'))
  const startX = map[startY].indexOf('S');

  map[goalY][goalX] = 'z'
  map[startY][startX] = 'a'

  const distanceMap = arrayCopy2(map, Infinity)

  const toSearch = [{ x: startX, y: startY, distance: 0 }];
  while(toSearch.length > 0) {
    const {x, y, distance } = toSearch.shift();
    if (x === goalX && y === goalY) return distance
    if (distanceMap[y][x] <= distance) continue;
    distanceMap[y][x] = distance
    const height = map[y][x].charCodeAt(0)
    if (inside(map, x, y-1) && map[y-1][x].charCodeAt(0) <= height+1) toSearch.push({ x, y: y-1, distance: distance+1 });
    if (inside(map, x+1, y) && map[y][x+1].charCodeAt(0) <= height+1) toSearch.push({ x: x+1, y, distance: distance+1 });
    if (inside(map, x, y+1) && map[y+1][x].charCodeAt(0) <= height+1) toSearch.push({ x, y: y+1, distance: distance+1 });
    if (inside(map, x-1, y) && map[y][x-1].charCodeAt(0) <= height+1) toSearch.push({ x: x-1, y, distance: distance+1 });
  }
  return Infinity;
}

function part2(map: string[][]) {
  const as = [];
  const cleanMap = to2DArray(map.map(row => row.join('')).join('\n').replace('S', 'a'), '', false)
  cleanMap.forEach((row, y) => row.forEach((cell, x) => {
    if (cell === 'a') as.push({ x, y })
  }))

  const distances = as.map(({x, y}) => {
    const nextMap = arrayCopy2(cleanMap, undefined)
    nextMap[y][x] = 'S'
    return part1(nextMap)
  })

  return Math.min(...distances)
}

function inside(a: unknown[][], x: number, y: number): boolean {
  return y >= 0 && y < a.length && x >= 0 && x < a[0].length;
}