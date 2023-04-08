import { connect, set } from 'mongoose';

export default function () {
  return new Promise(function (resolve, reject) {
    // Set mongoose properties
    set('strictQuery', true);

    // Connect
    // eslint-disable-next-line
    connect(process.env.MONGODB_URL, {
      keepAlive: true,
      loggerLevel: 'debug'
    }, function (err) {
      if (err) { reject(err); }
      resolve('Connected to MongoDB');
    });
  });
}