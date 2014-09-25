
/*
    ECT TEMPLATE PROVIDER
*/

function EctProvider(options) {
    var ECT = require('ect');
    this.ect = new ECT(options);
}

module.exports = EctProvider;

EctProvider.prototype.compile = function(template) {
    return this.ect.compile(template);
};