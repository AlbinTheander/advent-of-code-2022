import { sum } from "./utils";

type Packet = number | Packet[]

export function day13(data: string) {
  const pairs: [Packet, Packet][] = data.split('\n\n').map(p => {
    const [p1, p2] = p.split('\n')
    return [JSON.parse(p1), JSON.parse(p2)]
  })
  const result1 = part1(pairs);
  const result2 = part2(pairs);

  console.log('The sum of correctly ordered package pairs is', result1);
  console.log('The decoder key is', result2);
}

function part1(packets: [Packet, Packet][]) {
  const inOrderIndexes = packets.map(([p1, p2], n) => compare(p1, p2) < 0 ? (n+1) : 0)
  return inOrderIndexes.reduce(sum)
}

function part2(pairs: [Packet, Packet][]) {
  const divider1 = [[2]];
  const divider2 = [[6]];
  const packets = pairs.flat().concat([divider1, divider2]).sort(compare);
  const i1 = packets.indexOf(divider1) + 1
  const i2 = packets.indexOf(divider2) + 1
  return i1 * i2
}

export function compare(p1: Packet, p2: Packet) {
  if (p1 !== undefined && p2 === undefined) return 1
  if (p1 === undefined && p2 !== undefined) return -1
  if (p1 === undefined && p2 === undefined) return 0

  if (Array.isArray(p1) && Array.isArray(p2)) {
    let i = 0;
    let res = 0
    while (i < Math.max(p1.length, p2.length) && res === 0) {
      res = compare(p1[i], p2[i])
      i++
    }
    return res
  }
  if (Array.isArray(p1)) {
    return compare(p1, [p2])
  }
  if (Array.isArray(p2)) {
    return compare([p1], p2)
  }
  return Math.sign(p1 - p2)
}