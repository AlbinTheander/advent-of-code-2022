type Drop = [number, number, number]

export function day18(data: string) {
  const drops = data.split('\n').map(line => line.split(',').map(Number)).reduce((m: DropMap, d: Drop) => m.add(d), new DropMap())

  const result1 = part1(drops);
  const result2 = part2(drops);

  console.log('The number of open surfaces is', result1);
  console.log('The number or outside surfaces is', result2);
}

function part1(drops: DropMap) {
  let count = 0
  drops.array.forEach(([x, y, z]) => {
    if (!drops.has([x-1, y, z])) count++
    if (!drops.has([x+1, y, z])) count++
    if (!drops.has([x, y-1, z])) count++
    if (!drops.has([x, y+1, z])) count++
    if (!drops.has([x, y, z-1])) count++
    if (!drops.has([x, y, z+1])) count++
  })
  return count
}

function part2(drops: DropMap) {
  const min = Math.min(...drops.array.flat()) - 1
  const max = Math.max(...drops.array.flat()) + 1

  // Fill in the air in the cube containing the drops
  // by flood-filling from a corner
  const toCheck: Drop[] = [[min, min, min]]
  while (toCheck.length > 0) {
    const d = toCheck.pop()
    if (!drops.has(d)) {
      drops.addAir(d)
      const [x, y, z] = d
      if (x > min) toCheck.push([x-1, y, z])
      if (x < max) toCheck.push([x+1, y, z])
      if (y > min) toCheck.push([x, y-1, z])
      if (y < max) toCheck.push([x, y+1, z])
      if (z > min) toCheck.push([x, y, z-1])
      if (z < max) toCheck.push([x, y, z+1])
    }
  }

  // Now, count all sides in contact with air
  let count = 0
  drops.array.forEach(([x, y, z]) => {
    if (drops.hasAir([x-1, y, z])) count++
    if (drops.hasAir([x+1, y, z])) count++
    if (drops.hasAir([x, y-1, z])) count++
    if (drops.hasAir([x, y+1, z])) count++
    if (drops.hasAir([x, y, z-1])) count++
    if (drops.hasAir([x, y, z+1])) count++
  })

  return count
}

class DropMap {
  private data = new Map<string, Drop | 'A'>
  public array: Drop[] = []

  private key(drop: Drop) { return drop.toString() }

  add(drop: Drop): DropMap {
    this.array.push(drop)
    this.data.set(this.key(drop), drop)
    return this
  }

  addAir(drop: Drop): DropMap {
    this.data.set(this.key(drop), 'A')
    return this
  }

  has(drop: Drop): boolean {
    return this.data.has(this.key(drop))
  }

  hasAir(drop: Drop): boolean {
    return this.data.get(this.key(drop)) === 'A'
  }
}
