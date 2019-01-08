import { MetadataKeys } from "../constants";
import { InjectMetadata } from "../metadata/injectMetadata";
import { interfaces } from "../types";
import { isValidIdentifier } from "../util/validation";
import { decorateClassProperty, decorateConstructorParameter } from "./decoratorUtil";

const enum ErrorMessages {
    InvalidIdentifier = "Can't add invalid identifier to Container",
}

function multiInject(identifier: interfaces.ServiceIdentifier) {

    if (!isValidIdentifier(identifier)) {
        throw new Error(ErrorMessages.InvalidIdentifier);
    }

    return (target: any, property: string, index?: number) => {

        const metadata = new InjectMetadata(MetadataKeys.MultiInject, identifier);

        if (typeof index === "number") {
            decorateConstructorParameter(target, property, index, metadata);
        } else {
            decorateClassProperty(target, property, metadata);
        }

    };

}

export { multiInject };