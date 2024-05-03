Ext.define('NextDemo.view.demo.IndexedDB', {

    extend: 'Ext.Panel',

    xtype: 'indexeddb',

    controller: 'indexeddb',

    title: 'IndexedDB',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    defaults: {
        xtype: 'button',
        margin: 20,
        width: 300,
        padding: 20,
        ui: 'action'
    },

    items: [{
        text: 'Read a record',
        handler: 'onRead'
    },{
        text: 'Write a record',
        handler: 'onWrite'
    },{
        text: 'Read all',
        handler: 'onReadAll'
    },{
        text: 'Write random data',
        handler: 'onWriteAll'
    },{
        text: 'Clear all data',
        handler: 'onClear'
    }]


}) ;