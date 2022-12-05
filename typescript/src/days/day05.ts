type Move = {
  count: number,
  from: number,
  to: number
}

export function day05(data: string) {
  const [stacksData, moveData] = data.split('\n\n');
  const stacks = buildStacks(stacksData)
  const moves = moveData.split('\n').map(line => {
    const [count, from, to] = line.match(/\d+/g).map(Number);
    return { count, from, to }
  })

  const result1 = part1(stacks, moves);
  const result2 = part2(stacks, moves);

  console.log('The top crates with crane 1 spells', result1);
  console.log('The top crates with crane 2 spells', result2);
}

function buildStacks(stacksData: string): string[][] {
  const ps = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(p => p*4 + 1)
  const stacks = ps.map(() => []);

  const lines = stacksData.split('\n')
  lines.pop();
  lines.forEach(line => {
    ps.forEach((p, n) => {
      const ch = line[p];
      if (ch !== ' ') stacks[n].unshift(ch) 
    })
  })
  stacks.unshift([]);
  return stacks
}

function getMessage(stacks: string[][]): string {
  return stacks.map(s => s.slice(-1)[0]).join('');
}

function part1(originalStacks: string[][], moves: Move[]): string {
  const stacks = originalStacks.map(s => s.slice());
  for(let {count: n, from, to} of moves) {
    const temp =[]
    for(let i = 0; i < n; i++) {
      stacks[to].push(stacks[from].pop());
    }
  }
  return getMessage(stacks);
}

function part2(originalStacks: string[][], moves: Move[]): string {
  const stacks = originalStacks.map(s => s.slice());
  for(let {count: n, from, to} of moves) {
    const temp =[]
    for(let i = 0; i < n; i++) {
      temp.push(stacks[from].pop())
    }
    for(let i = 0; i < n; i++) {
      stacks[to].push(temp.pop())
    }
  }
  return getMessage(stacks);
}