Ext.define('NextDemo.view.demo.ListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.list',

    init() {
        //
    },

    async onRefresh() {
        const records = await this.lookup('grid').getStore().asyncLoad();
        Next.Msg.alert(`Record: ${records.length}`);
    }
});
