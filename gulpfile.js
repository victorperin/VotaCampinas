var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
  browserSync.init({
    proxy: 'localhost:3000',
    port: '8000'
  });
});

gulp.task('server', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    watch: ['server.js', 'controllers/', 'models/'],
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('angular', function () {
  return gulp.src([
    'app/app.js',
    'app/controllers/*.js',
    'app/services/*.js',
    'app/partials/**/*.js',
    'app/filters/*.js'
  ])
    .pipe(plumber())
    .pipe(concat('application.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('materialize', function () {
  return gulp.src('src/assets/scss/materialize.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

gulp.task('styles', function () {
  return gulp.src('src/assets/scss/votacampinas.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('templates', function () {
  return gulp.src('app/partials/**/*.html')
    .pipe(templateCache({ root: 'partials', module: 'votaCampinas' }))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('vendor', function () {
  return gulp.src('app/vendor/*.js')
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js/lib'));
});

gulp.task('watch', function () {
  gulp.watch('app/partials/**/*.html', ['templates']);
  gulp.watch('app/**/*.js', ['angular']);
  gulp.watch('src/assets/scss/components/**/*.scss', ['materialize']);
  gulp.watch('src/assets/scss/styles/**/*.scss', ['styles']);
  gulp.watch('public/**/*').on('change', browserSync.reload);
});

gulp.task('build', ['angular', 'vendor', 'templates', 'materialize']);
gulp.task('default', ['build', 'server', 'browser-sync', 'watch']);