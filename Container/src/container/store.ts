import { interfaces } from "../types";
import { Dictionary, KeyIndexer } from "./dictionary";

class Store<Key, Value extends interfaces.Cloneable<Value>> implements interfaces.Store<Key, Value> {

    private _dictionary: Dictionary<Key, Value[]>;

    public constructor(indexer?: KeyIndexer<Key>) {
        this._dictionary = new Dictionary(indexer);
    }

    public add(key: Key, value: Value): void {

        if (this._dictionary.has(key)) {
            this._dictionary.get(key)!.push(value);
        } else {
            this._dictionary.set(key, [value]);
        }

    }

    public get(key: Key): Value[] {

        return this._dictionary.get(key)!;

    }

    public has(key: Key): boolean {

        return this._dictionary.has(key);

    }

    public remove(key: Key): void {

        this._dictionary.remove(key);

    }

    public removeBy(condition: (value: Value, key: Key) => boolean): void {

        this._dictionary.forEach((values, key) => {
            const toKeep = values.filter((value) => !condition(value, key));
            if (toKeep.length) {
                this._dictionary.set(key, toKeep);
            } else {
                this._dictionary.remove(key);
            }
        });

    }

    public apply(iterator: (values: Value[], key: Key) => void): void {
        this._dictionary.forEach(iterator);
    }

    public clone(): interfaces.Store<Key, Value> {

        const clone = new Store<Key, Value>();

        this._dictionary.forEach((values, key) => {
            values.forEach((value) => {
                clone.add(key, value.clone());
            });
        });

        return clone;

    }

    public getMap(): Map<Key, Value[]> {
        return this._dictionary.getMap();
    }

}

export { Store };