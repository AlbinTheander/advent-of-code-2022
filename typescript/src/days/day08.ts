export function day08(data: string) {
  const lines = data.split('\n');
  const map = lines.map(line => Array(line.length).fill('x'));
  const lastRow = lines.length - 1;
  const lastCol = lines[0].length - 1;
  for(let row = 0; row < lines.length; row++) {
    let highest = -Infinity
    for(let col = 0; col <= lastCol; col++) {
      if (+lines[row][col] > highest) {
        map[row][col] = 'v';
        highest = +lines[row][col]
      }
    }
    highest = -Infinity
    for(let col = lastCol; col >= 0; col--) {
      if (+lines[row][col] > highest) {
        map[row][col] = 'v';
        highest = +lines[row][col]
      }
    }
  }
  for(let col = 0; col < lines.length; col++) {
    let highest = -Infinity
    for(let row = 0; row <= lastRow; row++) {
      if (+lines[row][col] > highest) {
        map[row][col] = 'v';
        highest = +lines[row][col]
      }
    }
    highest = -Infinity
    for(let row = lastRow; row >= 0; row--) {
      if (+lines[row][col] > highest) {
        map[row][col] = 'v';
        highest = +lines[row][col]
      }
    }
  }

  const count = map.flat().filter(ch => ch === 'v').length;
  console.log(lines)
  console.log(map)

  const result1 = count;
  const result2 = part2(lines);

  console.log('First result', result1);
  console.log('Second result', result2);
}

function part2(olines: string[]) {
  const map = olines.map(line => Array(line.length).fill(1));
  const trees = olines.map(line => [...line].map(ch => +ch))

  const lastRow = trees.length - 1;
  const lastCol = trees[0].length - 1;

  for(let row = 0; row < trees.length; row++) {
    for(let col = 0; col < trees[0].length; col++) {
      const tree = trees[row][col];
      let r = row-1;
      let c = col;
      let count = 0
      let stop = false
      while(!stop) {
        if (r < 0) { stop = true; break;}
        count++;
        if (trees[r][col] >= tree) stop = true
        r--;
      }
      map[row][col] *= count;

      r = row+1;
      c = col;
      count = 0
      stop = false
      while(!stop) {
        if (r > lastRow) { stop = true; break;}
        count++;
        if (trees[r][col] >= tree) stop = true
        r++;
      }
      map[row][col] *= count;

      r = row;
      c = col-1;
      count = 0
      stop = false
      while(!stop) {
        if (c < 0) { stop = true; break;}
        count++;
        if (trees[row][c] >= tree) stop = true
        c--;
      }
      map[row][col] *= count;

      r = row;
      c = col+1;
      count = 0
      stop = false
      while(!stop) {
        if (c > lastCol) { stop = true; break;}
        count++;
        if (trees[row][c] >= tree) stop = true
        c++;
      }
      map[row][col] *= count;
    }
  }
  console.log(map)
  console.log(Math.max(...map.flat()))
}