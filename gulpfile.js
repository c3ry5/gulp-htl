const gulp = require('gulp');
const rename = require('gulp-rename');
const htl = require('./index.js');

gulp.task('default', () =>
	gulp.src(['src/**/*.html', '!src/**/*.spec.html'])
		.pipe(htl())
		.pipe(rename({extname:'.spec.html'}))
		.pipe(gulp.dest('src'))
);
gulp.task('watch', () => {
	gulp.watch(['src/**/*.html', 'src/**/htlmock/*', '!src/**/*.spec.html'], ['default']); 
});