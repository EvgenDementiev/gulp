var gulp         = require('gulp');                                               
var sass         = require('gulp-sass');                                          
var sourcemaps   = require('gulp-sourcemaps');                                    
var csso         = require('gulp-csso');                                          
var autoprefixer = require('gulp-autoprefixer');                                  
//var uncss        = require('gulp-uncss');                                       

var uglify       = require('gulp-uglify');                                        
var babel        = require('gulp-babel');                                         
var concat       = require('gulp-concat');                                        
var gulpif       = require('gulp-if');                                            

var imagemin     = require('gulp-imagemin');                                      
var htmlmin      = require('gulp-htmlmin');                                       

var plumber      = require('gulp-plumber');                                       
var clean        = require("gulp-clean");                                       
var size         = require('gulp-filesize');                                   
var sizereport   = require('gulp-sizereport');                                   

var browserSync  = require('browser-sync').create();                              




gulp.task('html', function () {
    console.log(' \n  ____  Работа HTML файлов  ____ \n');
    return gulp.src('./src/*.html')
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public'))                                               
        .pipe(size())
        .pipe(browserSync.stream());

});


gulp.task('sass', function () {                                                  
    console.log(' \n  ____  Работа СSS файлов  ____ \n');
    return gulp.src('src/styles/style.scss')                                     
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))      
        .pipe(autoprefixer( {browsers: ['last 5 versions'], }))                  
        .pipe(csso())                                                            
        //.pipe(uncss({ html: ['public/index.html'] }))
        .pipe(sourcemaps.write('../css/maps'))
        .pipe(gulp.dest('./public/css/'))                                        
        .pipe(browserSync.stream());
});

gulp.task('uncss-clean', function () {
    return gulp.src('src/styles/style.css')
        .pipe(uncss({
            html: ['public/index.html']
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
    console.log(' \n  ____  Работа JS файлов  ____ \n');
    return gulp.src('./src/js/*.js')
        .pipe(gulpif('*.js', babel({presets: ['env']})))
        .pipe(gulpif('*.js', uglify()))                                          
        .pipe(concat('min.js'))                                                  
        .pipe(gulp.dest('public/js/'))                                           
        .pipe(size())
        .pipe(browserSync.stream());
});

gulp.task('img', function() {
    console.log(' \n  ____  Работа IMAGES файлов  ____ \n');
    return gulp.src('./src/images/**/*.{jpg,jpeg,png,gif}')                      
        .pipe(imagemin([ imagemin.gifsicle({interlaced: true}),                  
                         imagemin.jpegtran({progressive: true}),
                         imagemin.optipng({optimizationLevel: 5}),
                         imagemin.svgo({ plugins: [ {removeViewBox: true}, {cleanupIDs: false} ] })
                       ]))
        .pipe(gulp.dest('public/images'))                                       
        .pipe(size())
        .pipe(browserSync.stream());
});


gulp.task('clean', function() {                        
    return gulp.src('./public')
       .pipe(clean());
});
gulp.task('sizereport', function () {                  
    return gulp.src('./public/**/*')
        .pipe(sizereport());
});



gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './public'
        },
        open: true
    });

gulp.watch('./src/*.html', ['html']);
gulp.watch('./src/*.js', ['js']);
gulp.watch('./src/styles/*.scss', ['sass']);
gulp.watch('./src/images/**/*', ['img']);

});

gulp.task('start', [
    'img',
    'html',
    'sass',
    'js',
    'browser-sync'
]);
