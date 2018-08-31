const {lstatSync, readdirSync, writeFileSync} = require('fs');
const {join} = require('path');

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source => {
    const dirs = readdirSync(source).filter(name => isDirectory(join(source, name)));
    writeFileSync('./projects/projects.json', JSON.stringify(dirs), 'utf8');
    console.log(dirs);
};

const args = process.argv;

getDirectories(args[2]);
