module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:['dist/Test' , 'dist/code'],
    babel:
    {
      options:
      {
        sourceMap: true,
        presets: ['babel-preset-es2015', 'babel-preset-react']
      },
      dist:
      {
        files:
        [{
          expand: true,
				  cwd: 'src',
				  src: ['**/*.js', '**/*.jsx' ],
				  dest: 'dist/'
        }]
      }
    },

    mochaTest:
    {
      test:
      {
        options:
        {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['src/test/*.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['babel','mochaTest']);

};
