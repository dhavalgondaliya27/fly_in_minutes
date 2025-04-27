import categoryRouter from "./category/category.routes.js";
import userRouter from "./users/users.routes.js";

const apiVersion = '/api/v1';

const mainRoutes = app => {
  //   //for authentication with email, gooogle and identity verification
    app.use(apiVersion, userRouter);
    app.use(apiVersion, categoryRouter);
};

export default mainRoutes;
