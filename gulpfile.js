const { src, dest, watch, parallel, series } = require("gulp");
const sass           = require("gulp-sass");
const browserSync    = require("browser-sync");
const autoprefixer   = require("gulp-autoprefixer");
const cleancss       = require("gulp-clean-css");
const cwebp          = require("gulp-cwebp");
const svgo           = require('gulp-svgo');
const imagemin       = require('gulp-imagemin');
const newer          = require("gulp-newer");
const del            = require("del");
const htmlmin        = require("gulp-htmlmin");
const copy           = require("gulp-copy");
const uglify         = require("gulp-uglify");







function styles() {
  return src("app/sass/app.scss")
        .pipe(sass())
        .pipe(autoprefixer( { overrideBrowserlist: ["last 15 versions"]} ))
        .pipe(cleancss())
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream())
}


function browsersync() {
  browserSync.init( {
    server: {
      baseDir: "dist/"
    },
    notify: false,
    online: true,
  } )
}

function startwatch() {
  watch("app/sass/**/*.scss", styles);
  watch("app/**/*.html", html);
  watch("dist/**/*.html").on("change", browserSync.reload);
  watch("app/images", series(img, svg));
  watch(["dist/images/*.jpg", "dist/images/*.png"], webp);
  watch("app/js", js);
}

function svg(done) {
  return src("app/images/*.svg")
    .pipe(svgo())
    .pipe(dest("dist/images"));
  done();
}

function html(done) {
  return src("app/**/*.html")
      .pipe(copy("dist/", {prefix: 1}))
      .pipe(dest("dist/"));
  done();
}

function webp(done) {
  src(["app/images/*.jpg", "app/images/*.png"])
    .pipe(cwebp())
    .pipe(dest("dist/images"));
  done();
}

function img(done) {
  src(["app/images/*.jpg", "app/images/*.png"])
    .pipe(newer("dist/images"))
    .pipe(imagemin())
    .pipe(dest("dist/images"));
    done();
}

function js(done) {
  return src("app/js/*.js")
        .pipe(uglify())
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
        done()
}

function clear(done) {
  del("dist/*");
  done();
}

function fonts(done) {
  return src("app/fonts/*")
    .pipe(copy("dist/fonts", { prefix: 2 }))
    .pipe(dest("dist/fonts"));
  done()
}

exports.build      = series(clear, svg, img, fonts, html, js, styles, webp)
exports.default    = parallel(webp, browsersync, startwatch);
exports.clear      = clear;
exports.fonts      = fonts;
