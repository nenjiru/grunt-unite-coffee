//------------------------------------------------------------------------------
//  Settings
//------------------------------------------------------------------------------
var TARGET_HTML = 'example.html';
var TARGET_JS   = 'bin/app.js';   //targetからみて
var TARGET_SRC  = 'example/';     //targetからみて
var TEMPORARY   = '.coffee-tmp/'; //gruntからみて
var MINIFY_JS   = 'bin/app.js';   //gruntからみて

//------------------------------------------------------------------------------
//  Source files
//------------------------------------------------------------------------------
var COFFEE_FILES = [
    //compile file
    'package/Hello.coffee',

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

        pkg: grunt.file.readJSON('package.json'),

        //Coffee compile
        coffee : {
            dev: {
                source : TARGET_SRC,
                temp   : TEMPORARY,
                src    : COFFEE_FILES,
                target : TARGET_HTML
            },

            app: {
                source : TARGET_SRC,
                temp   : TEMPORARY,
                src    : COFFEE_FILES,
                target : TARGET_HTML,
                output : TARGET_JS
            }
        },

        //JS minify
        uglify: {
            js: {
                options: {
                    preserveComments: 'some',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                src: MINIFY_JS,
                dest: MINIFY_JS
            }
        }
    });
};
