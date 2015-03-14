var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var less = require('gulp-less');

var runSequence = require('run-sequence'); // Temporary solution until gulp 4
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');



var _browserify = require('browserify');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var reactify = require('reactify');


var browserify = function(opt) {
    return _browserify(_.extend({
        bundleExternal: true
    }, opt));
};

gulp.task('browserify-build', function() {
    var b = browserify();
    b.add('./app/js/app.js');
    return b.transform(reactify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist/js'))
});




gulp.task('concat:js', function() {
    return gulp.src([
            'app/js/app.js'
         ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('uglify:js', function() {
    return gulp.src([
            'app/app.js'
        ])
        .pipe(concat('main.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('compile:less', function() {

    return gulp.src('app/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));

});

gulp.task('copy:css',function(){
    return gulp.src('app/css/**')
    .pipe(gulp.dest('dist/css/'));
})

gulp.task('watch', function() {
    gulp.watch(['app/less/*'], ['compile:less']);
});


// -----------------------------------------------------------------------------
// | Main tasks                                                                |
// -----------------------------------------------------------------------------
gulp.task('clean', function(done) {
    require('del')([
        'dist/js',
	'dist/css'
    ], done);
});

gulp.task('copy', [
    'copy:css'
]);

gulp.task('compile', [
    'compile:less',
    'browserify-build'
    ]);


gulp.task('build', function(done) {
    runSequence(
        ['clean'],
        'concat:js',
        'copy',
        done);
});


gulp.task('default', ['compile']);
