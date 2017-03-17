var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require("gulp-minify");

gulp.task("js", function(){
	return gulp.src(["source/js/*.js", "!source/js/*.min.js"])
		.pipe(minify({noSource: true}))
		.pipe(concat("scripts.min.js"))
		.pipe(gulp.dest("./dist"));
});


gulp.task("default", [ "js" ]);