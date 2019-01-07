import { interfaces, InjectionTargetTypeEnum, BindingTypeEnum, BindingScopeEnum } from "../types";
import { identifierToString } from "../utils/functions";

class RequestContextResolver implements interfaces.RequestContextResolver {

    public resolve<T>(context: interfaces.RequestContext): T {
        return this._resolve(context.getRootRequest(), context);
    }

    private _resolve<T>(
        request: interfaces.ContainerRequest,
        context: interfaces.RequestContext,
    ) {

        const requestScope = context.requestScope;

        const bindings = request.containerBindings;
        const childRequests = request.children;

        const isMultiInject = request.injectionTarget.isMultiInject();
        const parentIsNotMultiInject = request.parent === undefined ||
                                 !request.parent.injectionTarget.matchesMultiInject(request.serviceIdentifier);

        // Current request is entry point to a multi-injection
        if (isMultiInject && parentIsNotMultiInject) {

            const result: T[] = childRequests.map((req) => {
                return this._resolve(req, context) as T;
            })

            return result;

        }

        const binding = bindings[0];

        switch (binding.bindingType) {

            case BindingTypeEnum.ConstantValue: {
                return binding.cache;
            }

            // TODO: More describtive error messages when factoryBuilder fails
            case BindingTypeEnum.AsyncFactory:
            case BindingTypeEnum.Factory: {
                const factoryBuilder = binding.factoryBuilder!;
                const factory = factoryBuilder(context);
                return factory;
            }

            case BindingTypeEnum.Instance: {

                const isSingleton = binding.bindingScope === BindingScopeEnum.Singleton;
                const isRequestSingleton = binding.bindingScope === BindingScopeEnum.RequestScope;

                if (isSingleton && binding.resolved) {
                    return binding.cache;
                } else if (isRequestSingleton && requestScope.has(binding.bindingId)) {
                    return requestScope.get(binding.bindingId);
                }

                const service = this._constructInstance<T>(binding.implementation!, childRequests, context);

                if (isSingleton) {
                    binding.cache = service;
                    binding.resolved = true;
                }
    
                if (isRequestSingleton) {
                    requestScope.set(binding.bindingId, service);
                }
    
                return service;

            }

            default: 
                throw new Error(`Missing binding registration for identifier '${identifierToString(binding.serviceIdentifier)}'`);

        }
        
    }

    private _constructInstance<T>(
        constructor: interfaces.TypeOf<T>,
        childRequests: interfaces.ContainerRequest[],
        context: interfaces.RequestContext,
    ) {

        const constructorParamRequests = childRequests.filter((req) => {
            return req.injectionTarget.targetType === InjectionTargetTypeEnum.ConstructorParameter;
        });

        const constructorInjections: any = [];
        constructorInjections.length = constructor.length;

        constructorParamRequests.forEach((req) => {
            constructorInjections[req.injectionTarget.propertyKeyOrIndex!] = this._resolve(req, context);
        });

        const service = new constructor(...constructorInjections);
        this._injectProperties(service, childRequests, context);

        return service;

    }

    private _injectProperties(
        service: any,
        childRequests: interfaces.ContainerRequest[],
        context: interfaces.RequestContext,
    ) {

        const propertyRequests = childRequests.filter((req) => {
            return req.injectionTarget.targetType === InjectionTargetTypeEnum.ClassProperty;
        });

        propertyRequests.forEach((req) => {

            const property = req.injectionTarget.propertyKeyOrIndex!;
            service[property] = this._resolve(req, context);

        });

    }

}

export { RequestContextResolver };