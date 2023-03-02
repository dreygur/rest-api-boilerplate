import demo from './demo/demo';

export const services = (app) => {
  app.configure(demo);
  app.register('mytest', demo);
};