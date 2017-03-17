var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require("gulp-minify");

gulp.task("js-scripts", function(){
	return gulp.src(["source/js/*.js", "!source/js/*.min.js"])
		.pipe(minify({noSource: true}))
		.pipe(concat("scripts.min.js"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("js-modernizr", function(){
	return gulp.src("source/js/modernizr.js")
		.pipe(minify({noSource: true}))
		.pipe(gulp.dest("./dist"));
});

gulp.task("default", [ "js-scripts", "js-modernizr" ]);