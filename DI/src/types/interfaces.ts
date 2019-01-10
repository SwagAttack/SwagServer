import { interfaces as containerTypes } from "container";
import express from "express";

namespace interfaces {

    export type TypeOf<T> = new(...args: any[]) => T;
    export type Func<Arg, Ret> = Arg extends undefined ? () => Ret : (arg: Arg) => Ret;

    export type Container = containerTypes.Container;

    export type HttpMethod = "get" | "post" | "delete" | "put";

    export type Path = string | RegExp;

    export type RequestMiddleware = express.RequestHandler;

    export interface ControllerMetadata {
        basePath: Path;
        middleware: RequestMiddleware[];
        order: number;
    }

    export interface ControllerMethodMetadata {
        method: HttpMethod;
        methodPath: Path;
        property: string;
        middleware: RequestMiddleware[];
    }

    export interface MetadataReader {

        isController(target: TypeOf<any> | Function): boolean;
        getControllerMetadata(target: TypeOf<any> | Function): interfaces.ControllerMetadata;

        /**
         * Keys are properties, values contain metadata for given property
         * @param target Constructor function to fetch metadata from
         */
        getControllerMethodMetadata(target: TypeOf<any> | Function): Map<string, ControllerMethodMetadata>;

    }

    export interface HttpContext {
        container: Container;
        request: express.Request;
        response: express.Response;
    }

    export interface Middleware {
        handle(context: HttpContext): () => void;
    }

    export interface AsyncMiddleware {
        handleAsync(context: HttpContext): () => Promise<void>;
    }

    export type Middlewares = Middleware | AsyncMiddleware;

    export interface Application {
        configureNative(configure: (nativeApp: express.Application) => void): void;
        addMiddleware(path: Path, ... middleware: Middlewares[]): void;
        addMiddleware(... middleware: Middlewares[]): void;
        addControllerModule(controllerModule: string): void;
    }

    export interface ApplicationBuilder {

        configureContainer(container: Container): void;
        configure(application: Application, container: Container): void;

    }

}

export { interfaces };