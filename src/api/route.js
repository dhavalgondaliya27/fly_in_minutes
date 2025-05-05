import categoryRouter from "./category/category.routes.js";
import cityRouter from "./destination/city/city.routes.js";
import destinationRouter from "./destination/destination.routes.js";
import userRouter from "./users/users.routes.js";

const apiVersion = '/api/v1';

const mainRoutes = app => {
  //   //for authentication with email, gooogle and identity verification
    app.use(`${apiVersion}/user`, userRouter);
    app.use(`${apiVersion}/category`, categoryRouter);
    app.use(`${apiVersion}/destination`, destinationRouter);
    app.use(`${apiVersion}/city`, cityRouter);
};

export default mainRoutes;
