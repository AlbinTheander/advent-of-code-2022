export function day10(data: string) {
  const cmds = data.split('\n').map(line => line.split(' '));
  const result1 = part1(cmds)
  const result2 = part2(cmds)

  console.log('The sum of the signal strengths is', result1);
  console.log('The CRT shows:\n'+ result2);
}

function part1(cmds: string[][]) {
  let x = 1;
  let cycles = 0;
  let checks = [20, 60, 100, 140, 180, 220];
  let signalStrengthSum = 0;
  for(let [op, dx] of cmds) {
    let nextX = x;
    if (op === 'noop') {
      cycles += 1;
    } else {
      cycles += 2;
      nextX += +dx;
    }
    if (cycles >= checks[0]) {
      signalStrengthSum += (checks[0] * x);
      checks.shift()
    }
    x = nextX;
  }
  return signalStrengthSum;
}

function part2(cmds: string[][]): string {
  const crt = Array(240).fill(' ');
  let x = 1
  let cycle = 1
  const draw = () => {
    const modx = x;
    const column = (cycle - 1) % 40;
    if (column >= modx - 1 && column <= modx + 1) {
      crt[cycle-1] = 	"\u2588"
    }
  }
  for(let [op, dx] of cmds) {
    draw(); cycle++
    if (op === 'addx') {
      draw(); cycle++;
      x += +dx;
    }
  }
  return crt.join('').match(/.{40}/g).join('\n')
}