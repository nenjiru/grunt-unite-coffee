//------------------------------------------------------------------------------
//  Settings
//------------------------------------------------------------------------------
var IMPORT_FILE = 'example/import.json';
var OUTPUT_JS   = 'bin/app.js';
var TARGET_HTML = 'example.html';
var TARGET_JS   = 'bin/app.js';
var TARGET_SRC  = './';

//------------------------------------------------------------------------------
//  Grunt config
//------------------------------------------------------------------------------
module.exports = function(grunt)
{
    grunt.loadTasks('tasks');

    var setting = grunt.file.readJSON(IMPORT_FILE);

    grunt.initConfig({

        //Coffee compile
        coffee : {
            dev: {
                temp   : '.coffee-tmp/',
                source : TARGET_SRC,
                src    : setting.files,
                target : TARGET_HTML
            },
            app: {
                temp   : '.coffee-tmp/',
                source : TARGET_SRC,
                src    : setting.files,
                output : OUTPUT_JS,
                target : TARGET_HTML,
                include: TARGET_JS
            }
        }
    });
};
