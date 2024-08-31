import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomersEntity } from "./CustomersEntity";

class CustomersModel extends Model<CustomersEntity> implements CustomersEntity {
  id!: string;

  static define(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Customers",
        timestamps: false,
      }
    );
  }

  static associate(models: any): void {
    this.hasMany(models.MeasurementModel, {
      foreignKey: "customer_id",
      sourceKey: "id",
      as: "measurements",
    });
  }
}

export default CustomersModel;
