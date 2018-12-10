> HTL gulp plugin


## Install

```
$ npm install --save-dev gulp-htl
```


## Usage

```js
const gulp = require('gulp');
const htl = require('gulp-htl');

gulp.task('default', () =>
	gulp.src('src/**/*.html')
		.pipe(htl())
		.pipe(gulp.dest('dist'))
);
```

## API

### htl([options])

#### options

Type: `Object`

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## License

MIT © [Cerys Williams](c3ry5.co.uk)
