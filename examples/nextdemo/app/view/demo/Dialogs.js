Ext.define('NextDemo.view.demo.Dialogs', {

    extend: 'Ext.Panel',

    xtype: 'dialogs',

    controller: 'dialogs',

    title: 'Dialogs',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    defaults: {
        margin: 20,
        width: 300,
        padding: 20,
        ui: 'action'
    },

    items: [{
        xtype: 'button',
        text: 'Alert',
        handler: 'onAlert'
    }, {
        xtype: 'button',
        text: 'Confirm',
        handler: 'onConfirm'
    }, {
        xtype: 'button',
        text: 'Prompt',
        handler: 'onPrompt'
    }]

})