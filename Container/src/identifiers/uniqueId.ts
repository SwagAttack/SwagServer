function uniqueId(): number {

    const _uniqueId: any = uniqueId;
    return _uniqueId.__id === undefined ? (_uniqueId.__id = 0) : ++_uniqueId.__id;

}

export { uniqueId };