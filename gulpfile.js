var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var gnf = require('gulp-npm-files');
var del = require('del');
var exec = require('child_process').exec;

gulp.task('default', function (callback) {
    runSequence(['copy-index', 'copy-assets', 'copy-deps', 'build-sass', 'build-js:dev', 'watch', 'serve'],
        callback
    );
});

gulp.task('build:prod', function (callback) {
    runSequence('clean:dist',
        ['copy-index', 'copy-assets', 'copy-deps', 'build-sass', 'build-js'],
        callback
    );
});

gulp.task('build-sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(concat('bundle.css'))// Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('dist/css'))
});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', ['build-sass', 'serve']);
    gulp.watch('app/js/**/*.js', ['build-js:dev', 'serve']);
    gulp.watch('app/**/*.html', ['copy-index', 'copy-assets', 'serve']);
});


gulp.task('build-js:dev', function(){
    return gulp.src('app/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('build-js', function(){
    return gulp.src('app/**/*.js')
        .pipe(babel())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('copy-deps', function() {
    return gulp.src(gnf(), {base:'./'})
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-index', function() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('copy-assets', function() {
    return gulp.src('app/templates/**/*.html')
        .pipe(gulp.dest('dist/templates'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist/*');
});

gulp.task('serve', function(callback) {
    exec('node server.js', {maxBuffer: 1024 * 500}, function (err, stdout, stderr) {
        callback(err);
    });
});