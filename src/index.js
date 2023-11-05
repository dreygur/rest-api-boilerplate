import './overloads';
import fs from 'node:fs';
import path from 'node:path';
import conncetMongoDB from './controllers/mongodb';
import App from './app';
import settings from './settings';

(() => {
  // Check for clients directory as it is required by this framework
  const statics = path.resolve(process.cwd(), '..', 'client');
  if (!fs.existsSync(statics)) {
    fs.mkdirSync(statics);
  }

  // Dependencies that requires load
  // before express app
  const deps = [{
    method: conncetMongoDB,
    args: [settings]
  }];

  // Boot Up the server & services
  const app = new App({ deps });
  app.start();
})();