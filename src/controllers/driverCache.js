import path from 'node:path';
import fs from 'node:fs';

class DriverCache {
  constructor() {
    this.cachePath = path.join(path.resolve(), 'cache');
    this.cacheFileName = 'drivers.json';
    this.fullPath = path.join(this.cachePath, this.cacheFileName);
  }
  born() {
    if (!fs.existsSync(this.fullPath)) fs.writeFileSync(this.fullPath, '{}', 'utf-8');
    global.drivers = {};
  }
  get(id) {
    return id ? global.drivers[id] : global.drivers;
  }
  add(id, value) {
    global.drivers[id] = value;
  }
  remove(id) {
    delete global.drivers[id];
  }
  die() {
    fs.writeFileSync(this.fullPath, JSON.stringify(global.drivers || {}), 'utf-8');
  }
}
const driverCache = new DriverCache();
export { driverCache };

export default DriverCache;