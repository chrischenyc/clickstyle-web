const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const git = require('gulp-git');

gulp.task('minify:css', () => {
  gulp
    .src('./public/css/**/*.css')
    .pipe(cleanCSS({ compatibility: 'ie9' }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(git.add())
    .pipe(git.commit('gulp minify css'));
});

gulp.task('default', ['minify:css'], () => {});
