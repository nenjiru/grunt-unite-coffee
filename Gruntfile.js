//------------------------------------------------------------------------------
//  Settings
//------------------------------------------------------------------------------
//Paths
var OUTPUT_JS   = 'app.js';
var COFFEE_DIR  = 'coffee/';       //grunt からみたCoffeeディレクトリ
var TEMPORARY   = '.coffee-tmp/';  //grunt からみた一時ディレクトリ
var SCSS_DIR    = 'scss/';         //grunt からみたSCSSディレクトリ
var PACKAGE_DIR = '../bin/';       //grunt からみた出力ディレクトリ
var TARGET_HTML = '../index.html'; //grunt からみたファイルパス
var INCLUDE_SRC = '_src/';         //ターゲットからみた src ディレクトリ
var INCLUDE_BIN = 'bin/';          //ターゲットからみた bin ディレクトリ

var COMPILE_JS  = PACKAGE_DIR + OUTPUT_JS;
var INCLUDE_JS  = INCLUDE_BIN + OUTPUT_JS;


//------------------------------------------------------------------------------
//  Source files
//------------------------------------------------------------------------------
//include 時に attach名にマッチするファイルを読み込み
var COFFEE_FILES = [
    //compile file
    'coffee/Coffee.coffee',

    //dev mode only
    { 'dev' : 'dev.coffee' },

    //app mode only
    { 'app' : 'app.coffee' },
];


var JS_DIR  = 'js/';
var JS_FILES = [];

//------------------------------------------------------------------------------
//  Grunt config
//------------------------------------------------------------------------------
module.exports = function(grunt)
{
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-watch');
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
                srcdir : INCLUDE_SRC
            },

            app: {
                attach : 'app',
                source : COFFEE_DIR,
                temp   : TEMPORARY,
                src    : COFFEE_FILES,
                target : TARGET_HTML,
                srcdir : INCLUDE_SRC,
                outpack: COMPILE_JS,
                package: INCLUDE_JS
            }
        },

        //JS minify
        uglify: {
            js: {
                options: {
                    preserveComments: 'some',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                src: COMPILE_JS,
                dest: COMPILE_JS
            }
        }
    });
};
