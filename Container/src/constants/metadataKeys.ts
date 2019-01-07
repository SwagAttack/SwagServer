export const enum MetadataKeys {

    /**
     * Key describing metadata which holds binding information for a single injection
     */
    Inject = "swagjs:inject",

    /**
     * Key describing metadata which holds binding information for a multi injection
     */
    MultiInject = "swagjs:multiinject",

    /**
     * Key describing constructor parameter metadata
     */
    ConstructorParam = "swagjs:ctr_param",

    /**
     * Key describing class property metadata
     */
    ClassProperty = "swagjs:class_prop",

}