//------------------------------------------------------------------------------
//  Settings
//------------------------------------------------------------------------------
var OUTPUT_JS   = 'app.js';
var OUTPUT_DIR  = '../bin/';
var COFFEE_DIR  = 'coffee/';
var TARGET_HTML = '../index.html';
var SOURCE_DIR  = '_src/';
var PACKAGE_DIR = 'bin/';
var TEMPORARY   = '.coffee-tmp/';

//------------------------------------------------------------------------------
//  Source files
//------------------------------------------------------------------------------
var COFFEE_FILES = [
    //compile file
    'coffee/Coffee.coffee',

    //dev mode only
    { 'dev' : 'dev.coffee' },

    //app mode only
    { 'app' : 'app.coffee' }
];

//------------------------------------------------------------------------------
//  Grunt config
//------------------------------------------------------------------------------
module.exports = function(grunt)
{
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({

        //Coffee compile
        coffee : {
            dev: {
                attach : 'dev',
                source : COFFEE_DIR,
                temp   : TEMPORARY,
                src    : COFFEE_FILES,
                target : TARGET_HTML,
                srcdir : SOURCE_DIR
            },

            app: {
                attach : 'app',
                source : COFFEE_DIR,
                temp   : TEMPORARY,
                src    : COFFEE_FILES,
                target : TARGET_HTML,
                srcdir : SOURCE_DIR,
                outpack: OUTPUT_DIR + OUTPUT_JS,
                package: PACKAGE_DIR + OUTPUT_JS
            }
        },

        //JS minify
        uglify: {
            js: {
                options: {
                    preserveComments: 'some',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                src: OUTPUT_DIR + OUTPUT_JS,
                dest: OUTPUT_DIR + OUTPUT_JS
            }
        }
    });
};
