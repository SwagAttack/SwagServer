import { BindingScopeEnum, BindingTypeEnum, interfaces } from "../types";

class ContainerRegistration implements interfaces.ContainerRegistration {

    private _binding: interfaces.ContainerBinding;

    public constructor(binding: interfaces.ContainerBinding) {
        this._binding = binding;
    }

    public to<T>(service: interfaces.TypeOf<T>): void {
        this._toInstance(BindingScopeEnum.RequestScope, service);
    }

    public toTransient<T>(service: interfaces.TypeOf<T>): void {
        this._toInstance(BindingScopeEnum.Transient, service);
    }

    public toSingleton<T>(service: interfaces.TypeOf<T>): void {
        this._toInstance(BindingScopeEnum.Singleton, service);
    }

    public toConstant<T extends any>(obj: T): void {
        this._binding.bindingType = BindingTypeEnum.ConstantValue;
        this._binding.resolved = true;
        this._binding.cache = obj;
    }

    public toFactory<T>(factoryBuilder: interfaces.FactoryBuilder<T>): void {
        this._toFactory(BindingTypeEnum.Factory, factoryBuilder);
    }

    public toAsyncFactory<T>(factoryBuilder: interfaces.AsyncFactoryBuilder<T>): void {
        this._toFactory(BindingTypeEnum.AsyncFactory, factoryBuilder);
    }

    private _toFactory(factoryType: BindingTypeEnum.AsyncFactory | BindingTypeEnum.Factory, builder: any) {
        this._binding.bindingType = factoryType;
        this._binding.factoryBuilder = builder;
    }

    private _toInstance(bindingScope: BindingScopeEnum, service: interfaces.TypeOf<any>) {
        this._binding.bindingType = BindingTypeEnum.Instance;
        this._binding.bindingScope = bindingScope;
        this._binding.implementation = service;
    }

}

export { ContainerRegistration };