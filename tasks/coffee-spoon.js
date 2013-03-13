module.exports = function(grunt)
{
    var log  = grunt.log,
        process = require('child_process');

    grunt.registerMultiTask('coffee', 'coffee script', function()
    {
        var target = this.target,
            data = this.data;

        switch (target)
        {
            case 'dev': partialInclude (data); break;
            case 'app': uniteInclude (data); break;
        }
    });

    /**
     * App mode
     * @param data
     */
    function uniteInclude (data)
    {
        var files = partialInclude (data),
            package = data.package,
            outpack = data.outpack,
            target = data.target,
            concat = '';

        for (var i = 0; i < files.length; i++)
        {
            concat += grunt.file.read(files[i]);
        }

        grunt.file.write(outpack, concat);

        var code = '<!-- INCLUDE-SCRIPT -->\n';
            code += '<script src="'+ package +'"><\/script>\n';
            code += '<!-- //INCLUDE-SCRIPT -->';

        //HTMLに出力
        includeToHTML(target, code);

        //Minify
        grunt.task.run('uglify:js');
    }

    /**
     * Develop mode
     * @param data
     * @return {Array} jsfile
     */
    function partialInclude (data)
    {
        var source = data.source,
            temp   = data.temp,
            files  = data.src,
            attach = data.attach,
            target = data.target,
            srcdir = data.srcdir,
            file   = '',
            code   = '',
            jsfile = [],
            js;

        for (var i = 0; i < files.length; i++)
        {
            js = null;
            file = files[i];

            if (typeof file === 'string')
            {
                js = copyAndCompile(source, temp, file);
                jsfile.push(js);
            }
            else if (typeof file === 'object' && file[attach])
            {
                js = copyAndCompile(source, temp, file[attach]);
                jsfile.push(js);
            }
        }

        code += '<!-- INCLUDE-SCRIPT -->\n';
        for (i = 0; i < jsfile.length; i++)
        {
            code += '<script src="'+ srcdir + jsfile[i] +'"><\/script>\n';
        }
        code += '<!-- //INCLUDE-SCRIPT -->';

        //HTMLに出力
        includeToHTML(target, code);

        return jsfile;
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
     * @return {String} copy path
     */
    function copyAndCompile (source, output, file)
    {
        var copy = file.replace(/\//g, '.');
        grunt.file.copy(source + file, output + copy);
        compile(output + copy);
        return output + copy.replace('.coffee', '.js');
    }

    /**
     * Coffee compile
     * @param file {String} target
     */
    function compile (file)
    {
        var command = 'coffee -cbm ' + file;

        process.exec(command, function(error, stdout, stderr)
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
            }
        });
    }

};