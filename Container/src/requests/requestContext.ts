import { interfaces } from "../types";

class RequestContext implements interfaces.RequestContext {
    
    public requestScope: Map<any, any>;
    public container: interfaces.Container;

    private _rootRequest?: interfaces.ContainerRequest = undefined;

    public constructor(container: interfaces.Container, rootRequest?: interfaces.ContainerRequest) {

        this._rootRequest = rootRequest;

        this.requestScope = new Map();
        this.container = container;

    }

    public setRootRequest(rootRequest: interfaces.ContainerRequest): void {
        this._rootRequest = rootRequest;
    }

    public getRootRequest(): interfaces.ContainerRequest {
        return this._rootRequest!;
    }

}

export { RequestContext };