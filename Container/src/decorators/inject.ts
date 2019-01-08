import { ErrorMessages, MetadataKeys } from "../constants";
import { InjectMetadata } from "../metadata/injectMetadata";
import { interfaces } from "../types";
import { isValidIdentifier } from "../util/validation";
import { decorateClassProperty, decorateConstructorParameter } from "./decoratorUtil";

function inject(identifier: interfaces.ServiceIdentifier) {

    if (!isValidIdentifier(identifier)) {
        throw new Error(ErrorMessages.InvalidIdentifier);
    }

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