import { Key } from "readline"

export class BetterMap<Key, Value> {
  private values = new Map<string, Value>()
  private keys = new Map<string, Key>()
  
  constructor(private keyToString: (k: Key) => string) {}

  public set(key: Key, value: Value) {
    const s = this.keyToString(key)
    this.values.set(s, value)
    this.keys.set(s, key)
  }

  public get(key: Key): Value | undefined {
    return this.values.get(this.keyToString(key))
  }

  public has(key: Key): boolean {
    return this.keys.has(this.keyToString(key))
  }
}