import { prod } from "./utils/utils";

type Operation = [string, '+'|'*', string]

type Monkey = {
  id: number,
  items: number[],
  operation: Operation,
  divisibleTest: number,
  targetTrue: number,
  targetFalse: number,
  inspections: number
}

type Throw = [string, number]

export function day11(data: string) {
  const monkeys = parse(data);
  const result1 = part1(monkeys);
  const result2 = part2(monkeys);

  console.log('The monkey business level after 20 calm rounds is', result1);
  console.log('The monkey business level after 10000 worrying rounds is', result2);
}

function parse(data): Monkey[] {
  const lines = data.split('\n')
  const monkeys = [];
  while(lines.length > 0) {
    const id = +lines.shift().slice('Monkey '.length, -1)
    const items = lines.shift().slice('  Starting items: '.length).split(', ').map(Number)
    const operation = lines.shift().slice('  Operation: new = '.length).split(' ')
    const divisibleTest = +lines.shift().slice('  Test: divisible by '.length);
    const targetTrue = +lines.shift().slice(-1)
    const targetFalse = +lines.shift().slice(-1)
    lines.shift(); // Empty line between monkeys
    
    monkeys.push({id, items, operation, divisibleTest, targetTrue, targetFalse, inspections: 0})
  }
  return monkeys
}

function part1(monkeys: Monkey[]) {
  const monkeyCopy: Monkey[] = JSON.parse(JSON.stringify(monkeys))
  const update = (weight: number, monkey: Monkey) => Math.floor(performOp(weight, monkey.operation) / 3)
  return runMonkeys(monkeyCopy, 20, update)
}

function part2(monkeys: Monkey[]) {
  const divisor = monkeys.map(m => m.divisibleTest).reduce(prod)
  const update = (weight: number, monkey: Monkey) => performOp(weight, monkey.operation) % divisor
  return runMonkeys(monkeys, 10000, update);
  
}

function runMonkeys(monkeys: Monkey[], rounds: number, updateWeight: (weight: number, monkey: Monkey) => number) {
  for(let i = 0; i < rounds; i++) {
    for (let monkey of monkeys) {
      while(monkey.items.length > 0) {
        monkey.inspections++;
        const item = monkey.items.shift()
        const newItem = updateWeight(item, monkey)
        const target = (newItem % monkey.divisibleTest === 0) ? monkey.targetTrue : monkey.targetFalse;
        monkeys[target].items.push(newItem);
      }
    }
  }
  const inspections = monkeys.map(m => m.inspections).sort((a, b) => b - a)
  return inspections[0] * inspections[1]
}

function performOp(n: number, [param1, op, param2]: Operation) {
  const x = param1 === 'old' ? n : +param1;
  const y = param2 === 'old' ? n : +param2;
  if (op === '+') return x + y
  return x * y
}