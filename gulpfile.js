var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserSync = require('browser-sync').create();



gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', function(err) {
        notify({
          title: 'Wow a css bug'
        }).write(err.line + ': ' + err.message);
        return this.emit('end');
    }))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});


gulp.task('pug', function buildHTML() {
    return gulp.src([
        'views/*.pug',
        'views/**/*.pug'
    ])
    .pipe(pug(
        {
            pretty: true,
            basedir: __dirname + '/views'
        }
    ).on('error', function(err) {
        notify({
            title: 'Wow a pug bug'
        }).write(err.line + ': ' + err.message);
        return this.emit('end');
    }))
    .pipe(gulp.dest('./'));
});


gulp.task('js', function (cb) {
    pump([
            gulp.src(['js/libs/*.js', 'js/*.js']),
            sourcemaps.init(),
            concat('app.min.js'),
            gulp.dest('./'),
            uglify(),
            sourcemaps.write(),
            gulp.dest('./')
        ],
        cb
    );
});



gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("sass/**/*.scss", ['sass']);
    gulp.watch("views/**/*.pug", ['pug']);
    gulp.watch("js/**/*.js", ['js']);
    gulp.watch("*.js").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
});


gulp.task('default', ['browser-sync', 'pug', 'sass', 'js']);