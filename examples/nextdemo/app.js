/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'NextDemo.Application',

    name: 'NextDemo',

    requires: [
        // This will automatically load all classes in the NextDemo namespace
        // so that application classes do not need to require each other.
        'NextDemo.*'
    ],

    // The name of the initial view to create.
    mainView: 'NextDemo.view.main.Main'
});
