const fs = require('fs');
const path = require('path');
const utils = {
    helpers: require('./helpers.js')
};

module.exports = {
    ATTRIBUTE_DELAYED_RESOURCE: 'data-delayed-sly-resource', //gets converted to data-sly-resource AFTER the initial parsing
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
    }
};