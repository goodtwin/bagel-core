/*global module, require*/
module.exports = function (grunt) {
  'use strict';

  var globalConfig = {
    docs: 'docs',
    styleguide: 'guide',
    src: 'src',
    style: 'chrome',
    dist: {
      root: 'dist',
      docs: 'dist/docs',
      style: 'dist/style'
    }
  };

  grunt.initConfig({
    globalConfig: globalConfig,
    pkg: grunt.file.readJSON('./package.json'),
    assemble : {
      docs: {
        options: {
          assets: '<%= globalConfig.docs  %>/assets',
          flatten: false,
          partials: ['<%= globalConfig.docs  %>/partials/*.hbs'],
          layout: '<%= globalConfig.docs  %>/layouts/default.hbs',
          data: ['<%= globalConfig.docs  %>/data/*.{json,yml}','config.{json,yml}']
        },
        files: [{
          expand: true,
          cwd: '<%= globalConfig.styleguide  %>',
          src: ['**/*.hbs'],
          dest: '<%= globalConfig.dist.docs  %>'
        },
        {
          expand: true,
          src: ['**/node_modules/bagel-*/guide/**/*.hbs'],
          flatten: true,
          dest: '<%= globalConfig.dist.docs  %>'
        }]
      }
    },
    clean: {
      docs: {
        files : [
        {
          dot: true,
          src: ['<%= globalConfig.dist.docs  %>/*']
        }
        ]
      }
    },
    copy: {
      docs: {
        files: [
        {
          expand: true,
          cwd: '<%= globalConfig.docs  %>/assets/',
          src: ['images/*', 'javascripts/**/*.js'],
          dest: '<%= globalConfig.dist.docs  %>/assets/'
        },
        {
          expand: true,
          cwd: '<%= globalConfig.docs  %>/assets/',
          src: ['stylesheets/*.css'],
          dest: '<%= globalConfig.dist.docs  %>/'
        }
        ]
      }
    },
    sass: {
      options: {
        loadPath: ['./']
      },
      styleguide: {
        files : {
          '<%= globalConfig.dist.docs  %>/stylesheets/styleguide.css': '<%= globalConfig.styleguide  %>/guide.scss'
        }
      },
      dist: {
        files : {
          '<%= globalConfig.dist.style %>/style.css': 'init.scss'
        }
      }
    },
    bagel_sass_path : {
			gt: {
				options: {
					chrome: [
            './',
					  'src/',
					  'chrome/'
					]
				}
			}
		},
    shared_config: {
      style: {
        options: {
          name: 'defaultConfig',
          cssFormat: 'dash',
          useSassMaps: true
        },
        src: ['node_modules/**/bagel-*/config.yml', 'node_modules/bagel-*/config.yml', 'config.yml'], // order matters
        dest: [
          'config.scss'
        ]
      }
    },
    myth: {
      options: {
        sourcemap: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= globalConfig.dist.style  %>/',
            src: ['**/*.css'],
            dest: '<%= globalConfig.dist.style  %>/'
          }
        ]
      },
      docs: {
        files: [
          {
            expand: true,
            cwd: '<%= globalConfig.dist.docs  %>/',
            src: ['**/*.css'],
            dest: '<%= globalConfig.dist.docs  %>/'
          }
        ]
      }
    },
    watch: {
      hbs: {
        files: ['**/*.hbs'],
        tasks: ['assemble:docs']
      }
    },
    dss: {
      docs: {
        files: {
          'dist/docs/': 'dist/style/*.css'
        },
        options: {
          css_include: 'dist/style/style.css'
        }
      }
    }
  });

require('load-grunt-tasks')(grunt);
grunt.loadNpmTasks('assemble');

grunt.registerTask('default', ['build']);
grunt.registerTask('dist', ['bagel_sass_path','sass:dist', 'myth:dist']);
grunt.registerTask('docs', ['copy:docs', 'sass:styleguide', 'myth:docs', 'assemble']);
grunt.registerTask('build', ['clean', 'shared_config', 'bagel_sass_path', 'docs', 'dist']);

};
