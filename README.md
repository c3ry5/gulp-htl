> HTL gulp plugin


## Install

```
$ npm install --save-dev gulp-htl
```


## Usage

```js
const gulp = require('gulp');
const rename = require('gulp-rename');
const htl = require('./index.js');

gulp.task('default', () =>
	gulp.src(['src/**/*.html', '!src/**/*.spec.html'])
		.pipe(htl())
		.pipe(rename({extname:'.spec.html'}))
		.pipe(gulp.dest('src'))
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
