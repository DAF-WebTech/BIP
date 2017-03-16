var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require("gulp-minify");
gulp.task("js", function(){
	return gulp.src("source/js/*.js")
		.pipe(minify({noSource: true}))
		.pipe(concat("all.js"))
		.pipe(gulp.dest("./dist"));
});
gulp.task("default", [ "js" ]);