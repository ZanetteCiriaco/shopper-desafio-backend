import CustomersRepository from "./CustomersRepository";
import { CustomersEntity } from "./CustomersEntity";

class CustomerService {
  async create(customer: CustomersEntity) {
    return await CustomersRepository.create(customer);
  }

  async findCustomer(id: string) {
    return await CustomersRepository.findCustomer(id);
  }
}

export default new CustomerService();
