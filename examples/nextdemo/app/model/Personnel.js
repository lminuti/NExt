Ext.define('NextDemo.model.Personnel', {
    extend: 'NextDemo.model.Base',

    fields: [
        'name', 'email', 'phone'
    ],
    proxy: {
        type: 'ajax',
        url: 'api/personnel.json',
        reader: {
            type: 'json'
        }
    }

});
