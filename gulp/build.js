'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

// function handleError(err) {
//   console.error(err.toString());
//   this.emit('end');
// }

// gulp.task('less', function () {
//   return gulp.src('src/{app,components}/**/*.less')
//     .pipe($.plumber())
//     .pipe($.less())
//     .on('error', handleError)
//     .pipe($.autoprefixer('last 1 version'))
//     .pipe(gulp.dest('.tmp'))
//     .pipe($.size());
// });

// gulp.task('styles',  function () {
//   return gulp.src('src/{app,components}/**/*.scss')
//     .pipe($.plumber())
//     .pipe($.sass({style: 'expanded'}))
//     .on('error', handleError)
//     .pipe($.autoprefixer('last 1 version'))
//     .pipe(gulp.dest('.tmp'))
//     .pipe($.size());
// });

// gulp.task('scripts', function () {
//   return gulp.src('src/**/*.js')
//     .pipe($.plumber())
//     // .pipe($.jshint())
//     // .pipe($.jshint.reporter('jshint-stylish'))
//     .pipe($.size());
// });

gulp.task('scripts', function () {
  return gulp.src('src/{.,!node_modules}/**/*.js')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/'))
    .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src(['src/{partials,!node_modules}/**/*.html'])
    .pipe($.plumber())
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'multiSigWeb'
    }))
    .pipe(gulp.dest('.tmp/'))
    .pipe($.size());
});

gulp.task('html', ['scripts', 'partials'], function () {
  var htmlFilter = $.filter('*.html', {
    restore: true
  });
  var jsFilter = $.filter('**/*.js', {
    restore: true
  });
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });
  var notIndexFilter = $.filter(['**/*', '!**/index.html'], {
    restore: true
  });

  return gulp.src('src/index.html')
    .pipe($.plumber())
    .pipe($.inject(gulp.src('.tmp/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))
    // .pipe($.rev())
    .pipe($.useref({
      // newLine: ";;"
    }))
    .pipe(jsFilter)
    // .pipe($.ngAnnotate())
    // .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    // .pipe($.cssRebaseUrls())
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(notIndexFilter)
    .pipe($.rev())                // Rename the concatenated files
    .pipe(notIndexFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*')
    .pipe($.plumber())
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
    .pipe($.size());
});

// gulp.task('fontawesome', function () {
//   return gulp.src([
//       'node_modules/font-awesome/fonts/fontawesome-webfont.*'
//     ])
//     .pipe(gulp.dest('dist/fonts/'))
//     .pipe($.size());
// });

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe($.plumber())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('misc', function () {
  return gulp.src('src/**/*.ico')
    .pipe($.plumber())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('clear', function (done) {
  return $.cache.clearAll(done);
});

var del = require('del');
gulp.task('clean', ['clear'], function (done) {
  return del(['.tmp', 'dist/*'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc'], function (done) {
  return;
});