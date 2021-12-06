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
          './vision-toolkit/src/vision-toolkit-hmi/Imports/base64/Base64.js',
          './vision-toolkit/src/vision-toolkit-hmi/Imports/json-viewer/json-viewer.js',
          './vision-toolkit/src/vision-toolkit-hmi/Imports/uuid-gen/UuidGen.js',
          './src/sandpit-tchmi.js',
          './vision-toolkit/src/vision-toolkit-hmi/lib/**.js',
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/**.js',
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/**.js',
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/**.js',
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/*/*/*/*/*/**.js', 
          './vision-toolkit/src/vision-toolkit-hmi/lib/*/*/*/*/*/*/*/*/*/*/*/**.js', 
          './src/sandpit-graphframework.js',
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
