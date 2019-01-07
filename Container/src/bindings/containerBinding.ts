import { BindingScopeEnum, BindingTypeEnum, interfaces } from "../types";

function generateBindingId(): number {

    const counterStore: any = generateBindingId;
    const counter = (counterStore.id || 0) + 1;
    counterStore.id = counter;
    return counter;

}

class ContainerBinding implements interfaces.ContainerBinding {

    public bindingId: number;
    public serviceIdentifier: interfaces.ServiceIdentifier;

    public bindingType: BindingTypeEnum;

    public bindingScope?: BindingScopeEnum | undefined;
    public implementation?: interfaces.TypeOf<any> | undefined;
    public factoryBuilder?: interfaces.FactoryBuilder<any> | interfaces.AsyncFactoryBuilder<any> | undefined;
    public resolved: boolean = false;
    public cache?: any | undefined;

    public constructor(
        identifier: interfaces.ServiceIdentifier,
    ) {
        this.bindingId = generateBindingId();
        this.serviceIdentifier = identifier;
    }

    public clone(): ContainerBinding {

        // Singleton values are cloned by not setting resolved to true
        // This doesn't go for constant values - these will stay the same
        const clone = new ContainerBinding(this.serviceIdentifier);

        clone.bindingType = this.bindingType;
        clone.resolved = this.bindingType === BindingTypeEnum.ConstantValue ? this.resolved : false;

        clone.cache = this.cache;
        clone.bindingScope = this.bindingScope;
        clone.implementation = this.implementation;
        clone.factoryBuilder = this.factoryBuilder;

        return clone;

    }

}

export { ContainerBinding };