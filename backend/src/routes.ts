import express from "express";
import multer from "multer";

import configMulter from "./config/multer";

import PointsController from "./controller/PointsController";
import ItemsController from "./controller/ItemsController";

const routes = express.Router();
const upload = multer(configMulter);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get("/items", itemsController.index);

routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);

routes.post("/point", upload.single("image"), pointsController.create);

export default routes;
