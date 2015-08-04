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
