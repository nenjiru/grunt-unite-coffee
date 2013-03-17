//------------------------------------------------------------------------------
//  Settings
//------------------------------------------------------------------------------
var IMPORT_FILE = 'example/import.json';
var MINIFY_JS   = 'bin/app.js';
var TARGET_HTML = 'example.html';
var TARGET_JS   = 'bin/app.js';
var TARGET_SRC  = './';

//------------------------------------------------------------------------------
//  Grunt config
//------------------------------------------------------------------------------
module.exports = function(grunt)
{
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var settings = grunt.file.readJSON(IMPORT_FILE);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        //Coffee compile
        coffee : {
            dev: {
                temp   : '.coffee-tmp/',
                source : TARGET_SRC,
                src    : Settings.files,
                target : TARGET_HTML
            },

            app: {
                temp   : '.coffee-tmp/',
                source : TARGET_SRC,
                src    : Settings.files,
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
