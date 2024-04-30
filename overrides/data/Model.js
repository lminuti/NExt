/**
 * This class provides a way to load and save records asynchronously.
 */
Ext.define('Next.overrides.data.Model', {
   
    override: 'Ext.data.Model',

    inheritableStatics: {
        /**
         * Read a record by ID asynchronously.
         * @param {*} id the record ID
         * @param {*} options Same options that you would pass to the load method
         * @param {*} session The session to use for loading the record
         * @returns 
         */
        asyncLoad(id, options, session) {
            let me = this;
            return new Ext.Promise(function (resolve, reject) {
                me.load(id, Ext.apply(options || {}, {
                    callback(record, operation, success) {
                        if (success) {
                            //operation.records = records;
                            resolve(record);
                        } else {
                            reject(operation);
                        }
                    }
                }), session);
            });        
        }
    },

    /**
     * This method is used to load a record asynchronously.
     * You can use it with the async/await syntax.
     * For example:
     *     const record = await myRecord.asyncLoad(...);
     * @param {Object} options The same options that you would pass to the load method
     * @returns {Promise<Ext.data.Model>} The record that was read
     */
    asyncLoad(options) {
        let me = this;
        return new Ext.Promise(function (resolve, reject) {
            me.load(Ext.apply(options || {}, {
                callback(record, operation, success) {
                    if (success) {
                        resolve(record);
                    } else {
                        reject(operation);
                    }
                }
            }));
        });        
    },

    /**
     * This method is used to save a record asynchronously.
     * You can use it with the async/await syntax.
     * Example:
     *     await myRecord.asyncSave();
     * @param {Object} options 
     * @returns {Promise<Ext.data.Model>} The record that was saved
     */
    asyncSave(options) {
        let me = this;
        return new Ext.Promise(function (resolve, reject) {
            me.save(Ext.apply(options || {}, {
                callback(record, operation, success) {
                    if (success) {
                        me.commitAllChanges(record);
                        resolve(record);
                    } else {
                        reject(operation);
                    }
                }
            }));
        });        
    }

});