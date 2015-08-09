// tagbox v0.0.5
//
// (c) myguide.io 2015
//
// @package tagbox
// @version 0.0.5
//
// @author Harry Lawrence <http://github.com/hazbo>
//
// License: MIT
//
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename'),
    jshint = require("gulp-jshint"),
    prettify = require('gulp-jsbeautifier');

gulp.task('build', function () {
    gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));

    gulp.src('./src/*.js')
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('dist'))
});
