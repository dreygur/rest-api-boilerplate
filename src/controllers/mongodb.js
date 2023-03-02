import { connect, set } from 'mongoose';

// Settings
import settings from '../../../config/settings.json';

export default function () {
  return new Promise(function (resolve, reject) {
    // Set mongoose properties
    set('strictQuery', true);

    // Connect
    // eslint-disable-next-line
    connect(settings.mongodb, {
      keepAlive: true,
      loggerLevel: 'debug'
    }, function (err) {
      if (err) { reject(err); }
      resolve('Connected to MongoDB');
    });
  });
}