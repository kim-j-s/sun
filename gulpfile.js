// http://webclub.tistory.com/467

// Modules 호출 
var gulp = require('gulp'); 

// Gulp 의 concat 패키지 모듈 호출 
var concat = require('gulp-concat');	// npm install --save-dev gulp-concat
var count = require('gulp-count');	    //변환되는 파일수 확인 Module 추가 설치필요 npm install --save-dev gulp-count
var uglify = require('gulp-uglify');	// 최적화 기능 플러그인 호출 (공백 및 주석을 제거)	npm install --save-dev gulp-uglify
var rename = require('gulp-rename');	// 변경된 파일명을 생성  npm install --save-dev gulp-rename
var browserSync = require('browser-sync').create();		// 변경된 파일 감지 후 동기화 - localhost
var fileinclude = require('gulp-file-include');	// include 확장자
var cache = require('gulp-cache');	// 브라우져 캐시 지우기
var FileCache = require("gulp-file-cache");		// 변경된 파일만 선택하여 수정
var fileCache = new FileCache();
var bust = require('gulp-buster');	// 브라우져 케시 삭제 npm install --save-dev gulp-buster
var ext_replace = require('gulp-ext-replace');	// 확장자 변환
var fileSync = require('gulp-file-sync');	// 파일 싱크
var fsync = require('gulp-files-sync');

// 바라볼 경로를 변수화 지정
var src = 'src/';
var dest = 'dest/';

// error log
function  errorLog(error) {
	console.error.bind(console);
	this.emit('end');
}

gulp.task('html', function() {
	return gulp
		.src(['src/**/*.html', '!src/include/*.html', '!src/base.html'])
		.pipe(fileinclude ({
			prefix : '@@',
			basepath : 'src/'
		}))
		.pipe(gulp.dest('dest/'))
		.pipe(browserSync.reload(
			{stream: true}
		));
});

gulp.task('html_run', function() {
	return gulp
		.src(['src/**/*.html', '!src/include/*.html', '!src/base.html'])
		.pipe(fileinclude ({
			prefix : '@@',
			basepath : 'src/'
		}))
		.pipe(fileCache.filter())
		.pipe(fileCache.cache())
		.pipe(gulp.dest('dest/'))
		.pipe(browserSync.reload(
			{stream: true}
		));
});

gulp.task('style', function() {
	return gulp
		.src(['src/**/*.css'])
		.pipe(gulp.dest('dest/'))
		.pipe(browserSync.reload(
			{stream: true}
		));
});

gulp.task('style_run', function() {
	return gulp
		.src(['src/**/*.css'])
		.pipe(fileCache.filter())
		.pipe(fileCache.cache())
		.pipe(gulp.dest('dest/'))
		.pipe(browserSync.reload(
			{stream: true}
		));
});

gulp.task('images', function() {
	return gulp
		.src(['src/**/*.+(jpg|png)'])
		.on('error', errorLog)
		.pipe(gulp.dest('dest/'))
		.pipe(browserSync.reload(
			{stream: true}
		));
});

gulp.task('script', function() {
	return gulp
		.src(['src/**/*.js'])
		.pipe(gulp.dest('dest/'))
		.pipe(browserSync.reload(
			{stream: true}
		));
});


gulp.task('sync', function() {
	gulp.watch(['src/**/*.*', '!src/include/*.html'], function() {
		fileSync('src/', 'dest/', {
			recursive: true
		});
	});
});


//gulp.task('sync', function() {
//	gulp.src('src/**/*.*')
//		.pipe(fsync(['src/**'], 'dest'));
//});

gulp.task('browserSync', function() {
	browserSync.init({
		server : {
			baseDir : 'dest/',
			index : "index.html"
		},
		browser: ["google-chrome", "firefox"]
	});
	//gulp.watch('src/**/*.html', ['html_run']);
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/**/*.css', ['style_run']);
	gulp.watch('src/**/*.+(jpg|png)', ['images']);
	gulp.watch('src/**/*.js', ['script']);
	
});

gulp.task('default', ['sync', 'html', 'style', 'images', 'script', 'browserSync']);