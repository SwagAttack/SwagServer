import { MetadataKeys } from "../constants";
import { InjectionTargetTypeEnum, interfaces } from "../types";
import { InjectionTarget } from "./injectionTarget";

class InjectionTargetFactory implements interfaces.InjectionTargetFactory {

    public getPropertyTargets(service: interfaces.TypeOf<any>): interfaces.InjectionTarget[] {

        const metadataKey = MetadataKeys.ClassProperty;
        const propertyTargets = this._buildTargets(metadataKey, InjectionTargetTypeEnum.ClassProperty, service);

        const base = Object.getPrototypeOf(service.prototype).constructor;

        // Check for base-class property targets
        if (base !== Object) {

            const basePropertyTargets = this.getPropertyTargets(base);

            propertyTargets.push( ... basePropertyTargets );

        }

        return propertyTargets;

    }

    public getConstructorTargets(service: interfaces.TypeOf<any>): interfaces.InjectionTarget[] {

        const metadataKey = MetadataKeys.ConstructorParam;
        return this._buildTargets(metadataKey, InjectionTargetTypeEnum.ConstructorParameter, service);

    }

    private _buildTargets(metadataKey: string, targetType: InjectionTargetTypeEnum, service: interfaces.TypeOf<any>) {

        const metadataMap: interfaces.MetadataMap = Reflect.getOwnMetadata(metadataKey, service) || new Map();
        const result: interfaces.InjectionTarget[] = [];

        metadataMap.forEach((metadata, parameterIndex) => {

            const target = new InjectionTarget(targetType, metadata, parameterIndex);
            result.push(target);

        });

        return result;

    }

}

export { InjectionTargetFactory };