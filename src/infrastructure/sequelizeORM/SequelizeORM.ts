import { Sequelize } from "sequelize";
import MeasurementModel from "../../domain/measurement/MeasurementModel";
import CustomersModel from "../../domain/customers/CustomersModel";

class SequelizeORM {
  private sequelize: Sequelize;

  constructor() {
    const db = process.env.DB_NAME || "mydatabase";
    const user = process.env.DB_USER || "myuser";
    const password = process.env.DB_USER || "securepassword";
    const host = process.env.DB_HOST || "db";

    this.sequelize = new Sequelize(db, user, password, {
      host: host,
      dialect: "postgres",
    });
  }

  private setupTables() {
    CustomersModel.define(this.sequelize);
    MeasurementModel.define(this.sequelize);

    CustomersModel.associate({ MeasurementModel });
    MeasurementModel.associate({ CustomersModel });
  }

  public async connect() {
    this.setupTables();

    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: false });
      console.log("Successful connection to the database.");
    } catch (error) {
      console.error("Error connectiong to the database: ", error);
    }
  }
}

export default new SequelizeORM();
