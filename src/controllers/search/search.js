import { create as lcreate, insert as linsert, remove as lremove, search as lsearch } from '@orama/orama';
import { persistToFile, restoreFromFile } from '@orama/plugin-data-persistence';
import path from 'path';
import fs from 'fs';
import { schemas } from './schemas';

const eventsToHandle = [];

/**
 * SearchCtrl is a class that encapsulates methods for starting and controlling Lyra search instances,
 * as well as methods for inserting, removing and searching data within those instances.
*/
export default class SearchCtrl {
  constructor() {
    /**
     * This object will store the Lyra search instances for each schema.
     * @type {Object}
    */
    this.instances = {};
    /**
     * The data path where the instances will be persisted.
     * @type {string}
    */
    this.dataPath = path.resolve() + '/search/';
    /**
     * The schemas for the Lyra instances.
     * @type {Object}
    */
    this.schemas = schemas;
  }

  /**
   * restore method that restores the instances from a file if it exists, otherwise it returns false.
   * @param {string} path - The file path where the instance is stored.
   * @return {Promise} - Promise object represents the instance or false.
  */
  async restore(path) {
    try {
      return await restoreFromFile('binary', path);
    }
    catch (e) { return false; }
  }

  /**
   * Saves the instances specified by the `keys` argument to disk
   *
   * @param {Array<string>} [keys=Object.keys(this.schemas)] - The keys of the instances to save
   * @returns {Promise<Array>} - A Promise that resolves to an array of the results of saving each instance to disk
  */
  save(keys = Object.keys(this.schemas)) {
    return Promise.all(keys.map((k, i) => persistToFile(this.instances[k], 'binary', `${this.dataPath + keys[i]}.msp`)));
  }

  /**
   * Starts the search controller and initializes the instances and event handlers
   *
   * 1. The keys of the schemas object are retrieved and stored in the `keys` variable
   * 2. The `instances` object is populated by creating or restoring instances for each key
   * 3. The `save` method is called to save the instances to disk
   * 4. Event handlers for `eventsToHandle` are added to the process, which will save the instances and exit the process upon encountering the specified events
   *
   * @async
  */
  async start() {
    if (!fs.existsSync(this.dataPath)) fs.mkdirSync(this.dataPath);
    const keys = Object.keys(this.schemas);
    await Promise.all(keys.map(async k => (this.instances[k] = (await this.restore(`${this.dataPath + k}.msp`) || await lcreate({ schema: this.schemas[k] })))));
    await this.save(keys);
    eventsToHandle.forEach(async e => process.on(e, async orgErr => {
      console.log(orgErr);
      await this.save();
      return process.exit();
    }));
    console.log('=> Search controller started');
  }

  /**
   * insert method that inserts data into a Lyra search instance.
   * @param {string} key - The key of the Lyra instance to insert data into.
   * @param {Object} value - The data to be inserted.
   * @return {Promise} - Promise object represents the inserted data.
  */
  async insert(key, value) {
    return await linsert(this.instances[key], value);
  }

  /**
   * Removes an instance from the given key using a query
   *
   * @async
   * @param {string} key - The key to remove the instance from
   * @param {Object} query - The query object to search and remove the instance with
   * @param {boolean} query.exact - Flag to indicate whether the search should match exactly or not, defaults to true
   * @returns {Promise<void>} - The result of the remove operation
  */
  async remove(key, id) {
    try {
      await lremove(this.instances[key], id);
    }
    catch (e) {
      //
    }
  }

  /**
   * Searches for instances in the given key using a query
   *
   * @async
   * @param {string} key - The key to search instances in
   * @param {Object} query - The query object to search instances with
   * @param {string} query.term - The search term to use, defaults to an empty string
   * @param {string} query.properties - The properties to search in, defaults to '*'
   * @returns {Promise<any>} - The result of the search operation
  */
  async search(key, query) {
    return await lsearch(this.instances[key], {
      ...query,
      term: query.term || '',
      properties: query.properties || '*'
    });
  }
}