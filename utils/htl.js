const fs = require('fs');
const path = require('path');
const utils = {
    helpers: require('./helpers.js')
};
const defaultData = {
    properties: {},
    wcmmode: {},
    pageProperties: {},
    currentDesign: {}
};

module.exports = {
    ATTRIBUTE_DELAYED_RESOURCE: 'data-delayed-sly-resource', //gets converted to data-sly-resource AFTER the initial parsing
    compiler: require("@adobe/htlengine/src/compiler/Compiler"),
    fixSlyInclude: function(filePath, targetDir, mockData) {
        /* We manipulate data-sly-include into data-sly-resource until Adobe creates include support.
         * First we rename it to data-sly-resource and provide an absolute path, it later on gets added to the toCompile queue
         * The next time it will get compiled, we change data-slyresource into data-sly-resource and include the targeted component
         */
        templateFile = fs.readFileSync(filePath, "utf8");
        templateFile = templateFile.replace(this.ATTRIBUTE_DELAYED_RESOURCE, 'data-sly-resource');
        templateFile = utils.helpers.replaceAll(templateFile, /data-sly-include="([^\/]+)"/, '><div ' + this.ATTRIBUTE_DELAYED_RESOURCE + '="' + path.dirname(filePath) + '/$1"></div></sly><sly');
        templateFile = templateFile.replace(/data-sly-include="(.*\/(.*))"/, '><div ' + this.ATTRIBUTE_DELAYED_RESOURCE + '="' + targetDir + '/$1"></div></sly><sly');
        /* We restructure data-sly-resource=${@path=foo, resourceType=bar} into (and consider resourceType) data-sly-resource=full/path/to/bar
         * or substitute the mocked value until there is proper support for resourceType
         */
        templateFile = utils.helpers.replaceAll(templateFile, /data-sly-resource="\${.*resourceType='(.+\/(.+))'}"/, function(match, p1, p2) {
            if (mockData[p1] != null) {
                return 'data-sly-resource="' + mockData[p1] + '"';
            } else {
                return 'data-sly-resource="' + targetDir + p1 + '/' + p2 + '.html"'
            }
        });
        return templateFile;
    },
    render: function(base, res, mockData, file, cb) {
        let _this = this;
        let currentTemplateFilePath = base + '/htlmock/runtime.html';
        let pathArr = file.path.split(path.sep);

        fs.writeFile(currentTemplateFilePath, res, 'utf8', function(errors) {
            if (errors) {
                console.error(errors);
            } else {
                delete require.cache[require.resolve(currentTemplateFilePath)];
                let currentTemplate = require(currentTemplateFilePath);
                let result = currentTemplate.main(mockData).then(function(result) {
                    fs.unlinkSync(currentTemplateFilePath);

                    file.contents = Buffer.from(result.body);
                    _this.push(file);
                    cb()
                }, function() {
                    console.log(arguments);
                });
            }
        });

    },
    buildMockDataObject: function(mockFilePath) {
        if (fs.existsSync(mockFilePath)) {
            let mockDataContent = fs.readFileSync(mockFilePath, "utf8");
            let mockData = JSON.parse(mockDataContent);
            let baseData = Object.assign({}, defaultData);
            return Object.assign(baseData, mockData);
        } else {
            return defaultData;
        }
    }
};