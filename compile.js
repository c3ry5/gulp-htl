const fs = require('fs');
const path = require('path');
const async = require('async');
const Compiler = require("@adobe/htlengine/src/compiler/Compiler");
const baseFileExt = '.html'
const utils = {
    directory: require('./utils/directory.js'),
    files: require('./utils/files.js'),
    htl: require('./utils/htl.js'),
    helpers: require('./utils/helpers.js')
};
const defaultData = {
    properties: {},
    wcmmode: {},
    pageProperties: {},
    currentDesign: {}
};
const sourceDir = '../src';
const folders = {
    base: path.resolve('.'),
    source: path.isAbsolute(sourceDir) ? sourceDir : path.resolve(sourceDir)
};

let unfilteredHtmlFiles = utils.directory.findFilesInDir(folders.source, baseFileExt);

let templatesFilePaths = [];

for (let filePath of unfilteredHtmlFiles) {
    let mockPath = `${path.dirname(filePath)}/htlmock`;
    if (fs.existsSync(mockPath) && fs.lstatSync(mockPath).isDirectory()) {
        templatesFilePaths.push(filePath);
    }
}

console.log(`Start compiling HTL files: \n\r  ${templatesFilePaths.join('\n\r  ')}`);

let templatesToCompile = [];
let filesCompiledCount = 0;

function buildMockDataObject(mockFilePath) {
    if (fs.existsSync(mockFilePath)) {
        let mockDataContent = fs.readFileSync(mockFilePath, "utf8");
        let mockData = JSON.parse(mockDataContent);
        let baseData = Object.assign({}, defaultData);
        return Object.assign(baseData, mockData);
    } else {
        return defaultData;
    }
}

function renderSpec(filePath) {
    console.log(`successfully created ${filePath}`);
    if (templatesToCompile.length > 0) {
        const lastTime = Date.now();
        const mockPath = `${path.dirname(filePath)}/htlmock`;

        let mergedMockData = buildMockDataObject(mockPath + '/mock.json')

		process.chdir(mockPath);

        let templateFile = utils.htl.fixSlyInclude(filePath, folders.source, mergedMockData);
		let result = new Compiler().includeRuntime(true).withRuntimeVar(Object.keys(mergedMockData)).compileToString(templateFile);


		try {
			let currentTemplateFilePath = path.dirname(filePath) + '/htlmock/' + path.basename(filePath) + '.' + (filesCompiledCount++);

			fs.writeFile(currentTemplateFilePath, result, 'utf8', function(errors) {
				if (errors) {
					console.error(errors);
				} else {
					delete require.cache[require.resolve(currentTemplateFilePath)];
					let currentTemplate = require(currentTemplateFilePath);
                    let result = currentTemplate.main(mergedMockData).then(function(result) {
                        console.log(result.body);
                        writeFile(filePath, result.body, lastTime)
                    }, function(){
                    	console.log(arguments);
                    });
				}
			});
		}
		catch(e) {
			console.error('An error occurred while compiling ' + filePath, e);
		}


    }
}


   function writeFile(targetFilePath, contents, lastTime) {
        // process.chdir(originalDir);
        fs.writeFile(targetFilePath, contents, 'utf8', function(errors) {
            if (errors) {
                console.error('write errors: ', errors);
            }
            console.log(targetFilePath + '... ' + (Date.now() - lastTime) + 'ms');
            //if we find a delayed resource, add this file to the toCompile queue so it can load the resource after the initial parsing
            if (contents.indexOf(utils.htl.ATTRIBUTE_DELAYED_RESOURCE) !== -1) {
                templatesToCompile.push(targetFilePath);
            }
        });
    }

for (let templateFile of templatesFilePaths) {

	console.log(templatesFilePaths);
	console.log(templateFile);

    let models = utils.directory.findFilesInDir(`${path.dirname(templateFile)}/htlmock`, '');
    for (let j = 0; j < models.length; j++) {
        setTimeout(function(){
	        utils.files.createSpecFile(models[j], renderSpec);
		},3000);        
    }

    let targetFile = utils.files.createSpecFile(templateFile, renderSpec);
    templatesToCompile.push(targetFile);
}