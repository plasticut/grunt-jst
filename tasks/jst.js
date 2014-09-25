'use strict';

module.exports = function (grunt) {

    var getNamespaceDeclaration = function ( ns ) {
        var output = [];
        var curPath = 'this';
        if (ns !== 'this') {
            var nsParts = ns.split('.');
            nsParts.forEach( function (curPart) {
                if ( curPart !== 'this' ) {
                    curPath += '[\'' + curPart + '\']';
                    output.push(curPath + ' = ' + curPath + ' || {};');
                }
            } );

        }

        output.push('__jst = ' + curPath + ';');

        return {
            namespace   : curPath,
            declaration : output.join( '\n' )
        };
    };


    grunt.registerMultiTask('jst', 'Compile templates to JST file that can be exposed as a module', function () {
        var Compiler = require('./lib/compiler');
        var path = require('path');
        var _ = require('lodash');
        var beautifier = require('node-beautify');

        var defaultOptions = {
            namespace        : null,
            templateSettings : {
            },
            lintExpr         : {
                //              unused : false, asi : true, expr : true
            },
            provider         : 'ect',
            processName      : function (name) {
                return name;
            },
            useStrict        : false,
            prettify         : false,
            prettifyOptions  : {
                indentSize : 2
            }
        };


        var options = _.extend({}, defaultOptions, this.options());

        var compiler = new Compiler(options.provider, options.templateSettings);

        grunt.verbose.writeflags(options, 'Options');

        var nsInfo;
        if (options.namespace) {
            nsInfo = getNamespaceDeclaration(options.namespace);
        } else {
            nsInfo = {
                namespace: 'exports',
                declaration: ''
            }
        }

        var output = [];
        var compiled, templateName;
        this.files.forEach(function (f) {

            _.each(f.src, function (srcFile) {
                var fpath;
                if (f.cwd) {
                    fpath = path.resolve(f.cwd, srcFile);
                } else {
                    fpath = srcFile;
                }
                var src = grunt.file.read(fpath);
                try {

                    var compiled = compiler.compile(src);

                    templateName = options.processName(srcFile);

                    output.push('__jst[\'' + templateName + '\'] = ' + compiled + ';');
                } catch (e) {
                    grunt.log.error(e);
                    grunt.fail.warn('file failed to compile.');
                }
            });

            if (output.length > 0) {

                if (options.lintExpr && !_.isEmpty(options.lintExpr)) {
                    var lintlines = _.map(options.lintExpr, function (v, k) {
                        return k + ', ' + v;
                    });
                    output.push('\n jshint ' + lintlines.join(' '));
                }

                if (options.useStrict) {
                    output.unshift('\'use strict;\'\n');
                }

                if (nsInfo.declaration) {
                    output.unshift(nsInfo.declaration);
                }

                var contents = output.join('\n');
                if (options.prettify) {
                    contents = beautifier.beautifyJs(contents, options.prettifyOptions);
                }

                grunt.file.write(f.dest, contents);
                grunt.log.writeln('File "' + f.dest + '" created.');

            }
        });

    });
};
