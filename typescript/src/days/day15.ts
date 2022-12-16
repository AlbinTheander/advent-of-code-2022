type Sensor = {
    x: number
    y: number
    bx: number
    by: number
}

export function day15(data: string) {
  const sensors = data.split('\n').map(line => line.match(/-?\d+/g).map(Number)).map(([x, y, bx, by]) => ({x, y, bx, by}))
  // const result1 = part1(sensors);
  const result2 = part2(sensors);

  console.log('First result', 'result1');
  console.log('Second result', result2);
}

function part1(sensors: Sensor[]) {
    const xs = sensors.flatMap(s => [s.x, s.bx]);
    const row = 2000000
    const segments = sensors.flatMap(({x, y, bx, by}) => {
        const closestDistance = Math.abs(x - bx) + Math.abs(y - by)
        const distanceLeftAtRow = closestDistance - Math.abs(row - y)
        const segment = distanceLeftAtRow >= 0 ? [[x - distanceLeftAtRow, x + distanceLeftAtRow]] : []
        console.log(x, y, bx, by, closestDistance, segment)
        return segment
    })
    const minX = Math.min(...segments.map(s => s[0]))
    const maxX = Math.max(...segments.map(s => s[1]))
    let count = 0
    for (let x = minX; x <= maxX; x++) {
        if (segments.some(([from, to]) => from <= x && x <= to)) count++
    }
    const beaconCount = new Set(sensors.filter(({by}) => by === row).map(({bx, by}) => bx + '-' + by)).size
    console.log(count, beaconCount, count - beaconCount)
}

function part2(sensors: Sensor[]) {
    for (let row = 0; row < 4000000; row++) {
        const segments: [number, number][] = sensors.flatMap(({x, y, bx, by}) => {
            const closestDistance = Math.abs(x - bx) + Math.abs(y - by)
            const distanceLeftAtRow = closestDistance - Math.abs(row - y)
            const result: [number, number][] = distanceLeftAtRow >= 0 ? [[x - distanceLeftAtRow, x + distanceLeftAtRow]] : []
            if (by === row) result.push([bx, bx])
            return result
        })
        const remaining = removeSpans([[0, 4000000]], segments)
        // console.log(row, segments, remaining)
        if (remaining.length === 1) {
            const x = remaining[0][0]
            console.log('Found', x, row, x * 4000000 + row)
            break;
        }
    }
}

export type Span = [number, number]

function removeSpans(spans: Span[], remove: Span[]): Span[] {
    return remove.reduce((s, r) => removeSpan(s, r), spans)
}

function removeSpan(spans: Span[], remove: Span): Span[] {
    return spans.flatMap(s => removeSpanFromSingleSpan(s, remove))
}

export function removeSpanFromSingleSpan(span: Span, remove: Span): Span[] {
    if (remove[1] < span[0]) return [span] // remove is before span
    if (remove[0] > span[1]) return [span] // remove is after span
    const result = []
    if (remove[0] > span[0]) result.push([span[0], remove[0]-1])
    if (remove[1] < span[1]) result.push([remove[1]+1, span[1]]);
    return result;
    
}