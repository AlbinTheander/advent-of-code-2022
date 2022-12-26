import { PriorityQueue } from "../PriorityQueue"

describe('PriorityQueue', () => {
  test('test 1', () => {
    const numbers = Array(10).fill(0).map((_, i) => i)
    const mixedNumbers = numbers.slice().sort(() => Math.random() - .5)
    const queue = new PriorityQueue<number>((n1, n2) => n1 < n2)
    mixedNumbers.forEach(n => queue.add(n))
    const result = []
    while(!queue.empty) result.push(queue.pop())
    expect(result).toEqual(numbers)
  })
})