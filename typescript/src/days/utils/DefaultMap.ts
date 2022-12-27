import { BetterMap } from "./BetterMap";

export class DefaultMap<Key, Value> extends BetterMap<Key, Value> {

  constructor(keyToString: (key: Key) => string, private defaultValue: Value) {
    super(keyToString)
  }

  override get(key: Key): Value {
    const v = super.get(key)
    return v === undefined ? this.defaultValue : v
  }
}