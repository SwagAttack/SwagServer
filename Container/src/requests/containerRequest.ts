import { interfaces } from "../types";

class ContainerRequest implements interfaces.ContainerRequest {

    public serviceIdentifier: interfaces.ServiceIdentifier;    

    public parent?: interfaces.ContainerRequest;
    public children: interfaces.ContainerRequest[];

    public injectionTarget: interfaces.InjectionTarget;
    public containerBindings: interfaces.ContainerBinding[];

    public constructor(
        identifier: interfaces.ServiceIdentifier,
        target: interfaces.InjectionTarget,
        bindings: interfaces.ContainerBinding[],
        parent?: interfaces.ContainerRequest,
    ) {
        this.serviceIdentifier = identifier;
        this.injectionTarget = target;
        this.containerBindings = bindings;
        this.parent = parent;
        this.children = [];
    }

    public addChild(
        identifier: interfaces.ServiceIdentifier,
        target: interfaces.InjectionTarget,
        bindings: interfaces.ContainerBinding[]
    ): interfaces.ContainerRequest {
        
        const child = new ContainerRequest(identifier, target, bindings, this);
        this.children.push(child);
        return child;

    }

}

export { ContainerRequest };