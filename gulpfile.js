var gulp = require('gulp'),
  watch = require('gulp-watch'),
  stripDebug = require('gulp-strip-debug'),
  minifyCss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  jade = require('gulp-jade'),
  uglify = require('gulp-uglify'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  bootstrap = require('bootstrap3-stylus'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  awspublish = require('gulp-awspublish'),
  browserSync = require('browser-sync').create(),
  inject = require('gulp-inject-string'),
  fs = require('fs'),
  argv = require('yargs').argv

var conf = {
  s3: {
    region: 'ap-southeast-1'
  },
  buildSrc: 'dist/**/*'
}
var dest = {
  base: 'dist'
}
var src = {
  base: 'src/'
}
var server = {
  port: 7474
}

src.view = src.base + 'views/**/*.jade'
src.script = src.base + 'scripts/**/*.js'
src.style = src.base + 'styles/**/*.styl'
src.image = src.base + 'images/**/*'
src.bower = 'bower_components/**/*'

dest.view = dest.base
dest.script = dest.base + '/scripts/'
dest.style = dest.base + '/styles/'
dest.image = dest.base + '/images/'
dest.bower = dest.base + '/bower_components/'

var serverTask = function () {
  connect.server({
    root: dest,
    port: server.port,
    fallback: 'index.html'
  })
}
var bowerTask = function () {
  return gulp.src(src.bower)
    .pipe(gulp.dest(dest.bower))
}
var viewTask = function () {
  return gulp.src(src.view)
    .pipe(jade())
    .pipe(gulp.dest(dest.view))
}
var styleTaskDev = function () {
  return gulp.src(src.style)
    .pipe(stylus({
      use: [nib(), bootstrap()]
    }))
    .pipe(gulp.dest(dest.style))
}
var scriptTaskDev = function () {
  return gulp.src(src.script)
    // .pipe(concat('default.js'))
    .pipe(gulp.dest(dest.script))
}
var imageTaskProd = function () {
  return gulp.src(src.image)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dest.image))
}
var imageTaskDev = function () {
  return gulp.src(src.image)
    .pipe(gulp.dest(dest.image))
}

/** build task **/
var buildTask = function () {
  return gulp.src(src.script)
    // .pipe(sourcemaps.init())
    // .pipe(concat('default.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.script))
    .on('end', function () {
      return gulp.src(src.style)
        .pipe(stylus({
          use: [nib(), bootstrap()]
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(dest.style))
    })
}
var devInjectTask = function () {
  gulp.src(src.loadScript)
    .pipe(gulp.dest(dest.script))
  gulp.src(src.loadStyle)
    .pipe(stylus({
      use: [nib(), bootstrap()]
    }))
    .pipe(gulp.dest(dest.style))
}
var deployTask = function () {
  var publisher = awspublish.create({
    params: {
      Bucket: argv.bucket
    },
    region: conf.s3.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' }
  return gulp.src(conf.buildSrc)
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
}

gulp.task('connect', serverTask)
gulp.task('bowerTask', bowerTask)
gulp.task('viewTask', viewTask)

gulp.task('styleTaskDev', styleTaskDev)

gulp.task('scriptTaskDev', scriptTaskDev)

gulp.task('imageTaskProd', imageTaskProd)
gulp.task('imageTaskDev', imageTaskDev)


gulp.task('watch', function () {
  gulp.watch(src.view, ['viewTask'])
  gulp.watch(src.script, ['scriptTaskDev'])
  gulp.watch(src.style, ['styleTaskDev'])
  gulp.watch(src.image, ['imageTaskDev'])
  gulp.watch(src.bower, ['bowerTask'])
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: dest.base,
      port: server.port
    }
  })
})
gulp.task('deployTask', deployTask)

gulp.task('default', ['watch', 'viewTask', 'scriptTaskDev', 'styleTaskDev', 'imageTaskDev', 'bowerTask', 'browserSync'])
gulp.task('build', ['viewTask', 'imageTaskProd', 'bowerTask'], function () {
  return buildTask()
})
