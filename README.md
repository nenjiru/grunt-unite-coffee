#CoffeeScript Compiler


CoffeeScript のコンパイルと HTMLファイルの SCRIPT要素の挿入を行う Grunt task です。  
コンパイル時にモードを指定することで SCRIPT要素の挿入方法を制御します。


## DEV版

>$ grunt coffee:dev

開発モードでコンパイルします。  
分割された coffee を未結合のまま js へ変換し sourcemap 付きで出力します。
変換された js の読み込みタグをHTMLに差し込むとこまで行います。

.coffee を階層に分けてしまうと sourcemap のリンクが切れてしまう問題に対応するため、一時的に temp ディレクトリに .map を生成しています。


## APP版

>$ grunt coffee:app

リリース版でコンパイルします。  
分割された coffee を1つの js ファイルに結合します。  
結合圧縮された js の読み込みタグをHTMLに差し込むとこまで行います。


### 準備

読み込み対象のHTMLには次の記述が必要です。

    <!-- INCLUDE-SCRIPT -->
    <!-- //INCLUDE-SCRIPT -->

### 設定

サンプルの Gruntfile.js の設定例

    var OUTPUT_JS   = 'app.js';        //結合ファイル名
    var OUTPUT_DIR  = '../bin/';       //Gruntfile.js からみた出力ディレクトリ
    var COFFEE_DIR  = 'coffee/';       //Gruntfile.js からみたCoffeeディレクトリ
    var TEMPORARY   = '.coffee-tmp/';  //Gruntfile.js からみた一時ディレクトリ
    var TARGET_HTML = '../index.html'; //Gruntfile.js からみた対象HTMLファイル
    var SOURCE_DIR  = '_src/';         //TARGET_HTML からみた src ディレクトリ
    var PACKAGE_DIR = 'bin/';          //TARGET_HTML からみた bin ディレクトリ

#### ファイル設定

記述順通りにHTMLに挿入されます。  
またコンパイル時にモードに応じたファイルのみを読み込ませることもできます。

    var COFFEE_FILES = [
        //compile file
        'coffee/Coffee.coffee',
    
        //dev mode only
        { 'dev' : 'dev.coffee' },
    
        //app mode only
        { 'app' : 'app.coffee' }
    ];

### 詳細設定

タスクを読み込みます。

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-uglify');
  
依存モジュールを npm install しておいてください。

* grunt-contrib-watch
* grunt-contrib-uglify

タスクを直に編集するなら次の要素を修正します。
ターゲットと attach をは揃っている必要があります。

    coffee : {
        //開発版 コンパイルした js を個別に読むようHTMLを書き換える
        dev: {
            attach : 'dev',
            source : COFFEE_DIR,
            temp   : TEMPORARY,
            src    : COFFEE_FILES,
            target : TARGET_HTML,
            srcdir : SOURCE_DIR
        },

        //リリース版 圧縮結合した js を読むようHTMLを書き換える
        app: {
            attach : 'app',
            source : COFFEE_DIR,
            temp   : TEMPORARY,
            src    : COFFEE_FILES,
            target : TARGET_HTML,
            srcdir : SOURCE_DIR,
            outpack: COMPILE_JS,
            package: INCLUDE_JS
        }
    }

