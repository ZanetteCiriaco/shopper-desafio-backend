import Joi from "joi";
import {
  ConfirmMeasurementBody,
  UploadMeasurementBody,
} from "./MeasurementEntity";

export const MeasurementValidation = Joi.object<UploadMeasurementBody>({
  image: Joi.string().required(),
  customer_code: Joi.string().uuid().required(),
  measure_datetime: Joi.date().iso().required(),
  measure_type: Joi.string().valid("WATER", "GAS").required(),
});

export const ConfirmValidation = Joi.object<ConfirmMeasurementBody>({
  measure_uuid: Joi.string().uuid().required(),
  confirmed_value: Joi.number().required(),
});
