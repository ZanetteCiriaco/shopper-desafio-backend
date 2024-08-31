export interface MeasurementEntity {
  id: string;
  value: number;
  image: string;
  customer_id: string;
  datetime: Date;
  type: "WATER" | "GAS";
  confirmed: boolean;
}

export interface UploadMeasurementBody {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasurementEntity["type"];
}

export interface ConfirmMeasurementBody {
  measure_uuid: string;
  confirmed_value: number;
}

export interface MeasurementResponse {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
}

export interface ListMeasurementResponse {
  customer_code: string;
  measures: MeasurementResponse[];
}
