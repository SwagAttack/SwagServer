export const enum InjectionTargetTypeEnum {
    ConstructorParameter,
    ClassProperty,
    Variable,
}

export const enum BindingTypeEnum {
    Instance,
    ConstantValue,
    Factory,
    AsyncFactory,
}

export const enum BindingScopeEnum {
    RequestScope,
    Transient,
    Singleton,
}

export namespace interfaces {

    export type TypeOf<T> = new(...args: any[]) => T;

    export interface Cloneable<T> {
        clone(): T;
    }

    export type ServiceIdentifier = string | symbol;
    export type UniqueIdentifier = number;

    export interface InjectMetadata {
        identifier: ServiceIdentifier;
        metadataKey: string;
        value?: any;
    }

    export type MetadataMap = Map<string, InjectMetadata>;

    export interface InjectionTarget {

        targetType: InjectionTargetTypeEnum;
        injectMetadata: InjectMetadata;
        propertyKeyOrIndex?: string;

        getIdentifier(): ServiceIdentifier;

        isMultiInject(): boolean;
        matchesMultiInject(identifier: ServiceIdentifier): boolean;

    }

    export interface InjectionTargetFactory {

        getConstructorTargets(service: TypeOf<any>): InjectionTarget[];
        getPropertyTargets(service: TypeOf<any>): InjectionTarget[];

    }

    export type Factory<T> = (...args: any[]) => ((...args: any[]) => T) | T;
    export type FactoryBuilder<T> = (context: RequestContext) => Factory<T>;

    export type AsyncFactory<T> = (...args: any[]) => ((...args: any[]) => Promise<T>) | Promise<T>;
    export type AsyncFactoryBuilder<T> = (context: RequestContext) => AsyncFactory<T>;

    export interface ContainerBinding extends Cloneable<ContainerBinding> {

        /**
         * Unique identifier for the binding
         */
        bindingId: UniqueIdentifier;

        /**
         * Identifier for the service to which the binding refers
         */
        serviceIdentifier: ServiceIdentifier;

        /**
         * The type of binding
         * Can be either an instance-type or a constant
         */
        bindingType: BindingTypeEnum;

        /**
         * If binding type is instance-type this will tell the scope of the binding
         */
        bindingScope?: BindingScopeEnum;

        /**
         * Constructor for instance types
         */
        implementation?: TypeOf<any>;

        /**
         * Factory builder for factory types
         */
        factoryBuilder?: FactoryBuilder<any> | AsyncFactoryBuilder<any>;

        /**
         * Cache for singletons and constant values
         */
        cache?: any;

        /**
         * For singleton instances - this specifies whether the binding has been resolved
         */
        resolved: boolean;

    }

    /**
     * Cloneable Store that attaches keys to arrays of cloneable items
     */
    export interface Store<Key, Value extends Cloneable<Value>> extends Cloneable<Store<Key, Value>> {
        add(key: Key, value: Value): void;
        get(key: Key): Value[];
        has(key: Key): boolean;
        remove(key: Key): void;
        removeBy(condition: (value: Value, key: Key) => boolean): void;
        apply(iterator: (values: Value[], key: Key) => void): void;
        getMap(): Map<Key, Value[]>;
    }

    export type BindingStore = Store<ServiceIdentifier, ContainerBinding>;

    export interface ContainerRequest {

        serviceIdentifier: ServiceIdentifier;

        parent?: ContainerRequest;
        children: ContainerRequest[];

        injectionTarget: InjectionTarget;
        containerBindings: ContainerBinding[];

        addChild(
            identifier: ServiceIdentifier,
            target: InjectionTarget,
            bindings: ContainerBinding[],
        ): ContainerRequest;

    }

    export interface RequestContext {

        requestScope: Map<any, any>;
        container: Container;

        setRootRequest(request: ContainerRequest): void;
        getRootRequest(): ContainerRequest;

    }

    export interface RequestContextBuilder {

        setTargetFactory(targetFactory: InjectionTargetFactory): RequestContextBuilder;
        setBindingFactory(
            bindingFactory: (serviceIdentifier: ServiceIdentifier) => ContainerBinding[],
        ): RequestContextBuilder;

        build(
            identifier: ServiceIdentifier,
            isMultiInject: boolean,
            container: interfaces.Container,
        ): RequestContext;
    }

    export interface RequestContextResolver {
        resolve<T>(context: RequestContext): T;
    }

    export interface Container {
        parent?: Container;
        register(identifier: ServiceIdentifier): ContainerRegistration;
        unRegister(identifier: ServiceIdentifier): void;
        reRegister(identifier: ServiceIdentifier): void;
        reRegisterAll(): void;
        get<T>(identifier: ServiceIdentifier): T;
        getMany<T>(identifier: ServiceIdentifier): T[];
        resolve<T>(service: TypeOf<T>): T;
        createChildContainer(): Container;
    }

    export interface ContainerRegistration {

        /**
         * Registers the service as a request singleton (request scope)
         */
        to<T>(service: TypeOf<T>): void;
        toTransient<T>(service: TypeOf<T>): void;
        toSingleton<T>(service: TypeOf<T>): void;
        toConstant<T>(obj: T): void;
        toFactory<T>(factoryBuilder: FactoryBuilder<T>): void;
        toAsyncFactory<T>(factoryBuilder: AsyncFactoryBuilder<T>): void;

    }

}