module.exports = function(grunt)
{
    var log  = grunt.log,
        exec = require('child_process').exec,
        partialFiles = [],
        tempFiles = [],
        data,
        done;

    grunt.task.registerMultiTask('unite-coffee', 'CoffeeScript compile', function()
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
            copyAndCompile(source, temp, srcfile[i], --length, app);
        }

        //include code
        code += '<!-- INCLUDE-SCRIPT -->\n';
        for (i = 0; i < partialFiles.length; i++)
        {
            code += '<script src="'+ partialFiles[i] +'"><\/script>\n';
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
     * @param temp {String} temp directory
     * @param file {String} coffee file
     * @param count {Number} left file
     * @param app {Boolean} app mode
     */
    function copyAndCompile (source, temp, file, count, app)
    {
        var copy = file.replace(/\//g, '.'),
            copyCoffee = temp + copy,
            copyJS = copyCoffee.replace(/\.coffee$/, '.js');

        tempFiles.push(copyJS);
        partialFiles.push(source + copyJS);

        grunt.file.copy(file, copyCoffee);

        compile(copyCoffee, count, app);
    }

    /**
     * Coffee compile
     * @param file {String} target
     * @param count {Number} left file
     * @param app {Boolean} app mode
     */
    function compile (file, count, app)
    {
        var command = 'coffee -cb';

        if (app === false)
        {
            command += 'm';
        }

        command += ' '+ file;

        exec(command, function(error, stdout, stderr)
        {
            if(error || stderr)
            {
                log.writeln('coffee-spoon "' + file + '" failed.');
                done(false);
            }
            else
            {
                log.writeln('coffee-spoon "' + file + '" created.');

                if (count <= 0)
                {
                    if (app === true)
                    {
                        uniteInclude(function ()
                        {
                            done(true);
                        });
                    }
                    else
                    {
                        done(true);
                    }
                }
            }
        });
    }

    /**
     * App mode
     */
    function uniteInclude (callback)
    {
        var target  = data.target,
            output  = data.output,
            include = data.include,
            temp    = data.temp,
            concat  = '';

        for (var i = 0; i < tempFiles.length; i++)
        {
            concat += grunt.file.read(tempFiles[i]);
        }

        grunt.file.write(output, concat);

        var code = '<!-- INCLUDE-SCRIPT -->\n';
        code += '<script src="'+ include +'"><\/script>\n';
        code += '<!-- //INCLUDE-SCRIPT -->';

        //output script tag
        includeToHTML(target, code);

        //remove temp
        grunt.file.delete(temp);

        callback();
    }
};