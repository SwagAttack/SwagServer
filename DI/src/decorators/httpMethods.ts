import { MetadataKeys } from "../constants/metadataKeys";
import { ControllerMethodMetadata } from "../metadata";
import { interfaces } from "../types";

function _httpMethod(
    method: interfaces.HttpMethod,
    path: interfaces.Path,
    middleware: interfaces.RequestMiddleware[],
) {

    return (target: any, propertyKey: string, descriptor: any) => {

        let metadataMap: Map<string, interfaces.ControllerMethodMetadata>;

        if (Reflect.hasOwnMetadata(MetadataKeys.ControllerMethod, target.constructor)) {
            metadataMap = Reflect.getOwnMetadata(MetadataKeys.ControllerMethod, target.constructor);
        } else {
            metadataMap = new Map();
            Reflect.defineMetadata(MetadataKeys.ControllerMethod, metadataMap, target.constructor);
        }

        if (metadataMap.has(propertyKey)) {

            throw new Error("Can't attach several http-methods to same property");

        } else {

            const metadata = new ControllerMethodMetadata(
                method,
                path,
                propertyKey,
                middleware,
            );

            metadataMap.set(propertyKey, metadata);

        }

    };

}

function httpGet(
    path: interfaces.Path,
    middleware?: interfaces.RequestMiddleware[],
) {
    return _httpMethod("get", path, middleware || []);
}

function httpPost(
    path: interfaces.Path,
    middleware?: interfaces.RequestMiddleware[],
) {
    return _httpMethod("post", path, middleware || []);
}

function httpPut(
    path: interfaces.Path,
    middleware?: interfaces.RequestMiddleware[],
) {
    return _httpMethod("put", path, middleware || []);
}

function httpDelete(
    path: interfaces.Path,
    middleware?: interfaces.RequestMiddleware[],
) {
    return _httpMethod("delete", path, middleware || []);
}

export { httpGet, httpDelete, httpPost, httpPut };