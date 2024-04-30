/**
 * This is a singleton class that provides a simple interface to the Ext.MessageBox class.
 * 
 * All the methods return a Promise that is resolved when the user clicks on the button.
 * So you can use them with the async/await syntax.
 * 
 * Example:
 * 
 *     const buttonId = await Next.Message.confirm('Are you sure?');
 *     const text = await Next.Message.prompt('What is your name?');
 */
Ext.define('Next.Message', {
    alternateClassName: 'Next.Msg',
    singleton: true,

    /**
     * Ask the user to confirm something. Opens a dialog with Yes and No buttons.
     * @param {string} message 
     * @returns {Promise<string>}
     */
    confirm(message) {
        var me = this;
        return new Ext.Promise(function (resolve, reject) {
             Ext.Msg.confirm(document.title, message, function(buttonId) {
                resolve(buttonId);
            });
        });
    },

    /**
     * Show an alert dialog. Opens a dialog with an OK button.
     * @param {string} message 
     * @returns {Promise<void>}
     */
    alert(message) {
        var me = this;
        return new Ext.Promise(function (resolve, reject) {
             Ext.Msg.alert(document.title, message, function() {
                resolve();
            });
        });
    },

    /**
     * Open a dialog with a text field and OK and Cancel buttons.
     * @param {string} message The message to show in the dialog
     * @param {boolean} multiLine If true, the text field will be a textarea
     * @param {string} value The default value for the text field
     * @param {string} prompt The configuration for the prompt. See the prompt documentation in Ext.MessageBox for more information.
     * @returns 
     */
    prompt(message, multiLine, value, prompt) {
        var me = this;
        return new Ext.Promise(function (resolve, reject) {
             Ext.Msg.prompt(document.title, message, function(buttonId, text) {
                if (buttonId === 'ok') {
                    resolve(text);
                } else {
                    resolve(null);
                }
            }, null, multiLine, value, prompt);
        });
    }
});