import { CustomersEntity } from "./CustomersEntity";
import CustomersModel from "./CustomersModel";

class CustomersRepository {
  async create(customer: CustomersEntity) {
    return await CustomersModel.create(customer);
  }

  async findCustomer(id: string) {
    return await CustomersModel.findByPk(id);
  }
}

export default new CustomersRepository();
