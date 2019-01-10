import { MetadataKeys } from "../constants/metadataKeys";
import { ControllerMetadata } from "../metadata";
import { interfaces } from "../types";

function controller(
    basePath: interfaces.Path,
    middleware?: interfaces.RequestMiddleware[],
    order?: number,
) {

    return (target: interfaces.TypeOf<any>) => {

        if (Reflect.hasOwnMetadata(MetadataKeys.Controller, target)) {

            throw new Error("Can't attach controller decorator several times to the same class");

        } else {

            const metadata = new ControllerMetadata(
                basePath,
                middleware || [],
                order === undefined ? Infinity : order);

            Reflect.defineMetadata(MetadataKeys.Controller, metadata, target);

        }

    };

}

export { controller };