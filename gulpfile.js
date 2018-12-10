const gulp = require('gulp');
const htl = require('./index.js');

gulp.task('default', () =>
	gulp.src('src/**/*.html')
		.pipe(htl())
		.pipe(gulp.dest('compiled'))
);