module.exports = function(grunt)
{
    var log  = grunt.log,
        exec = require('child_process').exec,
        files = [],
        data,
        done;

    grunt.registerMultiTask('coffee', 'coffee script', function()
    {
        data = this.data;
        done = this.async();

        switch (this.target)
        {
            case 'dev': partialInclude (data, 'dev', false); break;
            case 'app': partialInclude (data, 'app', true); break;
        }
    });

    /**
     * Develop mode
     * @param data {Object}
     * @param attach {String}
     * @param app {Boolean}
     */
    function partialInclude (data, attach, app)
    {
        var source  = data.source,
            temp    = data.temp,
            srclist = data.src,
            target  = data.target,
            srcfile = [],
            code    = '',
            src,
            i;

        for (i = 0; i < srclist.length; i++)
        {
            src = srclist[i];

            if (typeof src === 'string')
            {
                srcfile.push(src);
            }
            else if (typeof src === 'object' && src[attach])
            {
                srcfile.push(src[attach]);
            }
        }

        //copy & compile
        var length = srcfile.length;
        for (i = 0; i < srcfile.length; i++)
        {
            files.push(
                copyAndCompile(source, temp, srcfile[i], --length, app)
            );
        }

        //include code
        code += '<!-- INCLUDE-SCRIPT -->\n';
        for (i = 0; i < files.length; i++)
        {
            code += '<script src="'+ files[i] +'"><\/script>\n';
        }
        code += '<!-- //INCLUDE-SCRIPT -->';

        //output script tag
        includeToHTML(target, code);
    }


    /**
     * Over write html file
     * @param target
     * @param code
     */
    function includeToHTML(target, code)
    {
        var html = grunt.file.read(target).replace(/<!-- INCLUDE-SCRIPT -->[\s\S]*<!-- \/\/INCLUDE-SCRIPT -->/m, code);
        grunt.file.write(target, html);
    }

    /**
     * Coffee file copy
     * @param source {String} coffee directory
     * @param output {String} js directory
     * @param file {String} coffee file
     * @param count {Number} left file
     * @param app {Boolean} app mode
     */
    function copyAndCompile (source, output, file, count, app)
    {
        var copy = file.replace(/\//g, '.');
        grunt.file.copy(source + file, output + copy);
        compile(output + copy, count, app);
        return output + copy.replace('.coffee', '.js');
    }

    /**
     * Coffee compile
     * @param file {String} target
     * @param count {Number} left file
     * @param app {Boolean} app mode
     */
    function compile (file, count, app)
    {
        var command = 'coffee -cbm ' + file;

        exec(command, function(error, stdout, stderr)
        {
            if(error || stderr)
            {
                log.writeln('File "' + file + '" failed.');
                console.log(error);
                done(false);
            }
            else
            {
                log.writeln('File "' + file + '" created.');

                if (count <= 0 && app === true)
                {
                    uniteInclude();
                    done();
                }
            }
        });
    }


    /**
     * App mode
     */
    function uniteInclude ()
    {
        var target = data.target,
            output = data.output,
            temp = data.temp,
            concat = '';

         for (var i = 0; i < files.length; i++)
         {
             concat += grunt.file.read(files[i]);
         }

         grunt.file.write(output, concat);

         var code = '<!-- INCLUDE-SCRIPT -->\n';
         code += '<script src="'+ output +'"><\/script>\n';
         code += '<!-- //INCLUDE-SCRIPT -->';

         //output script tag
         includeToHTML(target, code);

         //remove temp
         grunt.file.delete(temp);

         //Minify
         grunt.task.run('uglify:js');
    }
};