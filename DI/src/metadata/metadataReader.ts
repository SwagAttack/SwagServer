import { MetadataKeys } from "../constants/metadataKeys";
import { interfaces } from "../types";

class MetadataReader implements interfaces.MetadataReader {

    public isController(target: interfaces.TypeOf<any> | Function): boolean {
        return Reflect.hasOwnMetadata(MetadataKeys.Controller, target);
    }

    public getControllerMetadata(
        target: interfaces.TypeOf<any> | Function,
    ): interfaces.ControllerMetadata {
        return Reflect.getOwnMetadata(MetadataKeys.Controller, target);
    }

    public getControllerMethodMetadata(
        target: interfaces.TypeOf<any> | Function,
    ): Map<string, interfaces.ControllerMethodMetadata> {
        return Reflect.getOwnMetadata(MetadataKeys.ControllerMethod, target) || new Map();
    }

}

export { MetadataReader };