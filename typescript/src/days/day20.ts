export function day20(data: string) {
  const nums = data.split("\n").map(Number);
  const result1 = part1(nums);
  const result2 = part2(nums);

  console.log("The sum of the grove coordinates is", result1);
  console.log("The decrypted sum of the grove coordinates is", result2);
}

function part1(nums: number[]) {
  const len = nums.length;
  const data = nums.map((n, i) => [n, i]);
  const getNewPos = (pos: number, shift: number) => {
    if (shift >= 0) {
      if (pos + shift < len) return pos + shift;
      let newPos = (pos + shift) % (len - 1);
      return newPos === 0 ? len - 1 : newPos;
    } else {
      if (pos + shift > 0) return pos + shift;
      let newPos = ((pos + shift) % (len - 1)) + len - 1;
      return newPos === 0 ? len - 1 : newPos;
    }
  };

  for (let next = 0; next < data.length; next++) {
    let i = data.findIndex((e) => e[1] === next);
    const entry = data[i];
    let newPos = getNewPos(i, entry[0]);
    if (newPos < i) {
      let j = i;
      while (j > newPos) {
        data[j] = data[j - 1];
        j--;
      }
    } else {
      let j = i;
      while (j < newPos) {
        data[j] = data[j + 1];
        j++;
      }
    }
    data[newPos] = entry;
  }

  const ns = data.map((e) => e[0]);
  const ix0 = ns.indexOf(0);
  const [a, b, c] = [1000, 2000, 3000].map((o) => ns[(ix0 + o) % ns.length]);
  return a + b + c
}

function part2(nums: number[]) {
  const len = nums.length;
  const data = nums.map((n, i) => [n * 811589153, i]);
  const getNewPos = (pos: number, shift: number) => {
    if (shift >= 0) {
      if (pos + shift < len) return pos + shift;
      let newPos = (pos + shift) % (len - 1);
      return newPos === 0 ? len - 1 : newPos;
    } else {
      if (pos + shift > 0) return pos + shift;
      let newPos = ((pos + shift) % (len - 1)) + len - 1;
      return newPos === 0 ? len - 1 : newPos;
    }
  };

  for (let c = 0; c < 10; c++) {
    for (let next = 0; next < data.length; next++) {
      let i = data.findIndex((e) => e[1] === next);
      const entry = data[i];
      let newPos = getNewPos(i, entry[0]);
      if (newPos < i) {
        let j = i;
        while (j > newPos) {
          data[j] = data[j - 1];
          j--;
        }
      } else {
        let j = i;
        while (j < newPos) {
          data[j] = data[j + 1];
          j++;
        }
      }
      data[newPos] = entry;
    }
  }

  const ns = data.map((e) => e[0]);
  const ix0 = ns.indexOf(0);
  const [a, b, c] = [1000, 2000, 3000].map((o) => ns[(ix0 + o) % ns.length]);
  return a + b + c
}
