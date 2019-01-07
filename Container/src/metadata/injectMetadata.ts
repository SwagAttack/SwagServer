import {interfaces } from "../types";

class InjectMetadata implements interfaces.InjectMetadata {

    public metadataKey: string;
    public value?: any | undefined;
    public identifier: interfaces.ServiceIdentifier;

    public constructor(metadataKey: string, identifier: interfaces.ServiceIdentifier) {
        this.identifier = identifier;
        this.metadataKey = metadataKey;
    }

}

export { InjectMetadata };