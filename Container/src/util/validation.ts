function isValidIdentifier(identifier: any) {
    return (
        typeof identifier === "symbol" ||
        typeof identifier === "string"
    ) && !isUndefined(identifier);
}

function isValidIterator(iterator: any) {
    return !isUndefined(iterator) && typeof iterator === "function";
}

function isUndefined(target: any) {
    return target === undefined;
}

export { isValidIdentifier, isValidIterator, isUndefined };