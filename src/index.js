import fs from 'fs';
import path from 'path';
import conncetMongoDB from './controllers/mongodb';
import App from './app';
import settings from '../settings.json';
import './utils/dateOverride';

(() => {
  // Check for clients directory as it is required by this framework
  const statics = path.resolve(__dirname, '..', 'client');
  if (!fs.existsSync(statics)) {
    fs.mkdirSync(statics);
  }

  const deps = [{
    method: conncetMongoDB,
    args: [settings]
  }];

  // Boot Up the server & services
  const app = new App({ deps });
  app.start();
})();