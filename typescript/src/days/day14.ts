type Pos = { x: number, y: number };
type Rock = Pos[]
type Map = string[][]

export function day14(data: string) {
  const rocks = parse(data)
  const [result1, result2] = parts(rocks);

  console.log('The number of grains that fit on the rocks is', result1);
  console.log('The total number of grains is', result2);
}

function parse(data: string): Rock[] {
  return data.
    split('\n').
    map(line => line.split(' -> ').map(s => s.split(',').map(Number)).map(([x, y]) => ({x, y})))
}

function parts(rocks: Rock[]): [number, number] {
  const map = createMap(rocks);
  let grainX = 500, grainY = 0
  let grainCount = 0
  let grainsOnRocks = 0
  while(map[0][500] !== 'o') {
    while(grainY < map.length && map[grainY][grainX] === '.') grainY++
    if (grainY === map.length) {
      if (!grainsOnRocks) grainsOnRocks = grainCount
      map[grainY-1][grainX] = 'o'
      grainCount++
      grainX = 500
      grainY = 0
    } else if (map[grainY][grainX-1] === '.') { grainX-- }
    else if (map[grainY][grainX+1] === '.') { grainX++ }
    else {
      map[grainY-1][grainX] = 'o'
      grainCount++
      grainX = 500
      grainY = 0
    }

  }
  return [grainsOnRocks, grainCount]
}

function createMap(rocks: Rock[]): Map {
  const xs = rocks.flat().map(p => p.x)
  const ys = rocks.flat().map(p => p.y)
  const maxY = Math.max(...ys)

  const map = Array(maxY+2).fill(null).map(line => Array(1000).fill('.'))

  rocks.forEach(rock => {
    for(let i = 1; i < rock.length; i++) {
      const p1 = rock[i-1]
      const p2 = rock[i]
      const minX = Math.min(p1.x, p2.x)
      const maxX = Math.max(p1.x, p2.x)
      const minY = Math.min(p1.y, p2.y)
      const maxY = Math.max(p1.y, p2.y)
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          map[y][x] = 'S'
        }
      }
    }
  })
  return map
}

function printMap(map: Map) {
  console.log(map.map(line => line.join('')).join('\n'))
}