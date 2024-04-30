![NExt logo](resources/logo-next.png)

*NExt* is a package for [ExtJS](https://www.sencha.com/products/extjs/). It aims to simplify ExtJS usage by incorporating modern *JavaScript* features, like classes with [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) or `async`/`await` instead of callbacks. Additionally, it offers a streamlined interface for working with [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB).

## Features

- **Promisified ExtJS Classes**: Use ExtJS classes like `Ext.data.Store`, `Ext.data.Model` and `Ext.MessageBox` with Promises or async/await, making code more readable and easier to write.
- **IndexedDB Wrapper**: A straightforward interface for interacting with IndexedDB, allowing you to store and retrieve data without dealing with the low-level API directly.

## Installation

The *NExt* package should be copied to the root packages directory of your `workspace`. For instance, if you have generated your application using Sencha Cmd, you would copy the package to:

```
{yourWorkspace}/packages/local
```

Once your package is appropriately located, you'll need to modify your `app.json` file. Open `{appDir}/app.json` and add "next" to the "requires" block. It should now look like similar to the following code snippet:

```
"requires": [
   "next"
],
```

## Usage

### Promisified ExtJS Classes

Instead of using callbacks, you can use Promises or async/await with popular ExtJS classes. For example you can have the response from a DialogBox without a callback:

```javascript

Ext.define('Example.MainController', {
    extend: 'Ext.app.ViewController',

    // Add the required class! 
    requires: [
        'Next.Message'
    ],

    ...

    async onButtonClick() {
        const buttonId = await Next.Msg.confirm('Are you ok?');
        ...
        const text = await Next.Message.prompt('What is your name?');
        ...
    },
});

```

*Store* and *model* can retrieve data without a callback. You can use the same method of the standard ExtJS class with the `async` prefix as in the example below:

```javascript

    async readAllRecords(store) {
        const records = await store.asyncLoad();
        for (let record of records) {
            console.log(record.getId());
        }
    },

    async writeAllRecords(store) {
        await store.asyncSync();
        await Next.Msg.alert('Done');
    },

    async changeUserName(id, name) {
        const user = await MyApp.model.User.asyncLoad(id);
        user.set('name', name);
        await user.asyncSave();
    }

```


### IndexedDB Wrapper

*Next* provides a simplified interface for working with IndexedDB. You can connect to the database this way (if the database doesn't exist it will be created, if it's older the the version specified it will be upgraded):

```javascript
// If you add a new store in the schema you must increment the database version!
database = await Next.IndexedDB.open('dbname', {
    version: 1,
    stores: ['store1','store2', 'store3', 'store4']
});

```

Probably it's a good idea to put all the schema in the application main file (`Application.js`):

```javascript
Ext.define('Example.Application', {
    extend: 'Ext.app.Application',

    name: 'Example',

    schema: {
        version: 1,
        stores: ['store1', 'store2']
    },
```

and connect like this:

```javascript
database = await Next.IndexedDB.open('dbname', Example.app.schema);
```

Then it's possible to use you IndexedDB stores (do not confuse with ExtJS stores that are a totally different thing):

```javascript

// Add a string to 'store1'
await database.store1.set(1, 'Luca');

// Add an object
await database.store1.set(2, {
    name: 'luca'
});

// Get a value
const value = await database.store1.get(1);

// Remove a value
const value = await database.store1.del(1);

// Get all keys
const value = await database.store1.keys();

// Remove all entries in the store
const value = await database.store1.clear();

```

## Acknowledgments

After digging into the quite complex IndexedDB API, I found it really helpful to check out these JavaScript projects on GitHub - they gave me tons of great ideas:

* https://github.com/jakearchibald/idb-keyval
* https://github.com/dexie/Dexie.js
 
## Contributing

Contributions are welcome! Feel free to submit a pull request.

## License

Next is released under the [MIT License](https://opensource.org/licenses/MIT).