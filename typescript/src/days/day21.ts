type  Monkey = {
  name: string,
  eq: null | { m1: string, m2: string, op: string }
  num: number
  hasHumn: boolean
}
export function day21(data: string) {
  const monkeys = parse(data)
  const result1 = part2(monkeys);
  const result2 = data[1];

  console.log('First result', result1);
  console.log('Second result', result2);
}

function part1(monkeys: Monkey[]) {
  const getMonkey = (n: string) => monkeys.find(m => m.name === n)!
  
  function getMonkeyVal(name: string): number {
    const m = getMonkey(name)
    if (isNaN(m.num)) {
      const left = getMonkeyVal(m.eq.m1)
      const right = getMonkeyVal(m.eq.m2)
      m.num = calc(left, m.eq.op, right)
    }
    return m.num
  }

  return getMonkeyVal('root')
}
function part2(monkeys: Monkey[]) {
  const getMonkey = (n: string) => monkeys.find(m => m.name === n)!

  const fillHasHumn = (name: string): boolean => {
    const m = getMonkey(name)
    if (m.name === 'humn') {
      m.hasHumn = true
    } else if (isNaN(m.num)) {
      const left = fillHasHumn(m.eq.m1)
      const right = fillHasHumn(m.eq.m2)
      m.hasHumn = left || right
    } else {
      m.hasHumn = false
    }
    return m.hasHumn
  }
  
  function getMonkeyVal(name: string): number {
    const m = getMonkey(name)
    if (isNaN(m.num)) {
      const left = getMonkeyVal(m.eq.m1)
      const right = getMonkeyVal(m.eq.m2)
      m.num = calc(left, m.eq.op, right)
    }
    return m.num
  }

  function fillMonkeyNum(name: string, result: number = 0) {
    const m = getMonkey(name)
    console.log('filling', m, result)
    if (name === 'root') {
      const left = getMonkey(m.eq.m1)
      const right = getMonkey(m.eq.m2)
      if (left.hasHumn) {
        return fillMonkeyNum(left.name, getMonkeyVal(right.name))
      } else {
        return fillMonkeyNum(right.name, getMonkeyVal(left.name))
      }
    } else if (name === 'humn') return result;
    else {
      const left = getMonkey(m.eq.m1)
      const right = getMonkey(m.eq.m2)
      if (left.hasHumn) {
        const leftVal = backCalcLeftUnknown(result, m.eq.op, getMonkeyVal(right.name))
        return fillMonkeyNum(left.name, leftVal)
      } else {
        const rightVal = backCalcRightUnknown(result, m.eq.op, getMonkeyVal(left.name))
        return fillMonkeyNum(right.name, rightVal)
      }
    }
  }

  fillHasHumn('root')
  const result = fillMonkeyNum('root')
  return result
}

function backCalcLeftUnknown(result: number, op: string, right: number): number {
  console.log('left', 'x', op, right, '=', result)
  switch(op) {
    case '+': return result - right;
    case '-': return result + right;
    case '*': return result / right;
    case '/': return result * right;
  }
}

function backCalcRightUnknown(result: number, op: string, left: number): number {
  console.log('right', left, op, 'x', '=', result)
  switch(op) {
    case '+': return result - left;
    case '-': return left - result;
    case '*': return result / left;
    case '/': return left / result;
  }
}

function calc(left: number, op: string, right: number) {
  switch(op) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return left / right;
    default: throw Error('Wrong op ' + op)
  }
}

function parse(data: string): Monkey[] {
  return data.split('\n').map(line => {
    const [name, a, b, c] = line.split(' ')
    let num = parseInt(a)
    let eq = isNaN(num) ? {m1: a, op: b, m2: c} : null
    return { name: name.slice(0, -1), eq, num, hasHumn: false}
  })
}