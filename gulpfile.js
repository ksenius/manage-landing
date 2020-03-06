'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const gp = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const postcssPresetEnv = require('postcss-preset-env');
const postcssNormalize = require('postcss-normalize');
const cssnano = require('cssnano');
const del = require('del');
const argv = require('yargs').argv;

const production = !!argv.production;

const paths = {
  html: {
    src: './src/*.html',
    dest: './build'
  },
  scss: {
    src: './src/scss/**/*.scss',
    dest: './build/css'
  },
  js: {
    src: './src/js/*.js',
    dest: './build/js'
  },
  images: {
    src: './src/images/*.*',
    dest: './build/images'
  },
  icons: {
    src: './src/images/icons/*.svg'
  }
}

function clean() {
  return del(['./build/*']);
}

function htmlTask() {
  return src(paths.html.src)
    .pipe(gp.if(production, gp.removeEmptyLines({
      removeComments: true
    })))
    .pipe(gp.if(production, gp.replace('.css', '.min.css')))
    .pipe(gp.if(production, gp.replace('main.js', 'main.min.js')))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function scssTask() {
  let postcssPlugins = [
    postcssNormalize(),
    postcssPresetEnv({
      autoprefixer: { grid: true }
    })
  ];

  if (production) postcssPlugins.push(cssnano());

  return src(paths.scss.src)
    .pipe(gp.sourcemaps.init())
    .pipe(gp.sass({
      includePaths: ['node_modules']
    }))
    .pipe(gp.postcss(postcssPlugins))
    .pipe(gp.if(production, gp.rename({
      suffix: '.min'
    })))
    .pipe(gp.sourcemaps.write('./'))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src(paths.js.src, {
      allowEmpty: true
    })
    .pipe(gp.sourcemaps.init())
    .pipe(gp.babel({
      presets: ['@babel/env']
    }))
    .pipe(gp.if(production, gp.uglify()))
    .pipe(gp.if(production, gp.rename({
      suffix: '.min'
    })))
    .pipe(gp.sourcemaps.write('./'))
    .pipe(dest(paths.js.dest))
    .on('end', browserSync.reload);
}

function jsLibsTask() {
  return src([
    'node_modules/@glidejs/glide/dist/glide.min.js',
    'node_modules/svgxuse/svgxuse.min.js'
  ])
    .pipe(gp.concat('vendor.min.js'))
    .pipe(dest(paths.js.dest));
}

function imagesTask() {
  return src(paths.images.src)
    .pipe(dest(paths.images.dest))
    .on('end', browserSync.reload);
}

function spriteTask() {
  return src(paths.icons.src)
    .pipe(gp.imagemin([
      gp.imagemin.svgo({
        plugins: [
          {
            removeAttrs: {
              attrs: 'path:fill'
            }
          }
        ]
      })
    ]))
    .pipe(gp.svgSprite({
      mode: {
        symbol: {
          sprite: '../icons.svg'
        }
      }
    }))
    .pipe(dest(paths.images.dest))
    .on('end', browserSync.reload);
}

function watchTask() {
  watch(paths.html.src, htmlTask);
  watch(paths.scss.src, scssTask);
  watch(paths.js.src, jsTask);
  watch(paths.images.src, imagesTask);
  watch(paths.icons.src, spriteTask);
}

function syncTask() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
}

exports.default = series(clean,
  parallel(
    htmlTask, scssTask, jsLibsTask, jsTask, imagesTask, spriteTask
  ),
  parallel(watchTask, syncTask)
);

exports.prod = series(clean,
  series(
    htmlTask, scssTask, jsLibsTask, jsTask, imagesTask, spriteTask
  )
);
