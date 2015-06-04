'use strict';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var sassInput = [
  'src/_config.scss',
  'src/helpers/*.scss',
  'src/plugins/*.scss',
  'src/_media.scss'
];

var sassdocOptions = {
  config: './.sassdocrc',
  verbose: true,
  dest: './sassdoc'
};


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var fs = require('fs');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var packageInfo = require('./package.json');
var sassdoc = require('sassdoc');


// -----------------------------------------------------------------------------
// Dist
// -----------------------------------------------------------------------------

gulp.task('build', function () {
  return gulp
    .src(sassInput)
    .pipe(plugins.concat('_include-media.scss'))
    .pipe(plugins.header(fs.readFileSync('./banner.txt', 'utf-8')))
    .pipe(plugins.replace(/@version@/, packageInfo.version))
    .pipe(gulp.dest('./dist'));
});


// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

gulp.task('test_libsass', function () {
  return gulp
    .src(['./tests/*.scss'])
    .pipe(plugins.sass({ errLogToConsole: true })
      .on('error', function (err) {
        plugins.sass.logError(err);
        process.exit(1);
      })
    );
});

gulp.task('test_rubysass', function () {
  return plugins
    .rubySass('./tests')
    .on('error', function (err) {
      console.error('Error!', err.message);
      process.exit(1);
    });
});


gulp.task('test', ['test_libsass', 'test_rubysass']);


// -----------------------------------------------------------------------------
// Sass API documentation
// -----------------------------------------------------------------------------

gulp.task('sassdoc', function () {
  return gulp
    .src(sassInput)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', ['test', 'build']);