Ext.define('NextDemo.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.MessageBox',
        'Ext.layout.Fit'
    ],

    defaults: {
        tab: {
            iconAlign: 'top'
        }
    },

    tabBarPosition: 'bottom',

    items: [
        {
            title: 'Store',
            iconCls: 'x-fas fa-table',
            layout: 'fit',
            items: [{
                xtype: 'mainlist'
            }]
        },{
            title: 'Dialogs',
            iconCls: 'x-far fa-comment',
            layout: 'fit',
            items: [{
                xtype: 'dialogs'
            }]
        },{
            title: 'IndexedDB',
            iconCls: 'x-fa fa-database',
            layout: 'fit',
            items: [{
                xtype: 'indexeddb'
            }]
        }
    ]
});
