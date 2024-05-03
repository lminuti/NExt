Ext.define('NextDemo.view.demo.IndexedDBController', {

    extend: 'Ext.app.ViewController',

    alias: 'controller.indexeddb',

    async init() {
        this.database = await Next.IndexedDB.open('nextdemo', NextDemo.app.schema);
    },

    async onRead() {
        const record = await this.database.users.get(1);
        if (!record) {
            await Next.Msg.alert('Record not found');
            return;
        }
        console.table(record);
        await Next.Msg.alert(record.name);

    },

    async onWrite() {
        await this.database.users.set(1, {
            id: 1,
            name: 'John',
            age: 55
        });
        await Next.Msg.alert('Record written');
    },

    async onReadAll() {
        const data = await this.database.users.entries();
        console.table(data.map(record => record[1]));
        Next.Msg.alert(`Read ${data.length} records`);
    },

    async onWriteAll() {
        const data = [{
            id: 1,
            name: 'John',
            age: 22
        }, {
            id: 2,
            name: 'Jane',
            age: 23
        }, {
            id: 3,
            name: 'Alice',
            age: 24
        }, {
            id: 4,
            name: 'Bob',
            age: 25
        }];
        await this.database.users.setMany(data.map(record => [record.id, record]));
        Next.Msg.alert(`Wrote ${data.length} records`);
    },

    onClear() {
        this.database.users.clear();
        Next.Msg.alert('Cleared all records');
    }

});