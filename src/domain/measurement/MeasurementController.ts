import { Request, Response } from "express";
import { isValidBase64Image } from "../../utils/Base64Manager";
import {
  ConfirmValidation,
  MeasurementValidation,
} from "./MeasurementValidation";
import MeasurementService from "./MeasurementService";
import { MeasurementEntity } from "./MeasurementEntity";
import { v4 as uuidv4 } from "uuid";
import GeminiApiService from "../../infrastructure/geminiAPI/GeminiApiService";

class MeasurementController {
  async upload(request: Request, response: Response): Promise<Response> {
    try {
      const { error, value } = MeasurementValidation.validate(request.body);

      if (!isValidBase64Image(value.image) || error) {
        return response.status(400).send({
          error_code: "INVALID_DATA",
          error_description: error?.details,
        });
      }

      const hasMeasureType = await MeasurementService.hasSomeTypeMeasurements(
        value.customer_code,
        value.measure_datetime,
        value.measure_type
      );

      if (hasMeasureType) {
        return response.status(409).send({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      }

      const uploadResponse = await GeminiApiService.uploadImage(
        value.image,
        "Meter Reading"
      );

      if (!uploadResponse.file.uri) {
        return response.status(500).send({
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: "An unexpected error occurred",
        });
      }

      const gemini = await GeminiApiService.analyzeImage(
        uploadResponse.file.mimeType,
        uploadResponse.file.uri
      );

      if (typeof gemini.value !== "number") {
        return response.status(503).send({
          error_code: "SERVICE_UNAVAILABLE",
          error_description: gemini.error,
        });
      }

      const newMeasure: MeasurementEntity = {
        id: uuidv4(),
        image: uploadResponse.file.uri,
        value: gemini.value,
        customer_id: value.customer_code,
        datetime: value.measure_datetime,
        type: value.measure_type,
        confirmed: false,
      };

      const measure = await MeasurementService.create(newMeasure);

      if (!measure) {
        return response.status(500).send({
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: "An unexpected error occurred",
        });
      }

      return response.status(200).send({
        image_url: measure.image,
        measure_value: gemini.value,
        measure_id: measure.id,
      });
    } catch (error) {
      return response.status(500).send({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "An unexpected error occurred",
      });
    }
  }

  async confirm(request: Request, response: Response): Promise<Response> {
    try {
      const { error, value } = ConfirmValidation.validate(request.body);
      if (error) {
        return response.status(400).send({
          error_code: "INVALID_DATA",
          error_description: error.details,
        });
      }

      const measure = await MeasurementService.confirm(
        value.measure_uuid,
        value.confirmed_value
      );

      if (!measure) {
        const existingMeasure = await MeasurementService.get(
          value.measure_uuid
        );

        if (!existingMeasure) {
          return response.status(404).send({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura não encontrada",
          });
        } else if (existingMeasure.confirmed) {
          return response.status(409).send({
            error_code: "CONFIRMATION_DUPLICATE",
            error_description: "Leitura do mês já realizada",
          });
        }
      }

      return response.status(200).send({
        success: true,
      });
    } catch (error) {
      return response.status(500).send({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "An unexpected error occurred",
      });
    }
  }

  async list(request: Request, response: Response): Promise<Response> {
    try {
      const customer_code = request.params.customer_code as string;
      const measure_type = request.query.measure_type as string;
      const type =
        measure_type.toLocaleUpperCase() as MeasurementEntity["type"];
      const types: MeasurementEntity["type"][] = ["GAS", "WATER"];

      if (!types.includes(type)) {
        return response.status(400).send({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Tipo de medição não permitida",
        });
      }

      const measureList = await MeasurementService.list(
        customer_code,
        measure_type
      );

      if (!measureList || measureList.measures.length === 0) {
        return response.status(404).send({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        });
      }

      return response.status(200).send({
        measureList,
      });
    } catch (error) {
      return response.status(500).send({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "An unexpected error occurred",
      });
    }
  }
}

export default new MeasurementController();
