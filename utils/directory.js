const fs = require('fs');
const path = require('path');
module.exports = {
    findFilesInDir: function(startPath, filter, exclude) {
        var _this = this;
        var results = [];
        if (!filter) {
            filter = '.html';
        }
        if(!exclude) {
            exclude = '.spec';
        }
        if (!fs.existsSync(startPath)) {
            console.error("no dir ", startPath);
            return;
        }
        var files = fs.readdirSync(startPath);
        for (var i = 0; i < files.length; i++) {
            if(files[i].indexOf(exclude) <= 0) {
                var filename = path.join(startPath, files[i]);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    results = results.concat(_this.findFilesInDir(filename, filter)); //recurse
                } else if (filename.indexOf(filter) >= 0) {
                    results.push(filename);
                }
            }
        }
        return results;
    }
}