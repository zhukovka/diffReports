var fs = require("fs");

var assert = require('assert');
const sourceId = "salt_color_trim3k";
const comparedId = "salt_dc_color_trim3k.mov";

describe('Load project', function () {
    describe('project filed parse', function () {
        it('should parse project file', function () {
            const projectString = fs.readFileSync(`projects/mrestore-projects/${sourceId}/project.js`, 'utf8');
            const project = JSON.parse(projectString);

            console.log(project);
            assert.ok(project.id);
        });
    });
});

describe('read files in dir', function () {
    it('should read filenames in a dir', function () {
        const regex = new RegExp(`^ranges_${comparedId}.*\\.js$`);
        const rangesFile = fs.readdirSync(`./projects/mrestore-projects/${sourceId}`).find(file => {
            return regex.test(file);
        });
        console.log(rangesFile);
        assert.ok(rangesFile);
        const ranges = fs.readFileSync(`./projects/mrestore-projects/${sourceId}/${rangesFile}`, 'utf8');
        console.log(JSON.parse(ranges));
        assert.ok(ranges);
    });
});