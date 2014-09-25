
/*
    EJS TEMPLATE PROVIDER
*/

function EjsProvider(options) {
    this.ejs = require('ejs');
    this.options = options;
}

module.exports = EjsProvider;

EjsProvider.prototype.compile = function(template) {
    return this.ejs.compile(template, this.options);
};