import { ContainerBinding } from "../bindings/containerBinding";
import { ContainerRegistration } from "../bindings/containerRegistration";
import { InjectionTargetFactory } from "../metadata/injectionTargetFactory";
import { RequestContextBuilder } from "../requests/requestContextBuilder";
import { RequestContextResolver } from "../requests/requestContextResolver";
import { interfaces } from "../types";
import { BindingStore } from "./bindingStore";

class Container implements interfaces.Container {

    private static _getBindings(
        identifier: interfaces.ServiceIdentifier,
        container: Container,
    ): interfaces.ContainerBinding[] {

        if (container._bindingStore.has(identifier)) {
            return container._bindingStore.get(identifier);
        } else if (container.parent !== undefined) {
            return Container._getBindings(identifier, container.parent);
        }

        return [];

    }

    public parent?: Container | undefined;

    private _bindingStore: interfaces.Store<interfaces.ServiceIdentifier, interfaces.ContainerBinding>;

    private _targetFactory: interfaces.InjectionTargetFactory;

    private _contextBuilder: interfaces.RequestContextBuilder;
    private _contextResolver: interfaces.RequestContextResolver;

    public constructor() {

        this._bindingStore = new BindingStore();
        this._targetFactory = new InjectionTargetFactory();

        this._contextBuilder = new RequestContextBuilder()
            .setBindingFactory(this._bindingFactory())
            .setTargetFactory(this._targetFactory);

        this._contextResolver = new RequestContextResolver();

    }

    public get<T>(identifier: interfaces.ServiceIdentifier): T {
        return this._buildAndResolveRequest(identifier, false);
    }

    public getMany<T>(identifier: interfaces.ServiceIdentifier): T[] {
        return this._buildAndResolveRequest(identifier, true);
    }

    public resolve<T>(service: interfaces.TypeOf<T>): T {

        const tempContainer = this.createChildContainer();
        tempContainer.register(service.name).to(service);
        return tempContainer.get(service.name);

    }

    public register(identifier: interfaces.ServiceIdentifier): interfaces.ContainerRegistration {

        const binding = new ContainerBinding(identifier);
        this._bindingStore.add(identifier, binding);
        return new ContainerRegistration(binding);

    }

    public unRegister(identifier: interfaces.ServiceIdentifier): void {
        this._bindingStore.remove(identifier);
    }

    public reRegister(identifier: interfaces.ServiceIdentifier): void {

        const oldBindings = this._bindingStore.get(identifier);
        this._bindingStore.remove(identifier);
        oldBindings.forEach((binding) => this._bindingStore.add(identifier, binding.clone()));

    }

    public reRegisterAll(): void {
        const clonedStore = this._bindingStore.clone();
        this._bindingStore = clonedStore;
    }

    public createChildContainer(): interfaces.Container {

        const child = new Container();
        child.parent = this;
        return child;

    }

    private _buildAndResolveRequest<T>(
        identifier: interfaces.ServiceIdentifier,
        isMultiinject: boolean,
    ) {

        const context = this._contextBuilder.build(identifier, isMultiinject, this);
        const result = this._contextResolver.resolve<T>(context);

        return result;

    }

    private _bindingFactory() {
        return (identifier: interfaces.ServiceIdentifier) => Container._getBindings(identifier, this);
    }

}

export { Container };