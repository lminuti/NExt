/**
 * This view is an example list of people.
 */
Ext.define('NextDemo.view.demo.List', {
    extend: 'Ext.Panel',
    xtype: 'mainlist',

    requires: [
        'NextDemo.model.Personnel'
    ],

    controller: 'list',

    title: 'Personnel',

    tools: [{
        xtype: 'label',
        style: 'color: white;',
        html: 'Click here ==>'
    },{
        iconCls: 'x-fa fa-sync',
        handler: 'onRefresh'
    }],

    layout: 'fit',

    items: [{
        xtype: 'grid',

        reference: 'grid',

        store: {
            model: 'NextDemo.model.Personnel'
        },
    
        columns: [{ 
            text: 'Name',
            dataIndex: 'name',
            width: 100
        }, {
            text: 'Email',
            dataIndex: 'email',
            width: 230 
        }, { 
            text: 'Phone',
            dataIndex: 'phone',
            width: 150 
        }]
    }]

});
