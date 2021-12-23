const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const del = require("del");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}
function cleanDist() {
  return del("dist");
}
function images() {
  return src("app/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
}

function conversion() {
  return src("app/scss/style.scss")
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}
function sripts() {
  return src(["node_modules/jquery/dist/jquery.js", "app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}
function build() {
  return src(
    [
      "app/css/style.min.css",
      "app/fonts/**/*",
      "app/js/main.min.js",
      "app/**/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss"], conversion);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], sripts);
  watch(["app/**/*.html"]).on("change", browserSync.reload);
}

exports.conversion = conversion;
exports.watching = watching;
exports.browsersync = browsersync;
exports.sripts = sripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(conversion, browsersync, watching, sripts);
