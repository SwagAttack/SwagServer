import { interfaces } from "../types";

class Store<Key, Value extends interfaces.Cloneable<Value>> implements interfaces.Store<Key, Value> {

    private _map: Map<Key, Value[]>;

    public constructor() {
        this._map = new Map();
    }

    public add(key: Key, value: Value): void {

        if (this._map.has(key)) {
            this._map.get(key)!.push(value);
        } else {
            this._map.set(key, [value]);
        }

    }

    public get(key: Key): Value[] {

        return this._map.get(key)!;

    }

    public has(key: Key): boolean {

        return this._map.has(key);

    }

    public remove(key: Key): void {

        this._map.delete(key);

    }

    public removeBy(condition: (value: Value, key: Key) => boolean): void {

        this._map.forEach((values, key) => {
            const toKeep = values.filter((value) => !condition(value, key));
            if (toKeep.length) {
                this._map.set(key, toKeep);
            } else {
                this._map.delete(key);
            }
        });

    }

    public apply(iterator: (values: Value[], key: Key) => void): void {
        this._map.forEach(iterator);
    }

    public clone(): interfaces.Store<Key, Value> {

        const clone = new Store<Key, Value>();

        this._map.forEach((values, key) => {
            values.forEach((value) => {
                clone.add(key, value.clone());
            });
        });

        return clone;

    }

    public getMap(): Map<Key, Value[]> {
        return this._map;
    }

}

export { Store };