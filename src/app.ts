import { envs } from "./config/envs";
import express from "express";
import { MongoDatabase, MysqlDatabase, prisma } from "./data";
import morgan from "morgan";
import cors from "cors";
import { AppRoutes } from "./application/routes";
import { errorHandler } from "./config/errorHandler";

MysqlDatabase.connect(prisma);

class ServerBoostrap {
  public app: express.Application = express();
  private port: number = Number(envs.PORT) || 4000;

  constructor() {
    this.connectionMysql();
    this.middelewares();
    this.app.use("/api", this.routes());
    this.app.use(errorHandler);
    this.listen();
  }

  middelewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(cors());
    
  }

  routes(): express.Router {
    return AppRoutes.routes;
  }

  listen(): void {
    this.app.listen(this.port, (): void => {
      console.log(`Server on port ${this.port}`);
    });
  }

  connectionMongo(): void {
    MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });
  }

  connectionMysql(): void {}
}

new ServerBoostrap();
