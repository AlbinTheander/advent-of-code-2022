export class Infinite2DSet {
  private pos = new Map<string, [number, number]>()

  get bounds() {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    this.forEach((x, y) => {
      minX = Math.min(x, minX)
      maxX = Math.max(x, maxX)
      minY = Math.min(y, minY)
      maxY = Math.max(y, maxY)
    })

    return [minX, minY, maxX, maxY]
  }

  get size() {
    return this.pos.size
  }

  private toKey(x: number, y: number): string {
    return x + ',' + y
  }

  add(x: number, y: number) {
    const key = this.toKey(x, y)
    this.pos.set(key, [x, y])
  }

  remove(x: number, y: number) {
    const key = this.toKey(x, y)
    this.pos.delete(key)
  }

  has(x: number, y: number): boolean {
    return this.pos.has(this.toKey(x, y))
  }

  forEach(f: (x: number, y: number) => void) {
    this.pos.forEach(([x, y]) => f(x, y))
  }

  toString() {
    const [minX, minY, maxX, maxY] = this.bounds
    const lines = []
    for (let y = minY; y <= maxY; y++) {
      let line = ''
      for (let x = minX; x <= maxX; x++)
        line += (this.has(x, y)) ? '#' : '.'
      lines.push(line)
    }
    return lines.join('\n')
  }
}