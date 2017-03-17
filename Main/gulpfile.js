var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require("gulp-minify");

gulp.task("js-scripts", function(){
	return gulp.src(["source/js/global.js", "source/js/*.js", "!source/js/modernizr.js"])
		.pipe(minify({noSource: true}))
		.pipe(concat("scripts.min.js"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("js-modernizr", function(){
	return gulp.src("source/js/modernizr.js")
		.pipe(minify({noSource: true}))
		.pipe(gulp.dest("./dist"));
});

gulp.task("js-plugins", function(){
	return gulp.src(["source/js/plugins/jquery.min.js", "source/js/plugins/*.js"])
		.pipe(minify({noSource: true}))
		.pipe(concat("plugins.min.js"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("default", [ "js-scripts", "js-modernizr", "js-plugins" ]);