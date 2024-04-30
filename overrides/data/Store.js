Ext.define('Next.overrides.data.Store', {
   
    override: 'Ext.data.ProxyStore',

    asyncLoad(options) {
        let me = this;
        return new Ext.Promise(function (resolve, reject) {
            me.load(Ext.apply(options || {}, {
                callback(records, operation, success) {
                    if (success) {
                        resolve(records);
                    } else {
                        reject(operation);
                    }
                }
            }));
        });
    },

    asyncSync(options) {
        let me = this;
        return new Ext.Promise(function (resolve, reject) {
            me.sync(Ext.apply(options || {}, {
                success(batch, options) {
                    resolve([batch, options]);
                },
                failure(batch, options) {
                    reject([batch, options]);
                },
            }));
        });        
    }

});