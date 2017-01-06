var gulp        = require('gulp'),
    gutil       = require('gulp-util'),

    jshint      = require('gulp-jshint'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),

    watch       = require('gulp-watch'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    moment      = require('moment'),
    notify      = require('gulp-notify'),
    rimraf      = require('gulp-rimraf'),

    input  = {
      'sass': 'scss/**/*.scss',
      'javascript': 'javascript/**/*.js',
      'vendorjs': [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
      ]
    },

    output = {
      'stylesheet': {
        name: 'style.css',
        path: 'css'
      },
      'javascript': {
        name: 'main.js',
        path: 'js'
      }
    }
;

gulp.task('clean', function() {
  return gulp
    .src([
      output.stylesheet.path,
      output.javascript.path
    ], { read: false })
    .pipe(rimraf({
      force: true
    }));
})

gulp.task('build-css', function() {
  return gulp.src(input.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', notify.onError("Error: <%= error.message %>", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename(output.stylesheet.name))
    .pipe(rename({
        extname: ".min.css"
     }))
    .pipe(gulp.dest(output.stylesheet.path))
    .pipe(notify('Compressed SASS (' + moment().format('MMM Do h:mm:ss A') + ')'));
});

gulp.task('build-js', ['jshint'], function() {
  return gulp.src(input.vendorjs.concat(input.javascript))
    .pipe(sourcemaps.init())
    .pipe(concat(output.javascript.name))
    .pipe(uglify())
    .on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(rename({
        extname: ".min.js"
     }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.javascript.path))
    .pipe(notify('Uglified JavaScript (' + moment().format('MMM Do h:mm:ss A') + ')'));
});

gulp.task('jshint', function() {
  return gulp.src('javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch('javascripts/**/*.js', ['build-js']);
  gulp.watch('scss/**/*.scss', ['build-css']);
});

gulp.task('default', ['clean', 'build-css', 'build-js'], function() {
  return gutil.log('Gulp is running!')
});
