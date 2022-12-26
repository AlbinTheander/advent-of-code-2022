export class PriorityQueue<ItemType> {
  
  public items: ItemType[] = []

  constructor(private inPrioOrder: (t1: ItemType, t2: ItemType) => boolean) {}

  get size() { return this.items.length }
  get empty() { return this.items.length === 0}

  private swap(i1: number, i2: number) {
    const items = this.items
    const tmp = items[i1]
    items[i1] = items[i2]
    items[i2] = tmp
  }

  private inOrder(i1: number, i2: number) {
    return this.inPrioOrder(this.items[i1], this.items[i2])
  }

  private parent(i: number) {
    return (i - 1) >> 1
  }

  private left(i: number) {
    return i*2 + 1
  }

  private right(i: number) {
    return i*2 + 2
  }

  add(item: ItemType) {
    this.items.push(item)
    let pos = this.size - 1
    while (pos > 0) {
      const parent = this.parent(pos)
      if (this.inOrder(parent, pos)) return
      this.swap(parent, pos)
      pos = parent
    }
  }

  peek(): ItemType {
    return this.items[0]
  }

  pop(): ItemType {
    const result = this.items[0]
    if (this.size > 1) this.items[0] = this.items.pop(); else this.items.pop()
    const size = this.size
    let pos = 0
    while (pos < size) {
      const left = this.left(pos)
      const right = this.right(pos)
      let prioPos = pos
      if (left < size && !this.inOrder(pos, left)) {
        prioPos = left
      }
      if (right < size && !this.inOrder(prioPos, right)) {
        prioPos = right
      }
      if (prioPos === pos) break
      this.swap(pos, prioPos)
      pos = prioPos
    }
    return result
  }
}