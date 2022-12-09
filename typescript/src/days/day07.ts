export function day07(data: string) {
  const lines = data.split('\n');
  const result1 = part1(lines);
  const result2 = data[1];

  console.log('First result', result1);
  console.log('Second result', result2);
}


function part1(lines: string[]) {
  const root = { name: 'home', parent: null, dirs: {}, files: {}, size: 0 }
  let current = root;

  for(let line of lines) {
    if (line[0] === '$') {
      const [_ , cmd, dir] = line.split(' ');
      console.log('command', cmd, dir)
      if (cmd === 'cd') {
        if (dir === '/') {
          current = root;
        } else if (dir === '..') {
          current = current.parent
        } else {
          current = current.dirs[dir]
        }
      } // cd
    } else {
      const [size, name] = line.split(' ')
      console.log(size, name, current)
      if (size === 'dir') {
        current.dirs[name] = current.dirs[name] || { name, parent: current, dirs: {}, files: {}, size: 0}
      } else {
        current.files[name] = +size
      }
    }
  }

  let smallDirSum = 0

  const dirs = []

  function fillSizes(dir) {
    Object.keys(dir.dirs).forEach(subdir => {
      fillSizes(dir.dirs[subdir])
      dir.size += dir.dirs[subdir].size
    })
    Object.keys(dir.files).forEach(filename => {
      dir.size += dir.files[filename]
    })
    dirs.push({name: dir.name, size: dir.size })
    if (dir.size <= 100000) smallDirSum += dir.size
    console.log(dir.name, dir.size)
  }

  fillSizes(root)
  console.log(smallDirSum)

  const spaceLeft = 70000000 - root.size
  const spaceNeeded = 30000000 - spaceLeft

  const goodDirs = dirs.filter(dir => dir.size >= spaceNeeded).sort((a, b) => a.size-b.size)
  console.log(spaceNeeded, goodDirs)
}