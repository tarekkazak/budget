module.exports = function(grunt) {
    grunt.initConfig( {
        watch : {
            js : {
                files : ['app/**/*.js', 'main.js', 'package.json'],
                tasks : ['jshint:js']
            }
        },
        jshint : {
                js : ['app/**/*.js'],
                options : {
                    force : true
                }
        },
        browserify : {
            js: {
                files : {'bundle.js' : ['main.js']}
            },
            dev : {
                files : {'bundle.js' : ['main.js']},
                options : {
                    watch : true,
                    keepAlive : true
                }
            }
        },
        nodemon: {
            dev : {
                script : 'server.js',
                options : {
                    ignore : ['app/**', 'node_modules/**', 'package.json', 'partials/**', 'bundle.js']
                }
            }
        },
        concurrent : {
            target :{
                tasks : ['watch:js', 'nodemon:dev'],
                options : {
                    logConcurrentOuput : true
                }
            }

        }
        
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('dist', ['compass:dist', 'browserify:dist', 'copy:dist', 'cssmin:dist', 'uglify:dist']);
    grunt.registerTask('default', ['concurrent:target']);
};
