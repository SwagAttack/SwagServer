import "reflect-metadata";

import { Container } from "container";
import express from "express";
import path from "path";
import { controller } from "./decorators/controller";
import { httpGet, httpPost } from "./decorators/httpMethods";
import { MetadataReader } from "./metadata";
import { enableControllers } from "./middlewares/mvc/enableControllers";
import { interfaces } from "./types";

const container = new Container();
const metadataReader: interfaces.MetadataReader = new MetadataReader();
const app = express();
const controllerPath = path.join(process.cwd(), "bin", "controllers");

enableControllers(container, controllerPath, app, metadataReader).then(() => {

    app.listen(3000);

}).catch(() => process.exit(1));