import { Routes } from "../../domain/routes";
import express, { Express } from "express";
import SequelizeORM from "../sequelizeORM/SequelizeORM";

class Server {
  private readonly app: Express;
  private port = process.env.PORT || 3000;

  constructor() {
    this.app = express();
  }

  init() {
    this.middlewares();
    this.routes();
    this.dbConnection();
    this.startServer();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.use(Routes);
  }

  private dbConnection() {
    SequelizeORM.connect();
  }

  private startServer() {
    this.app.listen(this.port, () => {
      console.log(`Server running ona port ${this.port}`);
    });
  }
}

export default new Server();
