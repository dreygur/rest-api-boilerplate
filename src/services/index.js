import demo from './demo/demo';
import user from './user/user';

export const services = (app) => {
  app.configure(demo);
  app.configure(user);
};
