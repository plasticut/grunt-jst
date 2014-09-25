
/*
    HANDLEBARS TEMPLATE PROVIDER
*/

function HandlebarsProvider(options) {
    this.hbs = require('handlebars');
    this.options = options;
}

module.exports = HandlebarsProvider;

HandlebarsProvider.prototype.compile = function(template) {
    return this.hbs.precompile(template, this.options);
};