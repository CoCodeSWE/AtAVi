module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:['dist/Test' , 'dist/code'],
    babel:
    {
      options:
      {
        sourceMap: true,
        presets: ['babel-preset-react'],
        ignore: ['node_modules/**/*']
      },
      dist:
      {
        files:
        [{
          expand: true,
				  cwd: 'src',
				  src: ['**/*.js' ],
				  dest: 'dist/'
        }]
      },
      react:
      {
        files:[
        {
          expand: true,
          cwd: 'src/Client/ConversationApp',
          src: ['**/*.jsx'],
          dest: 'src/Client/ConversationApp',
          ext:'.js'
        }]
      }
    },
    browserify:
    {
      client:
      {
        options:
        {
          transform: [
            ["babelify", {presets: ["es2015", "react"]}]
          ]
        },
        files:
        {
          "./dist/client/main.js": ["./src/Client/main.js"]
        }
      },
      'test-client':
      {
        options:
        {
          transform: [
            ["babelify", {presets: ["es2015", "react"]}]
          ]
        },
        files:
        {
          "./dist/test/client/test.js": ["./src/test/client/test_*.js"]
        }
      }
    },
    mochaTest:
    {
      test:
      {
        options:
        {
          reporter: 'mochawesome',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['src/test/*.js']
      }
    },
    'atavi-client-bundle-application':
    {
      conversation:
      {
        src: 'src/Client/ConversationApp/setup.json',
        out: 'src/Client/Applications',
        name: 'ConversationApp',
        javascript: true
      }
    },
    'copy':
    {
      client:
      {
        files: [
          {expand: true, cwd: 'src/Client/Index/', src: '**', dest: 'dist/Client'},
          {expand: true, cwd: 'src/Client/Recorder/', src: 'RecorderWorker.js', dest: 'dist/Client/Script'}
        ]
      },
      'test-client':
      {
        files:[
          {expand: true, cwd: 'src', src: 'test/client/index.htm', dest: 'dist'},
          {expand: true, cwd: 'src', src: 'test/browser/**/*', dest: 'dist'},
          {expand: true, cwd: 'src/Client/ConversationApp/', src: '**/*.js', dest: 'dist/test/client'}
        ]
      }
    },
    watch:
    {
      client:
      {
        files: ['src/Client/**/*'],
        tasks: ["babel:react", "atavi-client-bundle-application", "browserify:client", "sass:client", "copy:client"],
        options: {livereload: true}
      }
    },
    sass:
    {
      client:
      {
        options:
        {
          style: 'expanded',
          update: true
        },
        files:
        [
          {
            expand: true,
            src: 'src/Client/Index/Sass/*.scss',
            dest: './',
            ext: '.css'
          }
        ]
      }
    }
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('atavi-client-bundle-application');
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('mocha-browser-test-page');
  // Default task(s).
  grunt.registerTask('default', ['babel:react','babel:dist','mochaTest']);
  grunt.registerTask('bundle', ['babel:react', 'atavi-client-bundle-application']);
  grunt.registerTask('react', ['babel:react']);
  grunt.registerTask('build-client', ["babel:react", "atavi-client-bundle-application", "browserify:client", "copy:client"]);
  grunt.registerTask('test-client', ["browserify:test-client", "copy:test-client"]);

};
