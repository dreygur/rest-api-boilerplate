import fs from 'fs';
import path from 'path';
import conncetMongoDB from './controllers/mongodb';
import App from './app';
import settings from '../settings.json';

(() => {
  // Check for clients directory as it is required by this framework
  const statics = path.resolve(__dirname, '..', 'client');
  if (!fs.existsSync(statics)) {
    fs.mkdirSync(statics);
  }

  // Connect to MongoDB
  conncetMongoDB(settings)
    .then(function (res) {
      console.log(`=> ${res}!`);

      // Boot Up the server & services
      const app = new App();
      app.start();
    })
    .catch(err => console.log(err));
})();