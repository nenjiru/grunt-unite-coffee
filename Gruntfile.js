//------------------------------------------------------------------------------
//  Settings
//------------------------------------------------------------------------------
var MINIFY_JS   = 'bin/app.js';
var TARGET_HTML = 'example.html';
var TARGET_JS   = 'bin/app.js';
var TARGET_SRC  = './';

//------------------------------------------------------------------------------
//  Source files
//------------------------------------------------------------------------------
var COFFEE_FILES = [
    //compile file
    'example/package/Hello.coffee',

    //dev mode only
    { 'dev' : 'example/dev.coffee' },

    //app mode only
    { 'app' : 'example/app.coffee' }
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
                temp   : '.coffee-tmp/',
                source : TARGET_SRC,
                src    : COFFEE_FILES,
                target : TARGET_HTML
            },

            app: {
                temp   : '.coffee-tmp/',
                source : TARGET_SRC,
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
