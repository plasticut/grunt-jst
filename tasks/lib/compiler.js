
/*
    TEMPLATE COMPILER
*/

function Compiler(providerName, providerSettings) {
    var TemplateProvider = Compiler.Providers[providerName];
    if (!TemplateProvider) { throw 'Unknown template provider ' + providerName; }
    this.templateProvider = new TemplateProvider(providerSettings);
}

module.exports = Compiler;

Compiler.prototype.compile = function(template) {
    return this.templateProvider.compile(template);
};

Compiler.Providers = {
    ect: require('./providers/ect'),
    ejs: require('./providers/ejs')
};
