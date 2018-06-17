const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');

gulp.task('clean:build', () => del(['./build/**/*']));

gulp.task('minify:css', () => {
  gulp
    .src('./public/css/**/*.css')
    .pipe(cleanCSS({ compatibility: 'ie9' }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['clean:build', 'minify:css'], () => {});
