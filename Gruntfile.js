module.exports = function(grunt) {
    grunt.initConfig( {
        watch : {
            js : {
                files : ['app/**/*.js', 'server/**/*.js' , '!testsEs5/**/*.js', 'main.js', 'package.json'],
                tasks : [ 'jshint:js', 'browserify:dev' ]
            },
            tests : {
                files : ['app/**/*.js', 'server/**/*.js' ,'tests/**/*.js', '!testsEs5/**/*.js' ],
                tasks : ['babel:tests', 'exec:dev' ]
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
                    ignore : ['app/**', 'server/**', 'tests/**', 'testsEs5/**' , 'node_modules/**', 'package.json', 'partials/**', 'bundle.js', 'main.js', 'Gruntfile.js'],
                    nodeArgs : ['--harmony']
                }
            }
        },
        compass : {
            dev : {
                options : {
                    basePath : './resources',
                    sassDir : 'sass',
                    cssDir : 'css',
                    fontsDir : 'fonts',
                    watch : true
                }
            }
        },
        babel : {
            tests: {
                files : [
                    {
                        'expand' : true,
                        'src' : ['./**/*.js'],
                        'cwd': './tests',
                        'dest' : 'testsEs5/'
                    },
                    {
                        'expand' : true,
                        'src' : ['./server/**/*.js'],
                        'dest' : 'testsEs5/'
                    },
                    {
                        'expand' : true,
                        'src' : ['./app/utils/*.js'],
                        'dest' : 'testsEs5/'
                    }
                ]
            }
        },
        exec : {
            dev: {
                cmd : 'jasmine',
                options : {
                    force:true
                }
            }
        },
        karma : {
            tests : {
                basePath : './',
                files : [
                    {
                        src : [ 
                            'node_modules/angular-mocks/angular-mocks.js',
                            'app/payments/**/*.js',
                            'tests/app/payments/*.js' 
                            ]
                     }
                ],
                logLevel : 'DEBUG',
                reporters :['spec', 'coverage'],
                browsers : ['PhantomJS'],
                singleRun : true,
                autoWatch : false,
                preprocessors : {
                    'app/payments/**/*.js' : 'coverage'
                },
                frameworks : ['jasmine'],
                coverageReporter : {
                    type : 'html',
                    dir : 'coverage/'
                }
            }
        },
        concurrent : {
            dev : {
                tasks : ['watch:js', 'nodemon:dev', 'compass:dev'],
                options : {
                    logConcurrentOutput : true,
                    limit:3
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
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('dist', ['compass:dist', 'browserify:dist', 'copy:dist', 'cssmin:dist', 'uglify:dist']);
    grunt.registerTask('default', ['concurrent']);
};
