enum ErrorMessages {

    InvalidIdentifier = "Can't add invalid identifier to Container",
    InvalidBinding = "Binding can't be undefined",
    InvalidIterator = "Can't apply invalid iterator to Container",

    IdentifierNotFound = "Identifier wasn't found",

    InvalidInjectTarget = "Inject decorators can only be applied to constructor parameters or class properties",
    TargetAlreadyDecorated = "A class property or constructor parameter can only be decorated once",

    CircularDependency = "A circular dependency was detected resolving identifier",
    AmbigiousBindings = "Ambigious bindings can't be resolved. " +
         "A single binding was requested for identifier but several were found",

    MissingBindingRegistration = "Missing binding registration for identifier",

}

export { ErrorMessages };