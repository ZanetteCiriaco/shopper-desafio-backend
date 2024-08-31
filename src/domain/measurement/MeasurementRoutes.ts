import { Router } from "express";
import MeasurementController from "./MeasurementController";

const MeasurementRoutes = Router();

MeasurementRoutes.post("/upload", MeasurementController.upload);
MeasurementRoutes.patch("/confirm", MeasurementController.confirm);
MeasurementRoutes.get("/:customer_code/list", MeasurementController.list);

export default MeasurementRoutes;
