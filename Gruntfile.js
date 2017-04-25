module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:['dist/Test' , 'dist/code'],
    babel:
    {
      options:
      {
        sourceMap: true,
        presets: ['babel-preset-react']
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
        out: 'temp',
        name: 'ConversationApp'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('atavi-client-bundle-application');
  // Default task(s).
  grunt.registerTask('default', ['babel:react','babel:dist','mochaTest']);
  grunt.registerTask('bundle', ['babel:react', 'atavi-client-bundle-application']);
  grunt.registerTask('react', ['babel:react']);


};
