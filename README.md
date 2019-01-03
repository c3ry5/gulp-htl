> HTL gulp plugin


## Install

```
$ npm install --save-dev gulp-htl
```


## Usage

```js
const gulp = require('gulp');
const rename = require('gulp-rename');
const htl = require('gulp-htl');

gulp.task('default', () =>
	gulp.src(['src/**/*.html', '!src/**/*.spec.html'])
		.pipe(htl())
		.pipe(rename({extname:'.spec.html'}))
		.pipe(gulp.dest('src'))
);
```

## License

MIT © [Cerys Williams](https://www.c3ry5.co.uk)
