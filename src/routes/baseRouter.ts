// baseRouter.ts
import express, { Router } from "express";

abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  abstract configureRoutes(): void;

  getRouter(): Router {
    return this.router;
  }
}

export default BaseRouter;
