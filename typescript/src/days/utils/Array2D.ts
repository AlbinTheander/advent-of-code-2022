export class Array2D<Value, OutsideValue=undefined> {
  readonly width: number
  readonly height: number

  constructor(public data: Value[][], private defaultValue: OutsideValue = undefined) {
    this.height = data.length
    this.width = data[0].length
  }

  set(x: number, y: number, value: Value) {
    this.data[y][x] = value
  }

  get(x: number, y: number): Value | OutsideValue {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return this.defaultValue
    return this.data[y][x]
  }

  toString() {
    return this.data.map(line => line.join('')).join('\n')
  }
}

export const toChar2D = <OutsideValue>(data: string, defaultValue: OutsideValue): Array2D<string, OutsideValue> =>
  new Array2D(data.split('\n').map(line => line.split('')), defaultValue)

export const toNum2D = <OutsideValue>(data: string, defaultValue: OutsideValue): Array2D<number, OutsideValue> =>
  new Array2D(data.split('\n').map(line => line.split('').map(Number)), defaultValue)