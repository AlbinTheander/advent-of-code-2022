type  Monkey = {
  name: string,
  equation: null | { left: string, right: string, op: string }
  left: Monkey | null
  right: Monkey | null
  num: number
  hasHumn: boolean
}

export function day21(data: string) {
  const root = parse(data)
  const result1 = part1(root);
  const result2 = part2(root)

  console.log('Root yells', result1);
  console.log('I yell', result2);
}

function parse(data: string): Monkey {
  const monkeyList = data.split('\n').map(line => {
    const [name, a, b, c] = line.split(' ')
    let num = parseInt(a)
    let equation = isNaN(num) ? { left: a, op: b, right: c} : null
    return { name: name.slice(0, -1), equation, num, hasHumn: false}
  })

  const getMonkey = (name: string) => monkeyList.find(m => m.name === name)!

  const completeMonkey = (name: string): Monkey => {
    const halfMonkey = getMonkey(name)
    if (isNaN(halfMonkey.num)) {
      const left = completeMonkey(halfMonkey.equation.left)
      const right = completeMonkey(halfMonkey.equation.right)
      const num = calc(left.num, halfMonkey.equation.op, right.num)
      const hasHumn = left.hasHumn || right.hasHumn
      return { ...halfMonkey, left, right, num, hasHumn }
    } else {
      return { ...halfMonkey, left: null, right: null, hasHumn: halfMonkey.name === 'humn'}
    }
  }

  return completeMonkey('root')
}

function part1(root: Monkey) {
  return root.num
}

function part2(root: Monkey) {
  const getHumanVal = ({ name, left, right, equation}: Monkey, result: number): number => {
    if (name === 'humn') return result
    if (left.hasHumn) {
      const leftResult = solveLeftX(result, equation.op, right.num)
      return getHumanVal(left, leftResult)
    }
    const rightResult = solveRightX(result, equation.op, left.num)
    return getHumanVal(right, rightResult)
  }

  return root.left.hasHumn ? 
    getHumanVal(root.left, root.right.num) : 
    getHumanVal(root.right, root.left. num)
}

/** returns the value of x for the equation "X <op> right = result" */
function solveLeftX(result: number, op: string, right: number): number {
  switch(op) {
    case '+': return result - right;
    case '-': return result + right;
    case '*': return result / right;
    case '/': return result * right;
  }
}

/** returns the value of x for the equation "left <op> X = result" */
function solveRightX(result: number, op: string, left: number): number {
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
  }
}
