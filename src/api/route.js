import categoryRouter from "./category/category.routes.js";
import subCategoryRouter from "./category/sub-category/sub-category.routes.js";
import userRouter from "./users/users.routes.js";

const apiVersion = '/api/v1';

const mainRoutes = app => {
  //   //for authentication with email, gooogle and identity verification
    app.use(`${apiVersion}/user`, userRouter);
    app.use(`${apiVersion}/category`, categoryRouter);
    app.use(`${apiVersion}/subcategory`, subCategoryRouter);
};

export default mainRoutes;
