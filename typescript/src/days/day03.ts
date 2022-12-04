import { sum } from "./utils";

export function day03(data: string) {
  const contents = data.split('\n');
  const result1 = part1(contents);
  const result2 = part2(contents);

  console.log('The total score of the common items in each backpack is', result1);
  console.log('The totoal score of the common items for each group is', result2);
}

function part1(sacks: string[]): number {
  return sacks.
    map(s => [s.slice(0, s.length / 2), s.slice(s.length / 2)]).
    map(([s1, s2]) => commonChars(s1, s2)).
    map(scoreChar).
    reduce(sum)
}

function part2(sacks: string []): number {
  let i = 0;
  let result = 0;
  while (i < sacks.length) {
    const common = commonChars3(sacks[i], sacks[i+1], sacks[i+2])
    result += scoreChar(common)
    i += 3;
  }
  return result
}

function scoreChar(s): number {
  const ch = s[0];
  if (ch >= 'a' && ch <= 'z') return ch.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  return ch.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
}

function commonChars3(s1: string, s2: string, s3: string): string {
  return commonChars(s1, commonChars(s2, s3))
}

function commonChars(s1: string, s2: string): string {
  let result = ''
  for(let ch of s2) {
    if (s1.includes(ch)) result += ch
  }
  return result;
}