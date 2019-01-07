import { MetadataKeys } from "../constants";
import { ServiceIdentifier } from "../identifiers/serviceIdentifier";
import { InjectMetadata } from "../metadata/injectMetadata";
import { interfaces } from "../types";
import { decorateClassProperty, decorateConstructorParameter } from "./decoratorUtil";

function inject(id: interfaces.ServiceId) {

    return (target: any, property: string, index?: number) => {

        const identifier = new ServiceIdentifier(id);
        const metadata = new InjectMetadata(MetadataKeys.Inject, identifier);

        if (typeof index === "number") {
            decorateConstructorParameter(target, property, index, metadata);
        } else {
            decorateClassProperty(target, property, metadata);
        }

    };

}

export { inject };