const fs = require('fs');

module.exports = {
    nameSpecFile(file, ext) {
        if (!ext) {
            ext = '.html'
        }
        return file.split(ext).join(`.spec${ext}`);
    },
    createSpecFile(fileName, callback) {
        let specFileName = this.nameSpecFile(fileName, '.html')

        fs.unlink(specFileName, (err) => {
            console.log(`successfully deleted ${specFileName}`);
            fs.copyFile(fileName, specFileName, function() {
                callback(specFileName);
            });
        });
    }
};