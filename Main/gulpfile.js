var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require("gulp-minify");
var minifyCSS = require("gulp-csso");

gulp.task("js-scripts", function(){
	return gulp.src(["source/js/global.js", "source/js/*.js"])
		.pipe(minify({noSource: true}))
		.pipe(concat("scripts.min.js"))
		.pipe(gulp.dest("./dist"));
});


gulp.task("js-plugins", function(){
	return gulp.src(["source/js/plugins/jquery.min.js", "source/js/plugins/*.js"])
		.pipe(minify({noSource: true}))
		.pipe(concat("plugins.min.js"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("css-plugins", function() 
{
	return gulp.src(["source/css/plugins/bootstrap.min.css", "source/css/plugins/font-awesome.css", "source/css/plugins/plugin.css"])
		.pipe(minifyCSS())
		.pipe(concat("plugins-min.css"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("css-globals", function() 
{
	return gulp.src(["source/css/globals/main.css", "source/css/globals/dev.css", "source/css/globals/dtesb.css"])
		.pipe(minifyCSS())
		.pipe(concat("globals-min.css"))
		.pipe(gulp.dest("./dist"));
});


gulp.task("default", [  "js-scripts",  "js-plugins", "css-globals", "css-plugins" ]);