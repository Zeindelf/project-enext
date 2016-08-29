const gulp       = require('gulp')
const pug        = require('gulp-pug')
const sass       = require('gulp-sass')
const prefixer   = require('gulp-autoprefixer')
const uglify     = require('gulp-uglify')
const connect    = require('gulp-connect')
const browserify = require('browserify')
const babelify   = require('babelify')
const source     = require('vinyl-source-stream')
const buffer     = require('vinyl-buffer')

gulp.task('connect', () => {
    connect.server({
        root: './dist/',
        livereload: true
    })
})

gulp.task('scripts', () => {
    return browserify('./src/js/main.js')
    .transform(babelify).bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js/'))
    .pipe(connect.reload())
})

gulp.task('styles', () => {
    return gulp.src('./src/scss/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(prefixer({ versions: ['last 3 browsers'] }))
    .pipe(gulp.dest('./dist/assets/css/'))
    .pipe(connect.reload())
})

gulp.task('pug', () => {
    return gulp.src('./src/pug/*.pug')
    // .pipe(pug({ pretty: true }))
    .pipe(pug())
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload())
})

gulp.task('fonts', () => {
    return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/assets/fonts/'))
})

gulp.task('products', () => {
    return gulp.src('./src/products/*')
    .pipe(gulp.dest('./dist/products/'))
})

gulp.task('images', () => {
    return gulp.src('./src/images/*')
    .pipe(gulp.dest('./dist/assets/images/'))
})

gulp.task('json', () => {
    return gulp.src('./potions.json')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('copy', ['fonts', 'products', 'images', 'json'])

gulp.task('watch', () => {
    gulp.watch('./src/js/**/*.js', ['scripts'])
    gulp.watch('./src/scss/**/*.scss', ['styles'])
    gulp.watch('./src/pug/**/*.pug', ['pug'])
})

gulp.task('default', ['scripts', 'styles', 'pug', 'copy', 'connect', 'watch'])
