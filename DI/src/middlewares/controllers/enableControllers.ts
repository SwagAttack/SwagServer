import express from "express";
import { interfaces } from "../../types";

function controllerHandlerFactory(
    controller: interfaces.TypeOf<any>,
    propertyKey: string,
    container: interfaces.Container,
) {
    return async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        try {

            const controllerInstance = container.resolve(controller);
            const result = await Promise.resolve(controllerInstance[propertyKey](... [request, response, next]));

            if (typeof result === "function") {
                result();
            } else if (!response.headersSent) {
                if (result === undefined) {
                    response.status(204); // No content
                }
                response.send(result);
            }

        } catch (error) {
            next(error);
        }

    };
}

async function enableControllers(
    container: interfaces.Container,
    controllerPath: string,
    application: express.Application,
    metadataReader: interfaces.MetadataReader,
) {

    const controllers: any[] = [];
    let controllerModule: any;

    try {
        controllerModule = await import(controllerPath);
    } catch (error) {
        throw error;
    }

    for (const moduleProperty of Object.keys(controllerModule)) {
        const possibleController = controllerModule[moduleProperty];
        if (metadataReader.isController(possibleController)) {
            controllers.push(possibleController);
        }
    }

    if (controllers.length === 0) {
        throw new Error(`No controllers found at specified path '${controllerPath}'`);
    }

    const getOrder = (controller: any) => metadataReader.getControllerMetadata(controller).order;

    // Sort registration according to order attribute
    // Lower indexes will be handled first in the pipeline and so on
    controllers.sort((a, b) => getOrder(a) - getOrder(b));

    controllers.forEach((controller) => {

        const controllerMetadata = metadataReader.getControllerMetadata(controller);
        const controllerMethodMetadata = metadataReader.getControllerMethodMetadata(controller);

        if (controllerMethodMetadata.size > 0) {

            const baseRouter = express.Router();
            const basePath = controllerMetadata.basePath;
            const baseMiddleware = controllerMetadata.middleware;

            controllerMethodMetadata.forEach((methodMetadata, propertyKey) => {

                const method = methodMetadata.method;
                const path = methodMetadata.methodPath;
                const middleware = methodMetadata.middleware;
                const handler = controllerHandlerFactory(controller, propertyKey, container);

                baseRouter[method](
                    path,
                    ... middleware,
                    handler,
                );

            });

            application.use(
                basePath,
                ... baseMiddleware,
                baseRouter,
            );

        } else {

            throw new Error(`No http-methods specified for controller '${controller.name}'`);

        }

    });

}

export { enableControllers };