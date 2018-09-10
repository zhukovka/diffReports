const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        generateProjectsHTML: './generators/generateProjectsHTML.tsx',
        generateTestHTML: './generators/generateTestHTML.tsx',
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
                test: /\.css$/,
                use: [
                    'isomorphic-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }
                ]
            },
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