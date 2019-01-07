> HTL gulp plugin

[![NPM](https://nodei.co/npm/gulp-htl.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-htl/)

![sonarcloud.io status](https://sonarcloud.io/api/project_badges/measure?project=c3ry5_gulp-htl&metric=alert_status)

## Install

```
$ npm install --save-dev gulp
$ npm install --save-dev gulp-htl
```

For the example below you'll also need 

```
$ npm install --save-dev gulp-rename
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

## Thanks 

Thanks to [LatourJ](https://github.com/LatourJ) for working out some of the quirks the HTL compiler in their [project](https://github.com/LatourJ/mass-htl)

## License

MIT © [Cerys Williams](https://www.c3ry5.com)
