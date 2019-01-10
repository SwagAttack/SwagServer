import { interfaces } from "../types";

class ControllerMetadata implements interfaces.ControllerMetadata {

    public basePath: interfaces.Path;
    public middleware: interfaces.RequestMiddleware[];
    public order: number;

    public constructor(
        basePath: interfaces.Path,
        middleware: interfaces.RequestMiddleware[],
        order: number,
    ) {
        this.basePath = basePath;
        this.middleware = middleware;
        this.order = order;
    }

}

export { ControllerMetadata };