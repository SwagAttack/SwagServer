import { MetadataKeys } from "../constants";
import { InjectMetadata } from "../metadata/injectMetadata";
import { interfaces } from "../types";
import { decorateClassProperty, decorateConstructorParameter } from "./decoratorUtil";

function inject(identifier: interfaces.ServiceIdentifier) {

    return (target: any, property: string, index?: number) => {

        const metadata = new InjectMetadata(MetadataKeys.Inject, identifier);

        if (typeof index === "number") {
            decorateConstructorParameter(target, property, index, metadata);
        } else {
            decorateClassProperty(target, property, metadata);
        }

    };

}

export { inject };