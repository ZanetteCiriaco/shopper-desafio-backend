import { Model, ModelStatic } from "sequelize";

export class RepositoryImpl<T extends Model<T>> {
  private model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  public async create(item: Partial<T>): Promise<T> {
    return await this.model.create(item as any);
  }
}
