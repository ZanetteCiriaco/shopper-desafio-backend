import { Op } from "sequelize";
import { MeasurementEntity } from "./MeasurementEntity";
import MeasurementModel from "./MeasurementModel";

class MeasurementRepository {
  async get(id: string) {
    const measure = await MeasurementModel.findOne({
      where: {
        id,
      },
    });

    return measure;
  }

  async list(customer_code: string) {
    const measures = await MeasurementModel.findAll({
      where: {
        customer_id: customer_code,
      },
    });

    return measures;
  }

  async listWithParams(customer_code: string, type: string) {
    const measures = await MeasurementModel.findAll({
      where: {
        customer_id: customer_code,
        type,
      },
    });

    return measures;
  }

  async create(data: MeasurementEntity): Promise<MeasurementModel> {
    const measure = await MeasurementModel.create(data);
    return measure;
  }

  async getAllByMonthAndCustomer(customer_id: string, date: Date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const measure = await MeasurementModel.findAll({
      where: {
        datetime: {
          [Op.between]: [startDate, endDate],
        },
        customer_id: customer_id,
      },
    });
    return measure;
  }

  async updateValue(id: string, newValue: number) {
    const newMeasure = await MeasurementModel.update(
      {
        value: newValue,
        confirmed: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return newMeasure;
  }
}

export default MeasurementRepository;
