/**
 * Find multiple documents in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to search.
 * @param {Object} [options.key={}] - An object with key-value pairs to use as a filter for the search.
 *   - allowedQuery (Set): A set of allowed query keys. If any provided query key is not in this set, the function will reject with an error.
 *   - paginate (boolean): If true, the function will return a paginated result. If false, it will return all matching documents.
 *   - populate (Object): An object with the following properties:
 *     - path (string): The field to populate.
 *     - select (string): A space-separated string of fields to select.
 *   - query (Object): An object with key-value pairs representing queries to filter the search by.
 *     - sortBy (string): A string in the format "field:order", where "field" is the field to sort by and "order" is either "asc" or "desc".
 *     - search (string): A string to search for in the collection.
 *     - page (number): The page number to return.
 *     - limit (number): The number of documents per page.
 *     - Any field of the provided table if allowed.
 * @returns {Promise} A promise that resolves with an array of found documents or an object with a `docs` array of found documents and metadata about the pagination, or rejects with an error if there is an issue with the query?.
 * @example
 * const result = await find({
 *   table: 'users',
 *   key: {
 *     allowedQuery: new Set(['sortBy', 'search']),
 *     paginate: true,
 *     populate: { path: 'profile', select: 'name' },
 *     query: { sortBy: 'name:asc', search: 'john', page: 2, limit: 20 }
 *   }
 * });
 */
const find = ({ table, key = {} }) => new Promise((resolve, reject) => {
  const queryKeys = Object.keys(key?.query || {});
  const verified = queryKeys.every(k => (key.allowedQuery || new Set([])).has(k));
  if (!verified) reject('Query validation issue');
  const noPaginate = key.paginate === false;
  key.options = noPaginate ? {} : {
    ...key.populate && { populate: { ...key.populate } },
    page: key?.query?.page || 0,
    limit: key?.query?.limit || 10,
    sort: { ...!key?.query?.sortBy && { createdAt: -1 } }
  };
  // prepare query object with provied queries to find.
  queryKeys.forEach(async k => {
    if (typeof key?.query[k] === 'string' && key?.query[k].startsWith('{"') && key?.query[k].endsWith('"}')) key.query[k] = JSON.parse(key?.query[k]);
    if (k === 'sortBy') {
      const parts = key?.query?.sortBy.split(':');
      return key.options.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    if (k === 'id') {
      key._id = key?.query?.id;
      return delete key?.query?.id;
    }
    key[k] = key?.query[k];
  });

  const method = noPaginate ? 'find' : 'paginate';
  const options = key.options;
  const populate = key.populate;
  delete key.allowedQuery;
  delete key.populate;
  delete key.paginate;
  delete key.options;
  delete key?.query;
  // May break
  resolve(table[method](key, options)[noPaginate ? 'populate' : 'then'](populate?.path, populate?.select?.split(' ')))
    .then(res => resolve(res))
    .catch(e => reject(e));
});

/**
 * Find a single document in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to search.
 * @param {Object} [options.key={}] - An object with key-value pairs to use as a filter for the search.
 * @returns {Promise} A promise that resolves with the found document or null if no matching document is found, or rejects with an error if there is an issue with the query?.
 * @example
 * const result = await findOne({ table: 'users', key: { name: 'John' } });
 */
const findOne = async ({ table, key = {} }) => new Promise((resolve, reject) => {
  if (key.id) key._id = key.id; delete key.id;
  if (Object.keys(key).length < 1) resolve(null);
  table.findOne(key).populate(key.populate?.path, key.populate?.select?.split(' '))
    .then(res => resolve(res))
    .catch(e => reject(e));
});

/**
 * Create a new document in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to create the document in.
 * @param {Object} options.key - An object with key-value pairs representing the fields and values of the new document.
 * @param {Object} [options.key.populate] - An object with the following properties:
 *   - path (string): The field to populate.
 *   - select (string): A space-separated string of fields to select.
 * @returns {Promise} A promise that resolves with the created document, or rejects with an error if there is an issue with the creation.
 * @example
 * const result = await create({
 *   table: 'users',
 *   key: { name: 'John', age: 30, populate: { path: 'profile', select: 'name' } }
 * });
 */
const create = async ({ table, key }) => {
  try {
    const elem = await new table(key);
    const res = await elem.save();
    key.populate && await res.populate(key.populate?.path, key.populate?.select?.split(' '));
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * Update an existing document in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to update the document in.
 * @param {Object} options.key - An object with key-value pairs representing the fields to update and their new values.
 *   - id (string): The ID of the document to update.
 *   - body (Object): An object with key-value pairs representing the fields to update and their new values.
 *   - populate (Object): An object with the following properties:
 *     - path (string): The field to populate.
 *     - select (string): A space-separated string of fields to select.
 * @returns {Promise} A promise that resolves with the updated document, or rejects with an error if there is an issue with the update.
 * @example
 * const result = await update({
 *   table: 'users',
 *   key: { id: '123', body: { name: 'John', age: 30 }, populate: { path: 'profile', select: 'name' } }
 * });
 */
const update = async ({ table, key }) => {
  try {
    if (key.id) key._id = key.id; delete key.id;
    const element = await table.findOne(key);
    if (!element) return Promise.resolve(element);
    Object.keys(key.body).forEach(param => element[param] = key.body[param]);
    const res = await element.save();
    key.populate && await res.populate(key.populate?.path, key.populate?.select?.split(' '));
    return Promise.resolve(element);
  }
  catch (e) { return Promise.reject(e); }
};


/**
 * remove - Removes an element from the specified table that matches the provided key.
 *
 * @param {Object} options - An object containing the following fields:
 *   - table {string}: The name of the table to remove the element from.
 *   - key {Object}: The key to use to identify the element to remove.
 * @return {Promise} A promise that resolves with the removed element if it was found and removed successfully,
 *   or with `null` if no element was found. Rejects with an error if there was an issue removing the element.
 */
const remove = async ({ table, key }) => {
  try {
    if (key.id) key._id = key.id; delete key.id;
    const element = await table.findOne(key);
    if (!element) return Promise.resolve(element);
    await element.remove();
    return Promise.resolve(element);
  }
  catch (e) { Promise.reject(e); }
};

/**
 * removeAll - Removes all elements from the specified table.
 *
 * @param {Object} options - An object containing the following field:
 *   - table {string}: The name of the table to remove all elements from.
 * @return {Promise} A promise that resolves with an object containing information about the deleted elements.
 *   Rejects with an error if there was an issue deleting the elements.
 */
const removeAll = async ({ table, key }) => {
  try {
    const res = await table.deleteMany(key);
    return Promise.resolve(res);
  }
  catch (e) { Promise.reject(e); }
};

/**
 * save - Saves an element to the database.
 *
 * @param {Object} data - The element to save.
 * @return {Promise} A promise that resolves with the saved element if it was saved successfully.
 *   Rejects with an error if there was an issue saving the element.
 */
const save = async (data) => await data.save();

export { find, findOne, create, remove, update, save, removeAll };