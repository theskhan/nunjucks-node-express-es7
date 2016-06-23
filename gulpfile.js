'use strict';

const
    path = require('path'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    changed = require('gulp-changed'),
    del = require('del'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    rev = require('gulp-rev'),
    jshint = require('gulp-jshint'),
    revCollector = require('gulp-rev-collector'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    nunjucks = require('gulp-nunjucks');

const
    paths = {
        fontsSrc: 'src/fonts/',
        htmlSrc: 'src/views/',
        sassSrc: 'src/sass/',
        cssSrc: 'src/css/',
        jsSrc: 'src/js/',
        imgSrc: 'src/images/',

        buildDir: 'build/',
        revDir: 'build/rev/',
        distDir: 'dist/'
    };

let vendor_libs = [
    './node_modules/babel-polyfill/dist/polyfill.min.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/nunjucks/browser/nunjucks-slim.min.js'
];

var onError = function (err) {
    gutil.beep();
    gutil.log(gutil.colors.green(err));
},
    nodemonServerInit = function (script) {
        livereload.listen();
        nodemon({
            script: script,
            ext: 'js'
        }).on('restart', function () {
            gulp.src(script)
                .pipe(livereload())
                .pipe(notify('Reloading page, please wait...'));
        })
    };

if (process.env.NODE_ENV === 'production') {
    console.log('Running prod task');
    gulp.task('default', ['dist']);
} else {
    gulp.task('default', ['build', 'watch']);
}

gulp.task('clean', function (cb) {
    del([paths.buildDir, paths.distDir], cb);
});

gulp.task('build', ['build-html', 'build-css', 'build-js', 'build-images', 'build-favicon', 'build-fonts'], function (cb) {
    nodemonServerInit(paths.buildDir + 'index.js');
});

gulp.task('dist', ['dist-html', 'dist-templates', 'dist-js', 'dist-css', 'dist-images', 'dist-favicon', 'dist-fonts'], function (cb) {
    //nodemonServerInit(paths.distDir + 'index.js');
    console.log('Assets built successfully.');
});

/*
HTML Tasks
*/
gulp.task('build-html', ['build-templates'], function () {
    return gulp.src(paths.htmlSrc + '**/*.html')
        .pipe(gulp.dest(paths.buildDir + 'views/'));
});

gulp.task('dist-html', ['build-html', 'dist-js', 'dist-css', 'dist-images'], function () {
    return gulp.src([
        paths.revDir + "**/*.json",
        paths.buildDir + 'views/' + "**/*.html"
    ])
        .pipe(revCollector())
        .pipe(minifyHtml({
            conditionals: true,
            quotes: true
        }))
        .pipe(gulp.dest(paths.distDir + 'views'));
});

gulp.task('build-templates', function () {
    return gulp.src(paths.htmlSrc + '**/*.html')
        .pipe(nunjucks.precompile({
            name: function (file) {
                let urlPath = path.dirname(file.relative) + "/" + path.basename(file.relative);
                if (urlPath.indexOf('./') !== -1) {
                    urlPath = urlPath.replace('./', '');
                }
                return urlPath;
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(paths.buildDir))
        .pipe(livereload());
});

gulp.task('dist-templates', function () {
    return gulp.src(paths.htmlSrc + '**/*.html')
        .pipe(nunjucks.precompile({
            name: function (file) {
                let urlPath = path.dirname(file.relative) + "/" + path.basename(file.relative);
                if (urlPath.indexOf('./') !== -1) {
                    urlPath = urlPath.replace('./', '');
                }
                return urlPath;
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(paths.distDir));
});

/*
	CSS tasks
*/
gulp.task('build-css', ['css', 'sass']);

gulp.task('css', function () {
    return gulp.src(paths.cssSrc + '**/*.+(css|map)')
        .pipe(gulp.dest(paths.buildDir + 'css/'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src(paths.sassSrc + '**/*.scss')
        .pipe(sass({
            includePaths: require('node-neat').includePaths,
            style: 'nested',
            onError: function () {
                console.log("Error in scss");
            }
        }))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(paths.buildDir + 'css/'))
        .pipe(livereload());
});

gulp.task('dist-css', ['build-css', 'dist-images'], function () {
    return gulp.src([
        paths.buildDir + 'css/*',
        paths.revDir + "images/*.json"
    ])
        .pipe(revCollector())
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest(paths.distDir + 'css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.revDir + 'css'));
});

gulp.task('build-fonts', [], function () {
    return gulp.src(paths.fontsSrc + '**/*.*')
        .pipe(gulp.dest(paths.buildDir + 'fonts/'))
        .pipe(livereload());
});

gulp.task('dist-fonts', ['build-fonts'], function () {
    return gulp.src('build/fonts/*')
        .pipe(gulp.dest(paths.distDir + "/fonts/"));
});

/*
JS Tasks
*/
gulp.task('build-js', ['js', 'build-vendor-libs', 'js-plugins', 'build-index-js', 'build-route-js']);

gulp.task('js', function () {
    return gulp.src(paths.jsSrc + '*.+(js|map)')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(changed(paths.buildDir + 'js/'))
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.buildDir + 'js/'))
        .pipe(livereload());
});

gulp.task('build-vendor-libs', function () {
    return gulp.src(vendor_libs)
        .pipe(concat('vendor_libs.js'))
        .pipe(gulp.dest(paths.buildDir + 'js/'))
        .pipe(livereload());
});

gulp.task('build-index-js', function () {
    return gulp.src('src/index.js')
        .pipe(babel())
        .pipe(gulp.dest(paths.buildDir))
        .pipe(livereload());
});

gulp.task('build-route-js', function () {
    return gulp.src('src/routes/*')
        .pipe(babel())
        .pipe(gulp.dest(paths.buildDir + 'routes'))
        .pipe(livereload());
});

gulp.task('dist-index-js', function () {
    return gulp.src('src/index.js')
        .pipe(babel())
        .pipe(gulp.dest(paths.distDir))
        .pipe(livereload());
});

gulp.task('dist-route-js', function () {
    return gulp.src('src/routes/*')
        .pipe(babel())
        .pipe(gulp.dest(paths.distDir + 'routes'))
        .pipe(livereload());
});

gulp.task('js-plugins', [], function () {
    return gulp.src([
        'src/lib/*.js'
    ])
        .pipe(concat('vendor_plugins.js'))
        .pipe(gulp.dest(paths.buildDir + 'js/'))
        .pipe(livereload());
});

gulp.task('dist-vendor-libs', function () {
    return gulp.src(vendor_libs)
        .pipe(concat('vendor_libs.js'))
        .pipe(gulp.dest(paths.distDir + 'js/'))
        .pipe(livereload());
});

gulp.task('dist-js', ['build-js', 'dist-vendor-libs', 'dist-index-js', 'dist-route-js'], function () {
    return gulp.src(paths.buildDir + 'js/*')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.distDir + 'js'))

        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.revDir + 'js'));
});

/*
Image Tasks
*/
gulp.task('build-images', function () {
    return gulp.src(paths.imgSrc + '**/*.+(png|jpeg|jpg|gif|svg|eps)')
        .pipe(changed(paths.buildDir + 'images'))
        .pipe(gulp.dest(paths.buildDir + 'images'))
        .pipe(livereload());
});

gulp.task('dist-images', ['build-images'], function () {
    return gulp.src(paths.buildDir + 'images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(paths.distDir + 'images'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.revDir + 'images'));
});

gulp.task('build-favicon', function () {
    return gulp.src('src/favicon.ico')
        .pipe(changed(paths.buildDir))
        .pipe(gulp.dest(paths.buildDir))
        .pipe(livereload());
});

gulp.task('dist-favicon', ['build-favicon'], function () {
    return gulp.src(paths.buildDir + 'favicon.ico')
        .pipe(changed(paths.distDir))
        .pipe(gulp.dest(paths.distDir));
});

gulp.task('watch', function () {
    gulp.watch(['src/views/**/*.html'], ['build-html']);
    gulp.watch('src/sass/**', ['sass']);
    gulp.watch(paths.jsSrc + '**/*.js', ['js']);
    gulp.watch('src/lib/**' + '**/*.js', ['js-plugins']);
    gulp.watch(paths.imgSrc + '**/*.+(png|jpeg|jpg|gif|svg)', ['build-images']);
});