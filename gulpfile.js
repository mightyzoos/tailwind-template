const { init, reload } = require('browser-sync');
const { watch, src, dest, series } = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const tailwindcss = require('tailwindcss');

function initBrowserSync() {
    init({
        files: ["**/*.html", "**/*.css", "**/*.js"],
        server: {
            baseDir: './src'
        }
    });
}

function reloadFiles() {
    reload();
}

function buildTailwind() {
    return src('src/styles/global.css')
        .pipe(postcss([
            tailwindcss('tailwind.config.js'),
            require('autoprefixer'),
            require('cssnano')
        ]))
        .pipe(rename('global.min.css'))
        .pipe(dest('src/styles', { overwrite: true }))
}

// Static server
exports.default = function () {
    initBrowserSync();
    buildTailwind();

    watch(['src/*.html']).on('change', series(buildTailwind, reloadFiles));
    watch(['src/js/*.js', 'src/styles/general.css']).on('change', reloadFiles);
}