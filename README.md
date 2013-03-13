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

    var TARGET_HTML = 'example.html'; //Gruntfile.js からみた対象HTMLのパス
    var TARGET_JS   = 'bin/app.js';   //TARGET_HTML からみた出力ファイルのパス
    var TARGET_SRC  = 'example/';     //TARGET_HTML からみたCoffeeディレクトリのパス
    var TEMPORARY   = '.coffee-tmp/'; //Gruntfile.js からみた一時ディレクトリ
    var MINIFY_JS   = 'bin/app.js';   //Gruntfile.js からみた出力ファイル

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

* grunt-contrib-uglify

タスクを直に編集するなら次の要素を修正します。

    coffee : {
        //開発版 コンパイルした js を個別に読むようHTMLを書き換える
        dev: {
            source : TARGET_SRC,
            temp   : TEMPORARY,
            src    : COFFEE_FILES,
            target : TARGET_HTML
        },

        //リリース版 圧縮結合した js を読むようHTMLを書き換える
        app: {
            source : TARGET_SRC,
            temp   : TEMPORARY,
            src    : COFFEE_FILES,
            target : TARGET_HTML,
            output : TARGET_JS
        }
    }

