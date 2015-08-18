var gulp        = require('gulp');
var clean       = require('gulp-clean');
var gzip        = require('gulp-gzip');
var gls         = require('gulp-live-server');
var install     = require('gulp-install');
var mocha       = require('gulp-mocha');
var tar         = require('gulp-tar');
var runSequence = require('run-sequence');

var commitId = require(__dirname + '/lib/sha.js');

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src('dist')
    .pipe(clean());
});

// Execute mocha tests
gulp.task('test', function () {
  return gulp.src('test/*.js', {read: false})
             .pipe(mocha({reporter: 'spec'}));
});

// Copy files to dist/ directory
gulp.task('dist:app', function() {
  return gulp.src('app.js')
             .pipe(gulp.dest('dist'));
});
gulp.task('dist:lib', function() {
  return gulp.src('lib/*.js')
             .pipe(gulp.dest('dist/lib'));
});
 
gulp.task('dist:public', function() {
  return gulp.src('public/*')
             .pipe(gulp.dest('dist/public'));

});
gulp.task('dist:package', function() {
  return gulp.src('package.json')
             .pipe(gulp.dest('dist'))
             .pipe(install({production: true}));
});

// Create tarball
gulp.task('dist:tar', function () {
  return gulp.src('dist/*')
             .pipe(tar('archive.tar'))
             .pipe(gzip())
             .pipe(gulp.dest('dist'));
});

// 'dist' ties together all dist tasks
gulp.task('dist', function(callback) {
  runSequence(
    'clean',
    [
      'dist:app',
      'dist:lib',
      'dist:public',
      'dist:package'
    ],
    'dist:tar',
    callback
  );
});

// Default is (for now) just test & dist
gulp.task('default', function(callback) {
  runSequence(
    'test',
    'dist',
    callback
  );
});

gulp.task('serve', function() {
  var server = gls.new('app.js');
  server.start();
});