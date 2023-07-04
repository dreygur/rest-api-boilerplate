import fs from 'node:fs';
import path from 'node:path';
import { driverCache } from './driverCache';
const eventsToHandle = ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException', 'SIGUSR2'];

const cachePath = path.join(path.resolve(), '.cache');
if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

export default function gracefullShutdown() {
  //events to handle
  eventsToHandle.forEach(async e => process.on(e, async orgErr => {
    try {
      console.log(orgErr);
      await this.search.save().catch(e => console.log(e));
      driverCache.die();
      return process.exit();
    }
    catch (e) {
      console.log(e);
      return process.exit();
    }
  }));
}