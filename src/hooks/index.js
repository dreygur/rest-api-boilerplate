import peerserver from './peerserver';

export const hooks = (app) => {
  app.hook(peerserver);
};