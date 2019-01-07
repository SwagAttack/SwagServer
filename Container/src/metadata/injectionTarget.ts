import { MetadataKeys } from "../constants";
import { InjectionTargetTypeEnum, interfaces } from "../types";

class InjectionTarget implements interfaces.InjectionTarget {

    public targetType: InjectionTargetTypeEnum;
    public injectMetadata: interfaces.InjectMetadata;
    public propertyKeyOrIndex?: string | undefined;

    public constructor(
        targetType: InjectionTargetTypeEnum,
        injectMetadata: interfaces.InjectMetadata,
        propertyKeyOrIndex?: string,
    ) {
        this.targetType = targetType;
        this.injectMetadata = injectMetadata;
        this.propertyKeyOrIndex = propertyKeyOrIndex;
    }

    public getIdentifier(): interfaces.ServiceIdentifier {
        return this.injectMetadata.identifier;
    }

    public isMultiInject(): boolean {
        return this.injectMetadata.metadataKey === MetadataKeys.MultiInject;
    }

    public matchesMultiInject(identifier: interfaces.ServiceIdentifier): boolean {

        return this.isMultiInject() && identifier === this.getIdentifier();

    }

}

export { InjectionTarget };