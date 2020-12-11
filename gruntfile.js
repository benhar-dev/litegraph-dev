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
          './src/tchmi.js',
          './src/pre-graphframework.js',
          './vision-toolkit/vision-toolkit-hmi/GraphFramework/**.js',
          './src/post-graphframework.js',
          './src/pre-nodepack.js',
          './vision-toolkit/vision-toolkit-hmi/NodePacks/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/*/*/**.js', 
          './vision-toolkit/vision-toolkit-hmi/NodePacks/*/*/*/*/*/**.js', 
          './src/litegraph-dev-nodepack.js',
          './src/post-nodepack.js'
          ],
        dest: './public/vision-toolkit.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('build', ['concat:build'])
}
