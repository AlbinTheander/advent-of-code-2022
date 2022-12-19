type Valve = {
  id: string,
  flow: number,
  open: boolean,
  paths: string[]
}

export function day16(data: string) {
  const valves = parse(data)
  const result1 = part1(valves);
  const result2 = '2117 (after ~55s with a flawed algorithm)' // part2(valves);

  console.log('The maximum released pressure is', result1);
  console.log('With the elephant, we can release', result2);
}

function parse(data: string) {
  return data.split('\n').map(line => {
    const [id, flow, ...paths] = line.match(/([A-Z]{2})|(\d+)/g)
    return {id, flow: +flow, open: flow === '0', paths }
  });
}

const getValve = (id: string, valves: Valve[]) => valves.find(v => v.id === id) as Valve

function part1(valves: Valve[]) {
  const best = new Map<string, { total: number, path: string[], timeLeft: number }>()
  valves.forEach(v => best.set(v.id, { total: -Infinity, path: [], timeLeft: 0 }))
  const toCheck: {id: string, timeLeft: number, soFar: number, flow: number, path: string[], open: string[]}[] = 
    [{ id: 'AA', timeLeft: 30, soFar: 0, flow: 0, path: [], open: [] }]
  
  let steps = 0
  while (toCheck.length > 0 && steps++ < 10000) {
    const { id, timeLeft, soFar, flow, path, open } = toCheck.shift()
    if (timeLeft === 31) break
    const valve = getValve(id, valves)
    const bestEntry = best.get(id)
    const total = soFar + timeLeft * flow
    if (total <= bestEntry.total) continue;
    best.set(id, { total, path, timeLeft })
    if (valve.flow > 0 && !open.includes(id)) {
      toCheck.push({ id, timeLeft: timeLeft-1, soFar: soFar + flow, flow: flow + valve.flow, path: path.concat('Open ' + id), open: open.concat(id)})
    }
    for (let next of valve.paths) {
      toCheck.push({ id: next, timeLeft: timeLeft-1, soFar: soFar + flow, flow, path: path.concat(id + '->' + next), open})
    }
  }
  let top = [...best].sort((a, b) => b[1].total - a[1].total)
  return top[0][1].total
}

// This does not work for the example for the day,
// It works fine for the actual data, though.
function part2(valves: Valve[]) {
  const best = new Map<string, { total: number, path: string[], timeLeft: number }>()
  const key = (mv, ev) => `${mv}-${ev}`
  const toCheck: { myPos: string, ePos: string, timeLeft: number, soFar: number, flow: number, path: string[], open: string[]}[] = 
    [{ myPos: 'AA', ePos: 'AA', timeLeft: 26, soFar: 0, flow: 0, path: [], open: [] }]
  
  let steps = 0
  while (toCheck.length > 0) {
    let { myPos, ePos, timeLeft, soFar, flow, path, open } = toCheck.shift()
    let saveLength = toCheck.length
    const myValve = getValve(myPos, valves)
    const myBestEntry = best.get(myPos)
    const eValve = getValve(ePos, valves)
    const eBestEntry = best.get(ePos)
    const total = soFar + timeLeft * flow
    const theKey = key(myPos, ePos)
    if (best.has(theKey) && best.get(theKey).total >= total) continue;
    best.set(theKey, { total, path, timeLeft })

    if (myValve.flow > 0 && !open.includes(myPos)) {
      if (eValve.flow > 0 && !open.includes(ePos) && ePos !== myPos) {
        toCheck.push({ 
          myPos, 
          ePos, 
          timeLeft: timeLeft-1, 
          soFar: soFar + flow, 
          flow: flow + myValve.flow + eValve.flow,
          path: path.concat(`I open ${myPos}, E open ${ePos}`), 
          open: open.concat([myPos, ePos])})
      }
      for (let eNext of eValve.paths) {
        toCheck.push({ 
          myPos, 
          ePos: eNext, 
          timeLeft: timeLeft-1, 
          soFar: soFar + flow, 
          flow: flow + myValve.flow,
          path: path.concat(`I open ${myPos}, E ${ePos}->${eNext}`), 
          open: open.concat([myPos])})
      }
    }
    for (let next of myValve.paths) {
      if (eValve.flow > 0 && !open.includes(ePos)) {
        toCheck.push({ 
          myPos: next, 
          ePos, 
          timeLeft: timeLeft-1, 
          soFar: soFar + flow, 
          flow: flow + eValve.flow,
          path: path.concat(`I ${myPos}->${next}, E open ${ePos}`), 
          open: open.concat([ePos])})
      }
      for (let eNext of eValve.paths) {
        toCheck.push({ 
          myPos: next, 
          ePos: eNext, 
          timeLeft: timeLeft-1, 
          soFar: soFar + flow, 
          flow,
          path: path.concat(`I ${myPos}->${next}, E ${ePos}->${eNext}`), 
          open,
        })
      }
    }
  }
  let top = [...best].sort((a, b) => b[1].total - a[1].total)
  return top[0][1].total
}