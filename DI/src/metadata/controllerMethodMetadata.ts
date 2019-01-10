import { interfaces } from "../types";

class ControllerMethodMetadata implements interfaces.ControllerMethodMetadata {

    public method: interfaces.HttpMethod;
    public methodPath: interfaces.Path;
    public property: string;
    public middleware: interfaces.RequestMiddleware[];

    public constructor(
        method: interfaces.HttpMethod,
        methodPath: interfaces.Path,
        property: string,
        middleware: interfaces.RequestMiddleware[],
    ) {
        this.method = method;
        this.methodPath = methodPath;
        this.property = property;
        this.middleware = middleware;
    }

}

export { ControllerMethodMetadata };