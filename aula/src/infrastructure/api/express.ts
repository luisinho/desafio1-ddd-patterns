import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { productRoute } from "./routes/product.route";
import { customerRoute } from "./routes/customer.route";
import ProductModel from "../product/repository/sequilize/product.model";
import CustomerModel from "../customer/repository/sequilize/customer.model";

export const app: Express = express();
app.use(express.json());
app.use(productRoute);
app.use('/customer', customerRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    await sequelize.addModels([CustomerModel, ProductModel]);
    await sequelize.sync();
  }
  setupDb();