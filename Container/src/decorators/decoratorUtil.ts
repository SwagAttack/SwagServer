import { MetadataKeys } from "../constants";
import { interfaces } from "../types";

function _decorateParamOrProperty(
    paramOrPropertyMetadataKey: string,
    annotationTarget: any,
    metadata: interfaces.InjectMetadata,
    propertyName?: string,
    index?: number,
) {

    const targetIsConstructorParam = typeof index === "number" && index !== undefined;
    const metadataIndex = targetIsConstructorParam ? index!.toString() : propertyName!;

    // Target is a function but not a constructor
    if (targetIsConstructorParam && propertyName !== undefined) {
        throw new Error();
    }

    let oldMetadataMap: interfaces.MetadataMap;

    if (Reflect.hasOwnMetadata(paramOrPropertyMetadataKey, annotationTarget)) {
        oldMetadataMap = Reflect.getOwnMetadata(paramOrPropertyMetadataKey, annotationTarget);
    } else {
        oldMetadataMap = new Map();
    }

    // Target has already been decorated
    if (oldMetadataMap.has(metadataIndex)) {
        throw new Error();
    } else {
        oldMetadataMap.set(metadataIndex, metadata);
    }

    Reflect.defineMetadata(paramOrPropertyMetadataKey, oldMetadataMap, annotationTarget);

}

function decorateConstructorParameter(
    annotationTarget: any,
    propertyName: string,
    index: number,
    metadata: interfaces.InjectMetadata,
) {
    const key = MetadataKeys.ConstructorParam;
    return _decorateParamOrProperty(key, annotationTarget, metadata, propertyName, index);
}

function decorateClassProperty(
    annotationTarget: any,
    propertyName: string,
    metadata: interfaces.InjectMetadata,
) {
    const key = MetadataKeys.ClassProperty;
    return _decorateParamOrProperty(key, annotationTarget.constructor, metadata, propertyName);
}

export { decorateClassProperty, decorateConstructorParameter };