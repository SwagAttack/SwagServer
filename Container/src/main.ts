import "reflect-metadata";

import { inject } from "./decorators/inject";
import { multiInject } from "./decorators/multiInject";

import { Container } from "./container/container";

class Fek {

}

class Dok {

}

// tslint:disable-next-line:max-classes-per-file
class Person {

    @multiInject("fek")
    private fek?: Fek[];

    public constructor(lol: string = "hej", @inject("person") dok: Person) {
        // tslint:disable-next-line:no-console
        console.log(this.fek && dok ? "" : "");
    }

}

const container = new Container();

const LolKey = Symbol.for("lol");

container.register("fek").toSingleton(Fek);
container.register("fek").to(Fek);
container.register("dok").to(Dok);
container.register("person").to(Person);

container.register(LolKey).toAsyncFactory((context) => {
    const p = context.container.get("person");
    return () => {
        return Promise.resolve(p);
    };
})

// This results in an exception being thrown due to circular dependency in person
const lol: () => Promise<Person> = container.get(LolKey);

// tslint:disable-next-line:no-console
lol().then((dope: Person) => {
    console.log(dope);
});