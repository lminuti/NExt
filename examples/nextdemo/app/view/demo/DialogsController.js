Ext.define('NextDemo.view.demo.DialogsController', {

    extend: 'Ext.app.ViewController',

    alias: 'controller.dialogs',

    async onAlert() {
        await Next.Msg.alert('First altert');
        await Next.Msg.alert('Second altert');
    },

    async onConfirm() {
        const btn = await Next.Msg.confirm('Confirm', 'Are you sure?');
        if (btn === 'yes') {
            Next.Msg.alert('You clicked Yes');
        } else {
            Next.Msg.alert('You clicked No');
        }
    },

    async onPrompt() {
        const text = await Next.Msg.prompt('Please enter your name:');
        Next.Msg.alert(`You entered: ${text}`);
    }

});