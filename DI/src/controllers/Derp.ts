import express from "express";
import { controller } from "../decorators/controller";
import { httpGet } from "../decorators/httpMethods";

@controller("/swag")
class Derp {

    @httpGet("/asd")
    public async lol(request: express.Request, response: express.Response, next: express.NextFunction) {
        return "hej";
    }

}

// tslint:disable-next-line:max-classes-per-file
@controller("/dope")
class Swerg {

    @httpGet("/asd")
    public lol() {
        return "hej";
    }

}

export { Derp, Swerg };