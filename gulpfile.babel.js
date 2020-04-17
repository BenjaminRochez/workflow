// Gulp module imports
import {src, dest, watch, parallel, series} from 'gulp';
import del from 'del';
import livereload from 'gulp-livereload';
import sass from 'gulp-sass';
import minifycss from 'gulp-minify-css';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import yargs from 'yargs';
import pug  from 'gulp-pug';
var browserSync = require('browser-sync').create();

// Build Directories
// ----
const dirs = {
  src: 'src',
  dest: 'build'
};



// File Sources
// ----
const sources = {
  styles: `${dirs.src}/**/*.scss`,
  views: `${dirs.src}/**/*.pug`,
  scripts: `${dirs.src}/**/*.js`
};

const dst = {
    views: `${dirs.dest}/**/*.html`,
    scripts: `${dirs.dest}/**/*.js`,
}

// Recognise `--production` argument
const argv = yargs.argv;
const production = !!argv.production;



// Main Tasks
// ----

// Styles 
export const buildStyles = () => src(sources.styles)
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(gulpif(production, minifycss()))
  .pipe(dest(dirs.dest))
  .pipe(browserSync.stream());

// Views
export const buildViews = () => src(sources.views)
  .pipe(pug())
  .pipe(dest(dirs.dest))
  


// Scripts
export const buildScripts = () => src(sources.scripts)
  .pipe(babel({ presets: ['@babel/preset-env'] }))
  .pipe(dest(dirs.dest))
  //.pipe(browserSync.reload());


// Clean
export const clean = () => del(['build']);

// A simple task to reload the page
export const reload = () => {
    browserSync.reload();
}


// Watch Task
export const devWatch = () => {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./build",
            
        },
        startPath: './pug/index.html'
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
  watch(sources.styles, buildStyles);
  watch(sources.views, buildViews);
  watch(dst.views).on('change', browserSync.reload);
  watch(sources.scripts, buildScripts);
  watch(dst.scripts).on('change', browserSync.reload);
};


// Development Task
export const dev = series(clean, parallel(buildStyles, buildViews, buildScripts), devWatch);

// Serve Task
export const build = series(clean, parallel(buildStyles, buildViews, buildScripts));

// Default task
export default dev;