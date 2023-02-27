import connectMongo from './mongodb';
import * as  operations from './mongodb/operations';

export { operations };

export default function initRepositories() {
  return new Promise(function (resolve, reject) {
    connectMongo().then(res => {
      console.log(`=> ${res}!`);
      resolve();
    })
      .catch(err => { reject(err); });
  });
}