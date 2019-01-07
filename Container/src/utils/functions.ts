import { interfaces } from "../types";

function identifierToString(identifier: interfaces.ServiceIdentifier): string {

    if (typeof identifier === "symbol") {
        return identifier.toString();
    }

    return identifier;

}

export { identifierToString };