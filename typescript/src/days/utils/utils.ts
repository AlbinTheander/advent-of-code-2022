export const sum = (a: number, b: number): number => a + b;
export const prod = (a: number, b: number): number => a * b;

export function to2DArray(lines: string, deliminator: string, convertToNumber: true): number[][]
export function to2DArray(lines: string, deliminator: string, convertToNumber: false): string[][]
export function to2DArray(lines: string, deliminator = '', convertToNumber = false): string[][] | number[][] {
  const content = lines.
    split('\n').
    map(line => line.split(deliminator))

  if (convertToNumber) {
    return content.map(line => line.map(item => +item))
  }
  return content
}

export function arrayCopy2<Item>(data: Item[][], fillWith: undefined): Item[][]
export function arrayCopy2<Item>(data: unknown[][], fillWith: Item): Item[][]
export function arrayCopy2(data, fillWith = undefined) {
  const newData = data.map(row => row.map(item => fillWith === undefined ? item : fillWith));
  return newData
}

export const column = <B>(array2D: B[][], col: number): B[] => {
  return array2D.map(row => row[col]);
}
  