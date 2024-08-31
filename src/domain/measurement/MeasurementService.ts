import { CustomersEntity } from "../customers/CustomersEntity";
import CustomersService from "../customers/CustomersService";
import {
  ListMeasurementResponse,
  MeasurementEntity,
  MeasurementResponse,
} from "./MeasurementEntity";
import MeasurementRepository from "./MeasurementRepository";

class MeasurementService {
  private repository: MeasurementRepository;

  constructor() {
    this.repository = new MeasurementRepository();
  }

  async list(
    customer_id: string,
    type?: string
  ): Promise<ListMeasurementResponse> {
    let list: MeasurementResponse[] = [];

    if (type) {
      const originalList = await this.repository.listWithParams(
        customer_id,
        type
      );
      list = originalList.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.datetime,
        measure_type: measure.type,
        has_confirmed: measure.confirmed,
        image_url: measure.image,
      }));
    } else {
      const originalList = await this.repository.list(customer_id);
      list = originalList.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.datetime,
        measure_type: measure.type,
        has_confirmed: measure.confirmed,
        image_url: measure.image,
      }));
    }

    return {
      customer_code: customer_id,
      measures: list,
    };
  }

  async get(id: string) {
    return await this.repository.get(id);
  }

  async confirm(id: string, newValue: number) {
    const measure = await this.repository.get(id);

    if (!measure || measure.confirmed) {
      return null;
    }

    return await this.repository.updateValue(id, newValue);
  }

  async create(data: MeasurementEntity) {
    const { customer_id, datetime, type } = data;

    const customer: CustomersEntity = {
      id: customer_id,
    };

    const hasSomeTypeMeasure = await this.hasSomeTypeMeasurements(
      customer_id,
      datetime,
      type
    );

    if (hasSomeTypeMeasure) {
      return null;
    }

    if (await this.createCustomerIfNoHave(customer_id, customer)) {
      return await this.repository.create(data);
    }

    return null;
  }

  private async createCustomerIfNoHave(
    customer_id: string,
    customer: CustomersEntity
  ) {
    if (!(await CustomersService.findCustomer(customer_id))) {
      const response = await CustomersService.create(customer);

      if (response) return true;
      return false;
    }

    return true;
  }

  private async hasSomeTypeMeasurements(
    customer_id: string,
    date: Date,
    type: string
  ) {
    const measures = await this.repository.getAllByMonthAndCustomer(
      customer_id,
      date
    );

    return measures.some((measure) => measure.type === type);
  }
}

export default new MeasurementService();
