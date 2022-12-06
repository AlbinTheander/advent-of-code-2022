export function day06(data: string) {
  const result1 = getMarkerPos(data, 4);
  const result2 = getMarkerPos(data, 14);

  console.log('The start-of-message marker of length four ends at', result1);
  console.log('The start-of-message marker of length fourteen ends at', result2);
}

function getMarkerPos(data: string, length: number): number {
  let checkSum = [];
  let pos = 0;
  while(checkSum.length < length) {
    const next = data[pos++];
    while(checkSum.includes(next)) checkSum.shift()
    checkSum.push(next)
  }
  return pos;
}