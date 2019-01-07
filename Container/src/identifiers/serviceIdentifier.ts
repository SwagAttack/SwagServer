import { interfaces } from "../types";

class ServiceIdentifier implements interfaces.Serializeable {

    public id: string | symbol;

    public constructor(id: string | symbol) {
        this.id = id;
    }

    public toString(): string {
        return typeof this.id === "symbol" ? this.id.toString() : this.id;
    }

}

export { ServiceIdentifier };