import { interfaces } from "../types";
import { isUndefined, isValidIdentifier, isValidIterator } from "../util/validation";
import { Store } from "./store";

const enum ErrorMessages {
    InvalidIdentifier = "Can't add invalid identifier to Container",
    InvalidBinding = "Binding can't be undefined",
    InvalidIterator = "Can't apply invalid iterator to Container",
    IdentifierNotFound = "Identifier wasn't found",
}

class BindingStore extends Store<interfaces.ServiceIdentifier, interfaces.ContainerBinding>
    implements interfaces.BindingStore {

        public add(identifier: interfaces.ServiceIdentifier, binding: interfaces.ContainerBinding) {

            if (!isValidIdentifier(identifier)) {
                throw new Error(ErrorMessages.InvalidIdentifier);
            }

            if (isUndefined(binding)) {
                throw new Error(ErrorMessages.InvalidBinding);
            }

            return super.add(identifier, binding);

        }

        public get(identifier: interfaces.ServiceIdentifier) {

            if (!super.has(identifier)) {
                throw new Error(ErrorMessages.IdentifierNotFound + `: '${identifier.toString()}'`);
            }

            return super.get(identifier);

        }

        public apply(iterator: (values: interfaces.ContainerBinding[], key: interfaces.ServiceIdentifier) => void) {

            if (!isValidIterator(iterator)) {
                throw new Error(ErrorMessages.InvalidIterator);
            }

            return super.apply(iterator);

        }

        public remove(identifier: interfaces.ServiceIdentifier) {

            if (!super.has(identifier)) {
                throw new Error(ErrorMessages.IdentifierNotFound + `: '${identifier.toString()}'`);
            }

            return super.remove(identifier);

        }

        public removeBy(iterator: (value: interfaces.ContainerBinding, key: interfaces.ServiceIdentifier) => boolean) {

            if (!isValidIterator(iterator)) {
                throw new Error(ErrorMessages.InvalidIterator);
            }

            return super.removeBy(iterator);

        }

}

export { BindingStore };