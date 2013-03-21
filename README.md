#CoffeeScript Compiler


CoffeeScript のコンパイルと HTMLファイルの SCRIPT要素の挿入を行う Grunt task です。  
コンパイル時にモードを指定することで SCRIPT要素の挿入方法を制御します。

## サンプルをつかう

Gruntfile.js のあるディレクトリで npm install します。

## DEV版で出力する

>$ grunt coffee:dev

開発モードでコンパイルします。  
分割された coffee を未結合のまま js へ変換し sourcemap 付きで出力します。
変換された js の読み込みタグをHTMLに差し込むとこまで行います。

.coffee を階層に分けてしまうと sourcemap のリンクが切れてしまう問題に対応するため、一時的に temp ディレクトリに .map を生成しています。


## APP版で出力する

>$ grunt coffee:app

リリース版でコンパイルします。  
分割された coffee を1つの js ファイルに結合します。  
結合された js の読み込みタグをHTMLに差し込むとこまで行います。

※ミニファイ化は grunt-contrib-uglify などを使用してください

### 準備

読み込み対象のHTMLには次の記述が必要です。

    <!-- INCLUDE-SCRIPT -->
    <!-- //INCLUDE-SCRIPT -->

### 設定

サンプルの Gruntfile.js の設定例

    var IMPORT_FILE = 'example/import.json'; //Gruntfile.js からみた設定ファイルのパス
    var OUTPUT_JS   = 'bin/app.js';          //Gruntfile.js からみた出力ファイル名
    var TARGET_HTML = 'example.html';        //Gruntfile.js からみた対象HTMLのパス
    var TARGET_JS   = 'bin/app.js';          //TARGET_HTML からみた出力ファイルのパス
    var TARGET_SRC  = './';                  //TARGET_HTML からみた Gruntfile.js ディレクトリ


#### ファイル設定

記述順通りにHTMLに挿入されます。  
またコンパイル時にモードに応じたファイルのみを読み込ませることもできます。  
設定をJSONファイルにしておくこともできます。

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
依存モジュールを npm install しておいてください。

    grunt.loadTasks('tasks');

読み込みファイルを外部化してある場合はこれをロードしておきます。

    var setting = grunt.file.readJSON(IMPORT_FILE);


タスクを直に編集するなら Gruntfile.js に次のように設定します。

    coffee : {
        //開発版 コンパイルした js を個別に読むようHTMLを書き換える
        dev: {
            temp   : '.coffee-tmp/',
            source : TARGET_SRC,
            src    : setting.files,
            target : TARGET_HTML
        },

        //リリース版 圧縮結合した js を読むようHTMLを書き換える
        app: {
            temp   : '.coffee-tmp/',
            source : TARGET_SRC,
            src    : setting.files,
            output : OUTPUT_JS,
            target : TARGET_HTML,
            include: TARGET_JS
        }
    }

