var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var csso = require('gulp-csso');
var tinypng = require('gulp-tinypng');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var svgo = require('gulp-svgo');
var svgSprite = require('gulp-svg-sprite');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var del = require('del');

gulp.task('sass:dev', function () {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(['last 3 version']))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({message: 'Styles task complete'}));
});
gulp.task('sass:build', function () {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 3 version']))
        .pipe(csso())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({message: 'Styles build task complete'}));
});
gulp.task('pug', function () {
    return gulp.src('dev/**/!(_)*.pug')
        .pipe(pug({
            'pretty': true
        }))
        .pipe(gulp.dest('dist/'));
});
gulp.task('js:dev', function () {
    return gulp.src('dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('js:build', function () {
    return gulp.src('dev/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('jslibs:dev', function () {
    return gulp.src(['node_modules/svg4everybody/dist/svg4everybody.min.js', 'dev/js/libs/*.js'])
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('jslibs:build', function () {
    return gulp.src(['node_modules/svg4everybody/dist/svg4everybody.min.js', 'dev/js/libs/*.js'])
        .pipe(uglify())
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('images:dev', function () {
    return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif)')
        .pipe(gulp.dest('dist/images'));
});
gulp.task('images:build', function () {
    return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif)')
        .pipe(tinypng('3zO9dS3QVQA8MOwy0RW7GLXpqt912PdK'))
        .pipe(gulp.dest('dist/images'));
});
gulp.task('fonts', function () {
    return gulp.src('dev/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('svg-sprite', function () {
    return gulp.src('dev/images/*.svg')
        .pipe(svgo())
        .pipe(svgSprite({
                mode: {
                    symbol: {
                        sprite: "sprite.svg"
                    }
                }
            }
        ))
        .pipe(gulp.dest('dist/images'));
});
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
});
gulp.task('clean', function () {
    return del(['dist/**/*.*']);
});

gulp.task('watch', ['pug', 'sass:dev', 'js:dev', 'jslibs:dev', 'images:dev', 'browserSync'], function () {
    gulp.watch('dev/scss/**/*.scss', ['sass:dev']);
    gulp.watch('dev/**/*.pug', ['pug']);
    gulp.watch('dev/js/*.js', ['js:dev', 'jslibs:dev']);
    gulp.watch('dev/images/**/*.*)', ['images:dev']);
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['pug', 'sass:build', 'js:build', 'jslibs:build', 'images:build', 'browserSync'], function () {
    gulp.watch('dev/scss/**/*.scss', ['sass:build']);
    gulp.watch('dev/**/*.pug', ['pug']);
    gulp.watch('dev/js/*.js', ['js:build', 'jslibs:build']);
    gulp.watch('dev/images/**/*.*)', ['images:build']);
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
});