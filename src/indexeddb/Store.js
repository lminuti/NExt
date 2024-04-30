Ext.define('Next.indexeddb.Store', {
   
    privates: {

        promisifyRequest(request) {
            return Next.indexeddb.Database.promisifyRequest(request);
        },

        createStore(dbName, storeName) {
            const request = indexedDB.open(dbName);
            request.onupgradeneeded = (e) => {
                return request.result.createObjectStore(storeName);
            };
            let dbp = this.promisifyRequest(request);
          
            return (txMode, callback) => {
                return dbp.then(db => 
                    callback(db.transaction(storeName, txMode).objectStore(storeName))
                );
            };
        },

        eachCursor(store, callback) {
            store.openCursor().onsuccess = function() {
                if (!this.result) {return;}
                callback(this.result);
                this.result.continue();
            };
            return this.promisifyRequest(store.transaction);
        },

    },

    /**
     * Create a new Store.
     * Do not use it directly. Use the Database object to create a new Store.
     * @param {Next.indexeddb.Database} db 
     * @param {function} storeFunc 
     */
    constructor(db, storeFunc) {
        this.customStore = storeFunc;
    },

    /**
     * Get a value by its key.
     *
     * @param key
     * @return {Promise} Returns a promise
     */
    get(key) {
        return this.customStore('readonly', store => this.promisifyRequest(store.get(key)));
    },

    /**
     * Set a value with a key.
     *
     * @param key
     * @param value
     * @return {Promise} Returns a promise
     */
    set(key, value) {
        return this.customStore('readwrite', store => {
            store.put(value, key);
            return this.promisifyRequest(store.transaction);
        });
    },

    /**
     * Set multiple values at once. This is faster than calling set() multiple times.
     * It's also atomic – if one of the pairs can't be added, none will be added.
     *
     * @param entries Array of entries, where each entry is an array of `[key, value]`.
     * @return {Promise} Returns a promise
     */
    setMany(entries) {
        return this.customStore('readwrite', store => {
            entries.forEach(entry => store.put(entry[1], entry[0]));
            return this.promisifyRequest(store.transaction);
        });
    },
  
    /**
     * Get multiple values by their keys
     *
     * @param keys
     * @return {Promise} Returns a promise
     */
    getMany(keys) {
        return this.customStore('readonly', store =>
            Promise.all(keys.map(key => this.promisifyRequest(store.get(key))))
        );
    },
  
    /**
     * Update a value. This lets you see the old value and update it as an atomic operation.
     *
     * @param key
     * @param updater A callback that takes the old value and returns a new value.
     * @return {Promise} Returns a promise
     */
    update(key, updater) {
        return this.customStore(
            'readwrite',
            store =>
            // Need to create the promise manually.
            // If I try to chain promises, the transaction closes in browsers
            // that use a promise polyfill (IE10/11).
                new Promise((resolve, reject) => {
                    store.get(key).onsuccess = function() {
                        try {
                            store.put(updater(this.result), key);
                            resolve(this.promisifyRequest(store.transaction));
                        } catch (err) {
                            reject(err);
                        }
                    };
                })
        );
    },
  
    /**
     * Delete a particular key from the store.
     *
     * @param key
     * @return {Promise} Returns a promise
     */
    del(key) {
        return this.customStore('readwrite', store => {
            store.delete(key);
            return this.promisifyRequest(store.transaction);
        });
    },
  
    /**
     * Delete multiple keys at once.
     *
     * @param keys List of keys to delete.
     * @return {Promise} Returns a promise
     */
    delMany(keys) {
        return this.customStore('readwrite', store => {
            keys.forEach(key => store.delete(key));
            return this.promisifyRequest(store.transaction);
        });
    },
  
    /**
     * Clear all values in the store.
     *
     * @return {Promise} Returns a promise
     */
    clear() {
        return this.customStore('readwrite', store => {
            store.clear();
            return this.promisifyRequest(store.transaction);
        });
    },
    
    /**
     * Get an array with all keys in the store.
     *
     * @return {Promise} Returns a promise
     */
    keys() {
        return this.customStore('readonly', store => {
            // Fast path for modern browsers
            if (store.getAllKeys) {
                return this.promisifyRequest(store.getAllKeys());
            }
  
            const items = [];
  
            return this.eachCursor(store, cursor => items.push(cursor.key)).then(() => items);
        });
    },
  
    /**
     * Get an array of all values in the store.
     *
     * @return {Promise} Returns a promise
     */
    values() {
        return this.customStore('readonly', store => {
            // Fast path for modern browsers
            if (store.getAll) {
                return this.promisifyRequest(store.getAll());
            }
  
            const items = [];
  
            return this.eachCursor(store, cursor => items.push(cursor.value)).then(
                () => items
            );
        });
    },
  
    /**
     * Get all entries in the store. Each entry is an array of `[key, value]`.
     *
     * @return {Promise} Returns a promise
     */
    entries() {
        return this.customStore('readonly', store => {
            // Fast path for modern browsers
            // (although, hopefully we'll get a simpler path some day)
            if (store.getAll && store.getAllKeys) {
                return Promise.all([
                    this.promisifyRequest(store.getAllKeys()),
                    this.promisifyRequest(store.getAll())
                ]).then((entry) => {
                    const keys = entry[0];
                    const values = entry[1];
                    return keys.map((key, i) => [key, values[i]]);
                });
            }
  
            const items = [];
  
            return this.customStore('readonly', store =>
                this.eachCursor(store, cursor => items.push([cursor.key, cursor.value])).then(
                    () => items
                )
            );
        });
    }        

});