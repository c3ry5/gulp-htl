'use strict';

const through = require('through2');
const PluginError = require('plugin-error');
const utils = {
    htl: require('./utils/htl.js'),
    helpers: require('./utils/helpers.js')
};

module.exports = function (options) {
    options = options || {};
    return through.obj(function (file, enc, cb) {
        const _this = this;

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.path.indexOf('.html') <= 0 || file.path.indexOf('.spec.html') > 0) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new PluginError('gulp-htl', 'Streaming not supported'));
            return;
        }

        const split = file.path.split("/");
        const base = `${split.slice(0, split.length - 1).join("/")}/`;

        process.chdir(`${base}htlmock/`);

        const mockData = utils.htl.buildMockDataObject(`${base}htlmock/mock.json`);
        const templateFile = utils.htl.fixSlyInclude(file.path, base, mockData);
        const result = new utils.htl.compiler().includeRuntime(true).withRuntimeVar(Object.keys(mockData)).compileToString(templateFile);

        Promise.resolve(result).then(function (result) {
            utils.htl.render.call(_this, base, result, mockData, file, cb);
        }).catch(function () {
            console.error(arguments);
            cb(new PluginError('gulp-htl', 'get result failed'));

        });
    });
};