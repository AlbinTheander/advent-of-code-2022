import { sum } from "./utils/utils";

export function day25(data: string) {
  const nums = data.split('\n')
  // console.log(4890, toSnafu(4890))
  const result1 = part1(nums);
  const result2 = data[1];

  console.log('First result', result1);
  console.log('Second result', result2);
}


function part1(num5: string[]) {
  const ns = num5.map(n5 => {
    const DIGITS = '=-012'
    let result = 0
    let base = 1
    for(let i = n5.length-1; i >= 0; i--) {
      const dig = DIGITS.indexOf(n5[i]) - 2
      result += base * dig
      base *= 5
    }
    return result
  })
  for(let i = 0; i < num5.length; i++) console.log(num5[i], ns[i])
  const all = ns.reduce(sum)
  console.log('Sum', all)
  console.log('Snafusum', toSnafu(all))
}

function fromSnafu(s: string): number {
  const DIGITS = '=-012'
  let result = 0
  let base = 1
  for(let i = s.length-1; i >= 0; i--) {
    const dig = DIGITS.indexOf(s[i]) - 2
    result += base * dig
    base *= 5
  }
  return result
}

function toSnafu(n: number, base = 1, min = -2, max = 2): [string, number] {
  if (n === 0) return ['0', 0]
  const [prefix, rest] = (n < min || n > max) ? toSnafu(n, base*5, min-10*base, max+10*base) : ['', n]
  const digit = Math.floor((rest - min) / base)
  const d = '=-012'[digit] || ' <' + digit + '> '
  return [prefix + d, rest - (digit -2)*base]
}