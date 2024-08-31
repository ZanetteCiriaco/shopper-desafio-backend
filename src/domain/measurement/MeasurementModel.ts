import { DataTypes, Model, Sequelize } from "sequelize";
import { MeasurementEntity } from "./MeasurementEntity";

class MeasurementModel
  extends Model<MeasurementEntity>
  implements MeasurementEntity
{
  id!: string;
  image!: string;
  value!: number;
  customer_id!: string;
  datetime!: Date;
  type!: MeasurementEntity["type"];
  confirmed!: boolean;

  static define(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        customer_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        datetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM("WATER", "GAS"),
          allowNull: false,
        },
        confirmed: {
          type: DataTypes.BOOLEAN,
          defaultValue: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Measurement",
        timestamps: false,
      }
    );
  }

  static associate(models: any): void {
    this.belongsTo(models.CustomersModel, {
      foreignKey: "customer_id",
      as: "customer",
    });
  }
}

export default MeasurementModel;
