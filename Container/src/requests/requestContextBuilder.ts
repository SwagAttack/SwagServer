import { ErrorMessages, MetadataKeys } from "../constants";
import { InjectionTarget } from "../metadata/injectionTarget";
import { InjectMetadata } from "../metadata/injectMetadata";
import { BindingTypeEnum, InjectionTargetTypeEnum, interfaces } from "../types";
import { ContainerRequest } from "./containerRequest";
import { RequestContext } from "./requestContext";

class RequestContextBuilder implements interfaces.RequestContextBuilder {

    private _targetFactory: interfaces.InjectionTargetFactory;
    private _bindingFactory: (serviceIdentifier: interfaces.ServiceIdentifier) => interfaces.ContainerBinding[];

    public setTargetFactory(factory: interfaces.InjectionTargetFactory): interfaces.RequestContextBuilder {
        this._targetFactory = factory;
        return this;
    }

    public setBindingFactory(
        bindingFactory: (serviceIdentifier: interfaces.ServiceIdentifier) => interfaces.ContainerBinding[],
    ): interfaces.RequestContextBuilder {
        this._bindingFactory = bindingFactory;
        return this;
    }

    public build(
        identifier: interfaces.ServiceIdentifier,
        isMultiInject: boolean,
        container: interfaces.Container,
    ): interfaces.RequestContext {

        if (!this._targetFactory || !this._bindingFactory) {
            throw new Error("Target or binding factory missing in RequestContextBuilder");
        }

        const context = new RequestContext(container);
        const rootTarget = this._buildRootTarget(identifier, isMultiInject);

        try {
            this._buildChildRequests(context, undefined, rootTarget);
        } catch (error) {

            // Circular dependency - max stack size reached
            // TODO: Need detailed error msg describing where the error happened
            if (error instanceof RangeError) {
                const errorMsg = ErrorMessages.CircularDependency;
                throw new Error(errorMsg + `: '${identifier.toString()}'`);
            }

            throw error;

        }

        return context;

    }

    private _buildRootTarget(
        identifier: interfaces.ServiceIdentifier,
        isMultiInject: boolean,
    ) {

        const injectMetadataKey = isMultiInject ? MetadataKeys.MultiInject : MetadataKeys.Inject;
        const injectMetadata = new InjectMetadata(injectMetadataKey, identifier);

        const injectionTarget = new InjectionTarget(InjectionTargetTypeEnum.Variable, injectMetadata);
        return injectionTarget;

    }

    private _buildChildRequests(
        context: interfaces.RequestContext,
        parentRequest: interfaces.ContainerRequest | undefined,
        target: interfaces.InjectionTarget,
    ): void {

        const identifier = target.getIdentifier();

        let childRequest: interfaces.ContainerRequest;
        const childBindings: interfaces.ContainerBinding[] = this._getAndValidateBindings(target);

        if (parentRequest === undefined) {

            childRequest = new ContainerRequest(identifier, target, childBindings);
            context.setRootRequest(childRequest);

        } else {

            childRequest = parentRequest.addChild(identifier, target, childBindings);

        }

        childBindings.forEach((binding) => {

            let subChild: interfaces.ContainerRequest;

            if (target.isMultiInject()) {

                subChild = childRequest.addChild(binding.serviceIdentifier, target, [binding]);

            } else {

                if (binding.resolved) {
                    return;
                }

                subChild = childRequest;

            }

            if (binding.bindingType === BindingTypeEnum.Instance && binding.implementation !== undefined) {

                const newTargets = [
                    ... this._targetFactory.getConstructorTargets(binding.implementation),
                    ... this._targetFactory.getPropertyTargets(binding.implementation),
                ];

                newTargets.forEach((newtarget) => {
                    this._buildChildRequests(context, subChild, newtarget);
                });

            }

        });

    }

    private _getAndValidateBindings(
        target: interfaces.InjectionTarget,
    ) {

        const bindings = this._bindingFactory(target.getIdentifier());
        return this._validateBindings(target, bindings);

    }

    private _validateBindings(
        target: interfaces.InjectionTarget,
        bindings: interfaces.ContainerBinding[],
    ) {

        if (bindings.length === 0) {
            throw new Error(ErrorMessages.IdentifierNotFound + `: '${target.getIdentifier().toString()}'`);
        }

        if (!target.isMultiInject() && bindings.length > 1) {
            const errorMsg = ErrorMessages.AmbigiousBindings;
            throw new Error(errorMsg + `: '${target.getIdentifier().toString()}'`);
        }

        return bindings;

    }

}

export { RequestContextBuilder };