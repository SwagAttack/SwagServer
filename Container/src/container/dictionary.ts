type KeyIndexer<Key> = (key: Key) => any;

const enum ErrorKeys {
    UndefinedKey = "Key can't be undefined",
    UndefinedValue = "Value can't be undefined",
    KeyNotFound = "Key wasn't found in the dictionary",
}

class Dictionary<Key, Value> {

    private _keyIndexer: KeyIndexer<Key>;
    private _keyMap: Map<any, Key>;
    private _map: Map<Key, Value>;

    public constructor(keyIndexer?: KeyIndexer<Key>) {

        this._keyIndexer = keyIndexer || ((key) => key) as KeyIndexer<Key>;
        this._map = new Map();
        this._keyMap = new Map();

    }

    public set(key: Key, value: Value): void {

        this._checkForUndefined("value", value);

        const lookUpKey = this._keyIndexer(key);
        this._checkForUndefined("key", lookUpKey);

        this._keyMap.set(lookUpKey, key);
        this._map.set(key, value);

    }

    public get(key: Key): Value {

        const lookUpKey = this._keyIndexer(key);

        if (!this._keyMap.has(lookUpKey)) {
            throw new Error(ErrorKeys.KeyNotFound);
        }

        return this._map.get(this._keyMap.get(lookUpKey)!)!;

    }

    public has(key: Key): boolean {
        return this._keyMap.has(this._keyIndexer(key));
    }

    public remove(key: Key): void {

        const lookUpKey = this._keyIndexer(key);
        const tempKey = this._keyMap.get(lookUpKey);

        if (!this._keyMap.delete(lookUpKey)) {
            throw new Error(ErrorKeys.KeyNotFound);
        }

        this._map.delete(tempKey!);

    }

    public forEach(iterator: (value: Value, key: Key) => void) {
        this._map.forEach(iterator);
    }

    public setKeyIndexer(indexer: KeyIndexer<Key>) {

        this._checkForUndefined("Indexer can't be undefined", indexer);
        this._keyIndexer = indexer;

    }

    public getMap(): Map<Key, Value> {
        return this._map;
    }

    private _checkForUndefined(type: "key" | "value" | string, keyOrValue: any) {

        if (keyOrValue === undefined) {

            const msg = type === "key" ?
                ErrorKeys.UndefinedKey : type === "value" ?
                ErrorKeys.UndefinedValue : type;

            throw new Error(msg);

        }

    }

}

export { Dictionary, KeyIndexer };