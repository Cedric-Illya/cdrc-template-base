// ====================
// Table of contents
// --------------------
// 1. Modules
// 2. Style
// 3. HTML
// 4. JavaScript
// 5. Watch
// 6. Server
// 7. Clean
// Gulp tasks
// ====================





// ===================
// 1. Modules
// ===================

var { src, dest, series, watch, parallel } = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass')(require('node-sass'));
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var del = require('del');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var beautify = require('gulp-beautify');
var pug = require('gulp-pug');
var changed = require('gulp-changed');





// ===================
// 2. Style
// ===================

function buildSCSS () {
    return src('src/scss/main.scss')
        .pipe( changed('dist', {
            extension: '.css'
        }) )
        .pipe( concat( 'style.css' ) )
        .pipe( sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError) )
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe( dest('dist/css/') )
        .pipe( connect.reload() );
}





// ===================
// 3. HTML
// ===================

function buildPUG () {
    return src('src/**/*.pug')
        .pipe( changed('dist', {
            extension: '.html'
        }) )
        .pipe( pug() )
        .pipe( beautify.html({ 
            indent_size: 4 
        }))
        .pipe( dest('dist/') )
        .pipe( connect.reload() );
}





// ===================
// 4. JavaScript
// ===================

function buildJS () {
    return src('src/js/**/*.js')
        .pipe( changed('dist', {
            extension: '.js'
        }) )
        .pipe( babel({
            presets: ['@babel/env']
        }) )
        .pipe( concat( 'common.js' ) )
        // .pipe( uglify() )
        .pipe( dest('dist/js') )
        .pipe( connect.reload() );
}






// ===================
// 5. Watch
// ===================

function watcher(cb) {
    watch( 'src/**/*.pug', buildPUG );
    watch( 'src/scss/**/*.scss', buildSCSS );
    watch( 'src/js/**/*.js', buildJS );

    cb();
}







// ===================
// 6. Server
// ===================

function serverStart (cb) {
    connect.server({
        port: 1212,
        host: '0.0.0.0',
        root: 'dist/',
        livereload: true
    });

    cb();
}





// ===================
// 7. Clean
// ===================

const clean = () => del('dist');





// ===================
// Gulp tasks
// ===================

exports.default = parallel( serverStart, watcher )
exports.build = series( clean, parallel(buildPUG, buildSCSS, buildJS) )