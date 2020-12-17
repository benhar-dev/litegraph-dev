module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
       js: {
        files: ['src/*.js'],
        tasks: ['concat:build'],
        options: {
          livereload: 1030,
        },
      }
    },
    concat: {
      build: {
        src: [
          './src/sandpit-tchmi.js',
          './vision-toolkit/vision-toolkit-hmi/GraphFramework/**.js',
          './vision-toolkit/vision-toolkit-hmi/GraphFramework/*/**.js',
          './vision-toolkit/vision-toolkit-hmi/GraphFramework/*/*/**.js',
          './src/sandpit-graphframework.js',
          './vision-toolkit/vision-toolkit-hmi/NodePacks/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/*/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/*/*/*/**.js', 
          './src/sandpit-nodepack.js'
          ],
        dest: './public/vision-toolkit.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('build', ['concat:build'])
}
