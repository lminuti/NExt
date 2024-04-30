/**
 * This is a super-simple *promise-based* keyval store implemented with IndexedDB.
 * 
 * This work is inspired by: https://github.com/jakearchibald/idb-keyval
 *                      and  https://github.com/dexie/Dexie.js
 * 
 * Supported browser: https://caniuse.com/?search=indexdb
 * 
 * // Create a database with 4 stores. Every time you add a new store, you need to increment the version.
 * database = await Next.IndexedDB.open('db', {
 *     version: 1,
 *     stores: ['store1','store2', 'store3', 'store4']
 * });
 * 
 * // Add a new key-value pair to the 't1' store
 * await database.store1.set('key', 'value');
 * 
 * // Get the value of the key 'key' from the 'store1' store
 * await database.store1.get('key');
 * 
 */
Ext.define('Next.indexeddb.Database', {

    alternateClassName: 'Next.IndexedDB', 

    statics: {

        // private
        databases: {},

        // private
        promisifyRequest(request) {
            return new Promise((resolve, reject) => {
                request.oncomplete = request.onsuccess = () => resolve(request.result);
                request.onabort = request.onerror = () => reject(request.error);
            });
        },

        /**
     * Create or open a new Database with the given schema.
     * The schema is an object with the following properties:
     * - version: the version of the database
     * - stores: an array of store names
     * Example:
     * {
     *    version: 1,
     *    stores: ['store1', 'store2']
     * }
     * @param {String} dbName Database name
     * @param {Object} schema the schema of the database
     */
        open(dbName, schema) {
            return new Promise((resolve, reject) => {
                if (this.databases[dbName]) {
                    resolve(this.databases[dbName]);
                    return;
                }
                const request = indexedDB.open(dbName, schema.version);
                request.onupgradeneeded = (e) => {
                    Ext.log('Upgrade indexDB: ' + dbName + ' from ' + e.oldVersion + ' to ' + e.newVersion);
                    for (let storeName of schema.stores) {
                        if (!request.result.objectStoreNames.contains(storeName)) {
                            request.result.createObjectStore(storeName);
                        }
                    }
                };
                let dbp = this.promisifyRequest(request);
    
                dbp.then(db => {
                    const database = Ext.create('Next.indexeddb.Database', db);
                    this.databases[dbName] = database;
                    for (let storeName of db.objectStoreNames) {
                        database[storeName] = Ext.create('Next.indexeddb.Store', this, (txMode, callback) => {
                            return callback(db.transaction(storeName, txMode).objectStore(storeName));
                        });
                    }
                    resolve(database);
                }).catch(e => {
                    reject(e);
                });
    
            });
        }

    },

    /**
     * Get the name of the database.
     * Read-only property.
     */
    name: '',

    /**
     * Get the object store names of the database.
     * Read-only property.
     */
    objectStoreNames: [],


    /**
     * Create a new Database.
     * Do not use it directly. Use the static method #open to create or open a Database.
     * @param {IDBDatabase} db 
     */
    constructor(db) {
        this.db = db;
        this.name = db.name;
        // Convert the DOMStringList to an array
        this.objectStoreNames = Array.from(db.objectStoreNames);
    },

    /**
     * Close the database.
     */
    close() {
        this.db.close();
        delete Next.indexeddb.Database.databases[this.db.name];
        this.db = null;
    }

});