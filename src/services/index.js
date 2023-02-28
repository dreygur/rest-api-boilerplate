import user from './user/user';

export const services = (app) => {
  app.configure(user);
};