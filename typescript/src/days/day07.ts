import { sum } from "./utils";

type Directory = [string, number] // name, size

export function day07(data: string) {
  const dirs = buildDirectoryList(data);
  const result1 = part1(dirs);
  const result2 = part2(dirs)

  console.log('The total size of the "small" directories is', result1);
  console.log('The smallest directory that would free up enough space is', result2);
}

function part1(dirs: Directory[]) {
  return dirs.
    map(dir => dir[1]).
    filter(size => size < 100000).
    reduce(sum)
}

function part2(dirs: Directory[]) {
  const spaceLeft = 70000000 - dirs[dirs.length-1][1]
  const spaceToFree = 30000000 - spaceLeft

  const relevantDirs =  dirs.
    map(dir => dir[1]).
    filter(size => size >= spaceToFree)

  return Math.min(...relevantDirs)
}

function buildDirectoryList(log: string): Directory[] {
  const result: Directory[] = [];
  const lines = log.split('\n')
  const stepDownAndReturnSize = (dirName: string): number => {
    let size = 0
    while(lines.length > 0) {
      const [p1, p2, p3] = lines.shift().split(' ');
      switch(p1) {
        case 'dir': /* ignore */ break;
        case '$': 
          {
            if (p2 === 'cd' && p3 === '..') {
              result.push([dirName, size]);
              return size
            } else if (p2 === 'cd') {
              size += stepDownAndReturnSize(p3)
            }
          }
          break;
        default: size += +p1; 
      }
    }
    result.push([dirName, size])
    return size;
  }
  stepDownAndReturnSize('home');
  return result;
}




  // fillSizes(root)
  // console.log(smallDirSum)

  // const spaceLeft = 70000000 - root.size
  // const spaceNeeded = 30000000 - spaceLeft

  // const goodDirs = dirs.filter(dir => dir.size >= spaceNeeded).sort((a, b) => a.size-b.size)
  // console.log(spaceNeeded, goodDirs)