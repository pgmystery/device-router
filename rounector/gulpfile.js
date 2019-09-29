const gulp = require('gulp');
// const del = require('del');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');
const uglify = require('gulp-uglify-es').default;


gulp.task('start', async function() {
    css();
    js();
});

function css() {
    const css_filepath = 'src/interface/style/';
    const css_export_filename = 'style.min.css';
    const css_export_filepath = 'src/.out/';

    gulp.src(css_filepath + '/**/*.css')
        .pipe(minifyCSS())
        .pipe(concat(css_export_filename))
        .pipe(gulp.dest(css_export_filepath));
}

function js() {
    const js_filepath = 'src/script/';
    const js_export_filename = 'script.js';
    const js_export_filepath = 'src/.out/';

    gulp.src(js_filepath + '/**/*.js')
        .pipe(concat(js_export_filename))
        .pipe(uglify())
        .pipe(gulp.dest(js_export_filepath));
}
