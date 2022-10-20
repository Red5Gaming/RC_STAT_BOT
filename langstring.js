let en = require('./languages/en.json');


module.exports = {

    // one lang string looks like this: The old reason was: {{oldWarning}}
    // the {{oldWarning}} is filled with a value in the command file.
    // here you need to find the placeholders (they are not all named the same) and define a function to fill them.
    // the function should return a string.




getLocale: function(language, string, ...args) {
    let locale = en[`${string}`];
    // let count = 0;
    for(let i = 0; i < args.length; i++) {
        let placeholder = `%VAR%`;
        locale = locale.replace(placeholder, args[i]);
    }
    return locale;
},


randomError: function(language) {
    let errors = en[`errorInteractionCreate`];
    let random = Math.floor(Math.random() * errors.length);
    return errors[random];

}


}