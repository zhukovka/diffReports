const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        generateProjectsHTML: './generators/generateProjectsHTML.tsx'
    },

    target: 'node',

    externals: [nodeExternals()],

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'generators')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
};