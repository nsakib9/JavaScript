// variable section
const {
    dest,
    series,
    src,
    watch
} = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const browsersync = require("browser-sync").create()
const concat = require("gulp-concat")
const del = require("del")
const nunjucksRender = require("gulp-nunjucks-render")
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
//custom img
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache');


const dist = "dist/"
const source = "src/"

const css = { in: source + "sass/**/*.scss",
    out: dist + "css/",
    sassOpts: {
        outputStyle: "compressed",
        errLogToConsole: true
    },
    autoprefixerOpts: {
        browsers: ['last 2 versions', '> 2%']
    },
    watch: source + "sass/**/*"
}

const js = { in: source + "scripts/**/*.js",
    out: dist + "js/",
    watch: source + "scripts/**/*"
}

//cutom for picture
const pic = { in: source + "images/*",
    out: dist + "images/",
    watch: source + "images/*"
}

//custom fonts copy
const fon = { in: source + "fonts/*",
    out: dist + "fonts/",
    watch: source + "fonts/*"
}

//custom folder copy
const fold = { in: source + "assets/css/*",
    out: dist + "css/",
    watch: source + "assets/css/*"
}

const nunjuck = { in: source + "pages/**/*.html",
    out: dist,
    path: source + "templates",
    watch: [source + "pages/**/*.html", source + "templates"]
}

const syncOpts = {
    server: {
        baseDir: dist,
        index: "index.html"
    },
    open: true,
    notify: true
}


// task section

/*------- Clean Task -------*/
function clean(cb) {
    del([dist + "*"])
    cb()
}
/*------- Clean Task -------*/

/*------- Style Task -------*/
function style(cb) {
    src(css.in)
        .pipe(sourcemaps.init())
        .pipe(sass(css.sassOpts))
        .pipe(autoprefixer(css.autoprefixerOpts))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(css.out))
    watch(css.watch, series(style, browsersync.reload))
    cb()
}
/*------- Style Task -------*/


/*------- Script Task -------*/
function script(cb) {
    src(js.in)
        .pipe(sourcemaps.init())
      //  .pipe(concat("app.js")) //Will make all seperate file.
        .pipe(sourcemaps.write("."))
        .pipe(dest(js.out))
    watch(js.watch, series(script, browsersync.reload))
    cb()
}
/*------- Script Task -------*/

/*------- HTML Task -------*/
function html(cb) {
    src(nunjuck.in)
        .pipe(
            nunjucksRender({
                path: nunjuck.path
            })
        )
        .pipe(dest(nunjuck.out))
    watch(nunjuck.watch, series(html, browsersync.reload))
    cb()
}
/*------- HTML Task -------*/

/*------- Browser Sync Task -------*/
function bSync(cb) {
    browsersync.init(syncOpts)
    cb()
}
/*------- Browser Sync Task -------*/

/* for image custom codes. Add cache */
function img(cb) {
        src(pic.in)
		//.pipe(imagemin())
		.pipe(cache(imagemin({
		  interlaced: true
		 })))
        .pipe(dest(pic.out))
    watch(pic.watch, series(img, browsersync.reload))
    cb()
}
/* for image custom codes */

/* custom fonts under.
Can use it to copy folder no plugin needed*/
function fonts(cb) {
        src(fon.in)
        .pipe(dest(fon.out))
    watch(fon.watch, series(fonts, browsersync.reload))
    cb()
}

function assets(cb) {
        src(fold.in)
        .pipe(dest(fold.out))
    watch(fold.watch, series(assets, browsersync.reload))
    cb()
}
/* custom fonts above*/

/*------- Default Task -------*/
exports.default = series(clean, style, script, html, bSync, img,fonts, assets)
