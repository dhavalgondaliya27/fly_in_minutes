import userRouter from "./users/users.routes.js";

const apiVersion = '/api/v1';

const mainRoutes = app => {
  //   //for authentication with email, gooogle and identity verification
    app.use(apiVersion, userRouter);
};

export default mainRoutes;
